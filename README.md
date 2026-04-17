<div align="center">

# 🐍 Python Interview Prep

**A complete, interactive Python interview guide — Trainee through Lead.**

[![Live site](https://img.shields.io/badge/live-python--guide.suslicke.com-2dd4bf?style=for-the-badge)](https://python-guide.suslicke.com/)
[![Status](https://img.shields.io/badge/status-production-22c55e?style=for-the-badge)](https://python-guide.suslicke.com/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**→ [python-guide.suslicke.com](https://python-guide.suslicke.com/) ←**

</div>

---

## 📚 What's inside

**305 topics across 28 categorized sections**, from `is` vs `==` all the way to Unit of Work, CQRS, Circuit Breakers, and production-ready exception hierarchies. Every answer is hand-written with code samples, common interview gotchas, and real-world production pitfalls.

<table>
<tr>
<td width="33%" valign="top">

### 🎯 Interview-ready content
- ⭐ **Interview Must-Have** — 20 topics every candidate is asked
- 28 sections, Trainee → Lead
- Paired **✅ Good vs ❌ Bad** example in every section
- Production code, not toy snippets

</td>
<td width="33%" valign="top">

### ⚡ Built for speed
- 🔍 Instant full-text search with live match count
- ⌨️ Global shortcuts: `/` and `⌘K` to focus search, `Esc` to clear
- 🏷️ Category filtering (Basics, OOP, Async, DBs, …)
- 🔗 Clickable "Section N" cross-references

</td>
<td width="33%" valign="top">

### 📊 Track your progress
- ✅ Checkboxes — auto-saved to `localStorage`
- 🎯 **Shift+click** to toggle a whole range at once
- 📋 Section-level checkbox with `none / some / all` indicator
- 🎨 Light / Dark theme toggle
- 🙋 Optional username for per-user progress stats

</td>
</tr>
</table>

---

## 🎨 Features at a glance

| Feature | Details |
|---|---|
| 🌓 **Theme toggle** | Dark by default, one-click switch to light. Preference persists in `localStorage` |
| 🔍 **Search with highlight** | Matched substrings highlighted in every question title |
| 🔗 **Section links** | References like `See Section 9` become clickable anchors that open + scroll |
| ⚡ **Bulk-mark progress** | Shift+click for ranges; section checkbox for whole-section toggle |
| 🎯 **Match counter** | Live "N matches" badge as you type |
| 🧠 **Consent-first analytics** | Google Analytics with Consent Mode v2, denied by default |
| 📱 **Mobile-friendly** | Categories scroll horizontally; sticky header stays usable |
| 🚀 **Zero backend** | Pure static SPA deployed on Cloudflare Workers |

---

## 🧩 Section index

<details>
<summary><b>Click to expand — all 28 sections</b></summary>

| # | Section | Level | Focus |
|---|---|---|---|
| ⭐ | Interview Must-Have | Must know | The 20-item short list |
| 1 | Foundations | Trainee | Bytecode, GIL, reference model |
| 2 | Lists, Slicing & Indexing | Trainee | \`enumerate\`, slice tricks |
| 3 | OOP & SOLID | Trainee+ | Composition, dunder methods |
| 4 | Decorators | Mid | \`@wraps\`, parameterized decorators |
| 5 | Generators & Iterators | Mid | \`yield from\`, lazy pipelines |
| 6 | Threading / MP / Async | Mid+ | GIL, process pools, event loops |
| 7 | Hashing | Mid | \`__hash__\` + \`__eq__\` contract |
| 8 | Garbage Collection | Mid | Refcounts, cycles, \`weakref\` |
| 9 | Coding Problems | All | Two-pointer, sliding window, BFS |
| 10 | Architecture Patterns | Senior | GoF + Hexagonal + UoW + Circuit Breaker |
| 11 | Strings, Bytes & Encoding | Trainee+ | UTF-8, BOM, codecs |
| 12 | Numbers & Floats | Trainee+ | \`Decimal\`, \`math.isclose\` |
| 13 | Functions Deep Dive | Mid | Closures, keyword-only args |
| 14 | Modules & Packaging | Mid | Imports, \`__init__.py\`, packaging |
| 15 | Type Hints | Mid | Protocol, ABC, Generics, \`TypedDict\` |
| 16 | Standard Library | All | \`collections\`, \`itertools\`, \`pathlib\` |
| 17 | File I/O | Trainee | Context managers, encoding |
| 18 | Testing with pytest | Mid | Fixtures, parametrize, marks |
| 19 | Performance & Profiling | Senior | cProfile, \`@cache\`, heapq |
| 20 | Security | Mid+ | SQL injection, password hashing |
| 21 | Async/Await Deep Dive | Senior | \`gather\`, \`TaskGroup\`, cancellation |
| 22 | Databases & ORMs | Mid+ | N+1, eager load, transactions |
| 23 | Debugging & Introspection | Mid | \`breakpoint()\`, structured logging |
| 24 | Modern Python (3.10→3.13) | All | \`match\`, \`|\` unions, ExceptionGroup |
| 25 | Tricky Questions | All | deepcopy, shared state gotchas |
| 26 | Pythonic Idioms | All | Walrus, dict merge, \`zip(strict=True)\` |
| 27 | Exceptions | All | \`raise from\`, custom hierarchies |

</details>

---

## 🖥️ Local development

```bash
git clone https://github.com/Suslicke/python-guide-page.git
cd python-guide-page
npm install
npm run dev
```

Open http://localhost:5173 — hot reload works out of the box.

### Build & preview production bundle

```bash
npm run build      # → dist/
npm run preview    # serves dist/ on :4173
```

### Deploy to Cloudflare Workers

The repo ships with a ready-to-use [`wrangler.jsonc`](wrangler.jsonc) config that serves `dist/` via [Cloudflare Workers + Static Assets](https://developers.cloudflare.com/workers/static-assets/).

```bash
npx wrangler deploy
```

---

## 🧰 Tech stack

- **React 18** — functional components, hooks, context for section navigation
- **Vite 7** — dev server + production bundler
- **Tailwind CSS 3** — `darkMode: "class"` for theme switching via CSS variables
- **lucide-react** — icon set
- **Cloudflare Workers** + Static Assets — edge deployment
- **Google Analytics 4** — with Consent Mode v2 (denied by default until user accepts)

No runtime backend. No database. No auth. Just static assets served from the edge with `localStorage` for user state.

---

## 🔐 Privacy

- Analytics loads with `analytics_storage: "denied"` until the user clicks **Accept** in the cookie banner.
- GA4 anonymize-IP is on.
- If a username is entered, it's sent as a GA4 `user_id` + `user_property` — **only** after consent is granted. Leave it blank to stay fully anonymous.
- All progress (checkboxes, theme, username) is stored client-side in `localStorage` — nothing leaves the browser unless you opt in.

---

## 🤝 Contributing

Found a mistake? Want to add a topic? Open an issue or a pull request.

The content data is a single JSX file ([src/App.jsx](src/App.jsx)) — each section is a `{ cat, icon, title, level, items: [{ q, a }] }` object. Markdown-ish rendering (bold, inline code, code blocks, tables, ordered/unordered lists) is handled by the inline renderer in the same file.

---

<div align="center">

Created by **Andrei** · [@Suslicke](https://t.me/Suslicke)

_If this helped you land a job, a ⭐ would make my day._

</div>
