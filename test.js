/**
 * Basic test for eslint-plugin-comment-cleaner
 * Run: node test.js
 */

"use strict";

const plugin = require("./index.js");
const rule   = plugin.rules["no-commented-code"];

let passed = 0;
let failed = 0;

function test(description, commentText, shouldFlag) {
  // Simulate what ESLint does — build a fake context and run the rule
  const reported = [];
  const fakeComment = {
    type: "Line",
    value: " " + commentText,
    loc: { start: { line: 1 } },
  };

  const fakeContext = {
    options: [{}],
    getSourceCode: () => ({ getAllComments: () => [fakeComment] }),
    report: (data) => reported.push(data),
  };

  const listeners = rule.create(fakeContext);
  listeners.Program();

  const wasFlagged = reported.length > 0;
  const ok = wasFlagged === shouldFlag;

  if (ok) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.log(`  ❌ ${description} — expected ${shouldFlag ? "FLAGGED" : "IGNORED"} but got ${wasFlagged ? "FLAGGED" : "IGNORED"}`);
    failed++;
  }
}

console.log("\n🧪 Running eslint-plugin-comment-cleaner tests\n");

console.log("Should FLAG (dead code):");
test("commented import",           "import TwitterTimeline from '../components/TwitterTimeline';", true);
test("commented const",            "const BASE_URL = 'https://api.legacy.com/v1';",               true);
test("commented function call",    "fetchUser(id).then(res => res.json());",                      true);
test("commented variable",         "const timeout = 5000;",                                       true);
test("commented assignment",       "this.state = { loading: false };",                            true);

console.log("\nShould IGNORE (explanatory comments):");
test("TODO comment",               "TODO: add retry logic",                                       false);
test("explanatory comment",        "Load posts from Firebase",                                    false);
test("helper description",         "Helper function to split the title",                          false);
test("@keep annotation",           "@keep const OLD_URL = 'https://legacy.api.com';",             false);
test("JSDoc param",                "@param {string} id - The user ID",                            false);
test("URL comment",                "https://docs.firebase.google.com/api",                        false);

console.log(`\n${"─".repeat(40)}`);
console.log(`  ${passed} passed  |  ${failed} failed`);
if (failed === 0) console.log("\n  🎉 All tests passed!\n");
else console.log("\n  ⚠️  Some tests failed.\n");
