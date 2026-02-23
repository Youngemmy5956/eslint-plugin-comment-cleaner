# eslint-plugin-comment-cleaner

> ESLint plugin to detect, flag, and **auto-fix** commented-out code in your JavaScript and TypeScript projects.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-comment-cleaner.svg)](https://www.npmjs.com/package/eslint-plugin-comment-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Built on the same smart detection engine as the [comment-cleaner CLI](https://www.npmjs.com/package/@youngemmy/comment-cleaner).

---

## ✨ Features

- 🔧 **Auto-fix** — run `eslint --fix` to automatically remove all flagged comments
- 🧠 **Smart detection** — knows the difference between explanatory comments and actual dead code
- 📦 **`no-commented-imports`** — dedicated rule that specifically targets commented-out import and require statements
- 🔒 **@keep annotation** — mark any comment to permanently suppress the warning
- ⚙️ **Configurable** — set custom ignore patterns per project
- 🔌 **ESLint v7, v8, v9** — supports both legacy and flat config
- ⚡ **Zero dependencies**

---

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-comment-cleaner
```

---

## 🚀 Setup

### ESLint v9 (Flat config — `eslint.config.js` or `eslint.config.mjs`)

```js
import commentCleaner from "eslint-plugin-comment-cleaner";

export default [
  {
    plugins: {
      "comment-cleaner": commentCleaner,
    },
    rules: {
      "comment-cleaner/no-commented-code":    "warn",
      "comment-cleaner/no-commented-imports": "warn",
    },
  },
];
```

Or use the built-in recommended flat config:

```js
import commentCleaner from "eslint-plugin-comment-cleaner";

export default [
  commentCleaner.configs["flat/recommended"],
];
```

---

### ESLint v7 / v8 (Legacy config — `.eslintrc.js`)

```js
module.exports = {
  plugins: ["comment-cleaner"],
  rules: {
    "comment-cleaner/no-commented-code":    "warn",
    "comment-cleaner/no-commented-imports": "warn",
  },
};
```

Or use the recommended config:

```js
module.exports = {
  extends: ["plugin:comment-cleaner/recommended"],
};
```

---

## 🔧 Auto-fix

Both rules support ESLint's `--fix` flag. Running this will automatically delete all flagged commented-out code:

```bash
npx eslint ./src --fix
```

No manual deletion needed — ESLint removes the entire comment line including whitespace.

---

## 📏 Rules

### `comment-cleaner/no-commented-code`

Detects and flags commented-out code of any kind — variables, functions, classes, JSX, assignments, and more.

```js
// ❌ Flagged — will be auto-removed with --fix
// const BASE_URL = 'https://api.legacy.com/v1';
// function oldGetUser(id) { return db.query(id); }
// this.state = { loading: false };

// ✅ Ignored — explanatory comments
// Load posts from Firebase
// TODO: add retry logic
// @keep const LEGACY_URL = 'https://legacy.api.com';
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ignorePatterns` | `string[]` | `[]` | Regex patterns — matching comments are ignored |

```js
rules: {
  "comment-cleaner/no-commented-code": ["warn", {
    ignorePatterns: ["eslint-disable", "prettier-ignore"]
  }]
}
```

---

### `comment-cleaner/no-commented-imports`

A focused rule specifically for commented-out import and require statements — the most common type of dead code in JS/TS projects.

```js
// ❌ Flagged — will be auto-removed with --fix
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import type { User } from './types';
// const db = require('./db');

// ✅ Ignored
// @keep import legacy from './old-api'; // needed for migration
// TODO: re-add axios when backend is ready
```

No options needed — it just works.

---

## 🔒 @keep Annotation

Add `@keep` anywhere in a comment to permanently suppress the warning for that block:

```js
// @keep const LEGACY_URL = 'https://legacy.api.com';
// @keep import { oldHelper } from './legacy';

/* @keep
  .old-card { display: none; }
*/
```

---

## 🧠 How Detection Works

Only flags **actual dead code** — not comments that explain what your code does.

### ✅ These are IGNORED

```js
// Load posts from Firebase
// TODO: add retry logic
// Helper function to split the title
/** @param {string} id - The user ID */
// @keep const LEGACY_URL = 'https://legacy.api.com';
// https://docs.firebase.google.com
```

### ❌ These are FLAGGED (and auto-fixed)

```js
// import TwitterTimeline from "../components/TwitterTimeline";
// const BASE_URL = 'https://api.legacy.com/v1';
// function oldGetUser(id) { return db.query(id); }
// this.state = { loading: false };
// fetchUser(id).then(res => res.json());
```

---

## 💡 Tips

- Run `npx eslint ./src --fix` to auto-remove everything in one shot
- Use `no-commented-imports` alongside `no-commented-code` for full coverage
- Add `@keep` to any comment you want to intentionally preserve
- Use `ignorePatterns` to skip comments matching specific strings or patterns
- Both rules work with TypeScript files out of the box

---

## 🔗 Related

- [comment-cleaner CLI](https://www.npmjs.com/package/@youngemmy/comment-cleaner) — scan, fix, watch, and generate reports from the terminal
- [GitHub](https://github.com/Youngemmy5956/eslint-plugin-comment-cleaner)

---

## 👨‍💻 Author

**Nwamini Emmanuel O**
- GitHub: [@Youngemmy5956](https://github.com/Youngemmy5956)
- npm: [@youngemmy](https://www.npmjs.com/~youngemmy)

---

## 📝 License

MIT © 2026 [Nwamini Emmanuel O](https://github.com/Youngemmy5956)