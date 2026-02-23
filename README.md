# eslint-plugin-comment-cleaner

> ESLint plugin to detect and flag commented-out code in your JavaScript and TypeScript projects.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-comment-cleaner.svg)](https://www.npmjs.com/package/eslint-plugin-comment-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Built on the same smart detection engine as the [comment-cleaner CLI](https://www.npmjs.com/package/@youngemmy/comment-cleaner).

---

## ✨ Features

- 🧠 **Smart detection** — knows the difference between explanatory comments and actual dead code
- 🔒 **@keep annotation** — mark any comment to permanently suppress the warning
- 🏷️ **Severity info** — every warning tells you if the block is high, medium, or low severity
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

### ESLint v9 (Flat config — `eslint.config.js`)

```js
import commentCleaner from "eslint-plugin-comment-cleaner";

export default [
  {
    plugins: {
      "comment-cleaner": commentCleaner,
    },
    rules: {
      "comment-cleaner/no-commented-code": "warn",
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
    "comment-cleaner/no-commented-code": "warn",
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

## ⚙️ Rule Options

### `comment-cleaner/no-commented-code`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `severity` | `"warn"` \| `"error"` | `"warn"` | ESLint severity level |
| `ignorePatterns` | `string[]` | `[]` | Regex patterns — matching comments are ignored |

**Example with options:**

```js
rules: {
  "comment-cleaner/no-commented-code": ["warn", {
    ignorePatterns: ["eslint-disable", "prettier-ignore", "webpack"]
  }]
}
```

---

## 🔒 @keep Annotation

Add `@keep` anywhere in a comment to permanently suppress the warning for that block:

```js
// @keep const LEGACY_URL = 'https://legacy.api.com'; // needed for migration
// @keep const OLD_TIMEOUT = 3000;

/* @keep
  .old-card {
    display: none;
  }
*/
```

---

## 🧠 How Detection Works

Only flags **actual dead code** — not useful comments.

### ✅ These are IGNORED

```js
// Load posts from Firebase
// TODO: add retry logic
// Helper function to split the title
/** @param {string} id - The user ID */
// @keep const LEGACY_URL = 'https://legacy.api.com';
```

### ❌ These are FLAGGED

```js
// import TwitterTimeline from "../components/TwitterTimeline";
// const BASE_URL = 'https://api.legacy.com/v1';
// function oldGetUser(id) { return db.query(id); }
// this.state = { loading: false };
```

---

## 🔗 Related

- [comment-cleaner CLI](https://www.npmjs.com/package/@youngemmy/comment-cleaner) — scan, fix, watch, and report from the terminal
- [GitHub](https://github.com/Youngemmy5956/eslint-plugin-comment-cleaner)

---

## 👨‍💻 Author

**Nwamini Emmanuel O**
- GitHub: [@Youngemmy5956](https://github.com/Youngemmy5956)
- npm: [@youngemmy](https://www.npmjs.com/~youngemmy)

---

## 📝 License

MIT © 2026 [Nwamini Emmanuel O](https://github.com/Youngemmy5956)
