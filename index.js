/**
 * eslint-plugin-comment-cleaner
 * ESLint plugin to detect commented-out code in your codebase.
 * Uses the same smart detection logic as the comment-cleaner CLI.
 */

"use strict";

// ─── Code detection heuristics (same as CLI) ─────────────────────────────────
const CODE_SIGNALS = [
  /\b(const|let|var)\s+\w+\s*[=:({;]/,
  /\bfunction\s+\w+\s*\(/,
  /\bclass\s+\w+[\s{(]/,
  /\bimport\s+.+\s+from\s+['"`]/,
  /\bimport\s*{/,
  /\bexport\s+(default\s+)?(function|class|const|let|var)\b/,
  /\brequire\s*\(/,
  /\breturn\s+.+[;)]/,
  /\bthrow\s+new\s+\w+/,
  /\w[\w.[\]]*\s*=[^=>]\s*.+/,
  /this\.\w+\s*=/,
  /\w+\.\w+\s*=\s*{/,
  /\w[\w.]*\s*\(.+\)\s*[;{,)]/,
  /\(.*\)\s*=>/,
  /\w+\s*=>\s*[{(]/,
  /\b(if|while|for)\s*\(.+\)/,
  /^\s*<[A-Z]\w+[\s/>]/,
  /^\s*<\/\w+>/,
  /^\s*[}\]]{1,3}\s*[;,)]*\s*$/,
  /\w.{4,};\s*$/,
  /\bdef\s+\w+\s*\(/,
  /\bself\.\w+\s*[=(]/,
  /\bprint\s*\(.+\)/,
  /\bfunc\s+\w+\s*\(/,
  /\bfmt\.\w+\s*\(/,
  /\b:=\s*/,
  /\b(public|private|protected|static|final)\s+\w+/,
  /\bSystem\.out\./,
  /\bvoid\s+\w+\s*\(/,
  /\bnew\s+\w+\s*\(/,
  /\bfn\s+\w+\s*\(/,
  /\blet\s+mut\s+\w+/,
  /\bprintln!\s*\(/,
  /\buse\s+\w+::/,
  /\$\w+\s*=/,
  /\becho\s+/,
  /\b(int|void|char|float|double|bool|auto)\s+\w+\s*[=(;{]/,
  /\bstd::\w+/,
  /\b#include\s*[<"]/,
  /\bprintf\s*\(/,
];

const PROSE_SIGNALS = [
  /^(TODO|FIXME|HACK|NOTE|XXX|BUG|OPTIMIZE|REVIEW|WARN|WARNING|NB)\b/i,
  /^https?:\/\//,
  /^[-=*#]+\s/,
  /^@(param|returns?|type|throws?|deprecated|see|example|author)\b/i,
  /^[A-Z][a-z]+ [a-z]/,
  /\.\s*$/,
  /^(TODO|The |A |An |We |It |Used|Use|Handles?|Helper|Check|Load|Set|Get|Add|Remove|Create|Update|Delete|Init|Initialize|Format|Convert|Parse|Build|Render|Show|Hide|Listen|Watch|Fetch|Send|Save|Clear|Reset|Toggle|Dispatch|Extract|Calculate|Find|Sort|Filter|Map|Wrap|Only|Also|Note|See|For|When|If this|Cleanup)\b/i,
  /^[A-Z][^{};]+$/,
];

const MULTI_LINE_THRESHOLD = 2;

function looksLikeCode(text) {
  const t = text.trim();
  if (!t || t.length < 5) return false;
  // @keep annotation — always skip
  if (/@keep\b/i.test(t)) return false;
  for (const p of PROSE_SIGNALS) if (p.test(t)) return false;
  let score = 0;
  for (const p of CODE_SIGNALS) if (p.test(t)) score++;
  return score >= 1;
}

function looksLikeCodeBlock(lines) {
  // @keep annotation anywhere in block — skip
  if (lines.some(l => /@keep\b/i.test(l))) return false;
  const combined = lines.map(l => l.trim()).join(" ");
  if (!combined || combined.length < 10) return false;
  for (const p of PROSE_SIGNALS) if (p.test(combined.trim())) return false;
  let score = 0;
  for (const p of CODE_SIGNALS) if (p.test(combined)) score++;
  for (const line of lines) {
    for (const p of CODE_SIGNALS) if (p.test(line.trim())) score++;
  }
  return score >= MULTI_LINE_THRESHOLD;
}

function getSeverityLabel(lineCount) {
  if (lineCount >= 10) return "high (10+ lines)";
  if (lineCount >= 4)  return "medium (4-9 lines)";
  return "low (1-3 lines)";
}

// ─── The ESLint rule ──────────────────────────────────────────────────────────
const noCommentedCode = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow commented-out code",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/Youngemmy5956/eslint-plugin-comment-cleaner",
    },
    messages: {
      commentedCode:
        "Commented-out code detected (severity: {{severity}}). Remove it or add @keep to suppress.",
    },
    schema: [
      {
        type: "object",
        properties: {
          severity: {
            type: "string",
            enum: ["error", "warn"],
            default: "warn",
          },
          ignorePatterns: {
            type: "array",
            items: { type: "string" },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options       = context.options[0] || {};
    const ignorePatterns = (options.ignorePatterns || []).map(p => new RegExp(p));
    const sourceCode    = context.getSourceCode ? context.getSourceCode() : context.sourceCode;

    function isIgnored(text) {
      return ignorePatterns.some(p => p.test(text));
    }

    function reportBlock(node, lines) {
      const lineCount = lines.length;
      const severity  = getSeverityLabel(lineCount);
      context.report({
        node,
        messageId: "commentedCode",
        data: { severity },
      });
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        let i = 0;
        while (i < comments.length) {
          const comment = comments[i];

          // ── Block comment /* ... */ ────────────────────────────────────────
          if (comment.type === "Block") {
            const raw   = comment.value;
            const lines = raw.split("\n").map(l => l.replace(/^[\s*]+/, "").trim()).filter(Boolean);

            if (!isIgnored(raw) && looksLikeCodeBlock(lines)) {
              reportBlock(comment, lines);
            }
            i++;
            continue;
          }

          // ── Line comment // ────────────────────────────────────────────────
          if (comment.type === "Line") {
            const text = comment.value.trim();

            if (isIgnored(text) || !looksLikeCode(text)) { i++; continue; }

            // Collect consecutive line comments that are also code
            const group = [comment];
            let j = i + 1;
            while (j < comments.length) {
              const next = comments[j];
              if (
                next.type === "Line" &&
                next.loc.start.line === comments[j - 1].loc.start.line + 1
              ) {
                const nextText = next.value.trim();
                if (looksLikeCode(nextText) && !isIgnored(nextText)) {
                  group.push(next);
                  j++;
                  continue;
                }
              }
              break;
            }

            reportBlock(group[0], group.map(c => c.value.trim()));
            i = j;
            continue;
          }

          i++;
        }
      },
    };
  },
};

// ─── Plugin export ────────────────────────────────────────────────────────────
module.exports = {
  meta: {
    name: "eslint-plugin-comment-cleaner",
    version: "1.0.0",
  },

  rules: {
    "no-commented-code": noCommentedCode,
  },

  // Recommended config for ESLint v8 (legacy)
  configs: {
    recommended: {
      plugins: ["comment-cleaner"],
      rules: {
        "comment-cleaner/no-commented-code": "warn",
      },
    },

    // Flat config for ESLint v9+
    "flat/recommended": {
      plugins: {
        "comment-cleaner": {
          rules: { "no-commented-code": noCommentedCode },
        },
      },
      rules: {
        "comment-cleaner/no-commented-code": "warn",
      },
    },
  },
};
