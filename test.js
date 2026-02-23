"use strict";

const plugin = require("./index.js");
const noCommentedCode = plugin.rules["no-commented-code"];
const noCommentedImports = plugin.rules["no-commented-imports"];

let passed = 0, failed = 0;

function makeContext(commentText, type = "Line") {
  const reported = [];
  const fixes = [];
  const comment = {
    type,
    value: " " + commentText,
    range: [0, commentText.length + 3],
    loc: { start: { line: 1 } },
  };
  const fakeSourceCode = {
    getAllComments: () => [comment],
    getText: () => "//" + comment.value + "\n",
  };
  const fakeContext = {
    options: [{}],
    getSourceCode: () => fakeSourceCode,
    report: (data) => {
      reported.push(data);
      if (data.fix) {
        const fakeFixer = { removeRange: (r) => ({ type: "remove", range: r }) };
        fixes.push(data.fix(fakeFixer));
      }
    },
  };
  return { reported, fixes, fakeContext };
}

function test(ruleName, rule, description, commentText, shouldFlag, hasFix = true) {
  const { reported, fixes, fakeContext } = makeContext(commentText);
  const listeners = rule.create(fakeContext);
  listeners.Program();
  const wasFlagged = reported.length > 0;
  const hasFixFn = fixes.length > 0;
  const ok = wasFlagged === shouldFlag && (!shouldFlag || !hasFix || hasFixFn);

  if (ok) { console.log(`  ✅ [${ruleName}] ${description}`); passed++; }
  else {
    console.log(`  ❌ [${ruleName}] ${description} — expected flagged=${shouldFlag} fix=${hasFix} got flagged=${wasFlagged} fix=${hasFixFn}`);
    failed++;
  }
}

console.log("\n🧪 Running eslint-plugin-comment-cleaner v1.1.0 tests\n");

console.log("── no-commented-code ────────────────────────────────");
test("no-commented-code", noCommentedCode, "flags commented const", "const BASE_URL = 'https://api.com';", true);
test("no-commented-code", noCommentedCode, "flags commented function call", "fetchUser(id).then(res => res.json());", true);
test("no-commented-code", noCommentedCode, "flags commented import", "import axios from 'axios';", true);
test("no-commented-code", noCommentedCode, "flags assignment", "this.state = { loading: false };", true);
test("no-commented-code", noCommentedCode, "ignores TODO", "TODO: add retry logic", false);
test("no-commented-code", noCommentedCode, "ignores explanatory comment", "Load posts from Firebase", false);
test("no-commented-code", noCommentedCode, "ignores @keep", "@keep const OLD_URL = 'https://legacy.api.com';", false);
test("no-commented-code", noCommentedCode, "ignores JSDoc", "@param {string} id - The user ID", false);

console.log("\n── no-commented-imports ─────────────────────────────");
test("no-commented-imports", noCommentedImports, "flags commented import from", "import axios from 'axios';", true);
test("no-commented-imports", noCommentedImports, "flags commented named import", "import { useState } from 'react';", true);
test("no-commented-imports", noCommentedImports, "flags commented require", "const db = require('./db');", true);
test("no-commented-imports", noCommentedImports, "flags commented type import", "import type { User } from './types';", true);
test("no-commented-imports", noCommentedImports, "ignores @keep import", "@keep import axios from 'axios';", false);
test("no-commented-imports", noCommentedImports, "ignores normal comment", "Load posts from Firebase", false);
test("no-commented-imports", noCommentedImports, "ignores TODO", "TODO: add axios back when API is ready", false);

console.log(`\n${"─".repeat(50)}`);
console.log(`  ${passed} passed  |  ${failed} failed`);
if (failed === 0) console.log("\n  🎉 All tests passed!\n");
else console.log("\n  ⚠️  Some tests failed.\n");