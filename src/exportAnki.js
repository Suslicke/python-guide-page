// Export the in-app sections data to a tab-separated file Anki Desktop
// can import directly via File -> Import. Header lines starting with "#"
// are Anki import directives:
//   - separator:tab        — column separator
//   - html:true            — render fields as HTML (so <pre><code>, <strong> work)
//   - tags column:3        — column 3 is tag list (space-separated)
//   - guid column:4        — column 4 is the stable GUID; re-importing the same
//                            file updates existing cards instead of duplicating.

// FNV-1a 32-bit hash → hex. Stable across runs and platforms.
// Used as the Anki GUID so re-imports update the same card.
function stableHash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Convert the markdown used in answers to Anki-flavoured HTML.
// Code blocks get a `language-*` class so a Prism.js template inside Anki
// can highlight them. Newlines become <br> at the end because the TSV
// parser cannot have literal newlines inside a field.
const CODE_OPEN = "@@PYGCODE_";
const CODE_CLOSE = "_PYGCODE@@";
const TBL_OPEN = "@@PYGTBL_";
const TBL_CLOSE = "_PYGTBL@@";

// Render a markdown table block (raw lines, all starting with `|`) to HTML.
// First row becomes <thead>, separator `|---|` is skipped, rest are <tbody>.
function renderTable(rawLines) {
  const cells = (line) =>
    line.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  const lines = rawLines.filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return rawLines.join("\n");
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells); // skip separator row
  const th = head.map((c) => `<th>${c}</th>`).join("");
  const tr = body
    .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

export function mdToAnkiHtml(md) {
  if (!md) return "";

  // 1) Strip navigational pointers like "→ See **Section 27**." — these link
  //    to sections of the source app, not to anything inside Anki.
  let html = md.replace(/^\s*(?:→|->)?\s*See \*\*Section[^\n]*\n?/gim, "");

  // 2) Extract fenced code blocks before any other rule touches them.
  const codes = [];
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codes.length;
    codes.push(
      `<pre><code class="language-${lang || "plain"}">${escapeHtml(code)}</code></pre>`,
    );
    return `${CODE_OPEN}${idx}${CODE_CLOSE}`;
  });

  // 3) Extract markdown tables (contiguous lines starting with `|`). They're
  //    rendered to HTML now and stashed so escaping below doesn't mangle them.
  const tables = [];
  html = html.replace(/(?:^|\n)((?:\|[^\n]*\n?)+)/g, (match, block) => {
    const lines = block.trim().split("\n");
    if (lines.length < 2 || !/^\|[\s:-]+\|/.test(lines[1])) return match;
    const idx = tables.length;
    tables.push(renderTable(lines));
    return `\n${TBL_OPEN}${idx}${TBL_CLOSE}\n`;
  });

  // 4) Escape stray HTML in the remaining markdown text.
  html = escapeHtml(html);

  // 5) Block-level rules (after escape — operate on plain markdown chars).
  html = html.replace(/^###\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/(^|\n)\s*---+\s*(?=\n|$)/g, "$1<hr>");

  // 6) Bullet lists (`- item`).
  html = html.replace(/(^|\n)((?:- .+\n?)+)/g, (_, lead, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^- /, "")}</li>`)
      .join("");
    return `${lead}<ul>${items}</ul>`;
  });

  // 7) Inline formatting.
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  // 8) Restore tables (their HTML must not be touched by the rules above).
  const tblRe = new RegExp(`${TBL_OPEN}(\\d+)${TBL_CLOSE}`, "g");
  html = html.replace(tblRe, (_, i) => tables[+i]);

  // 9) Restore code blocks.
  const codeRe = new RegExp(`${CODE_OPEN}(\\d+)${CODE_CLOSE}`, "g");
  html = html.replace(codeRe, (_, i) => codes[+i]);

  // 10) Newlines -> <br>. Block-level tags get cleaned up so Anki doesn't
  //     render extra spacing around tables/lists/code.
  html = html.replace(/\n/g, "<br>");
  html = html.replace(/<br>\s*(<(?:table|ul|hr|h[2-4]|pre)[ >])/g, "$1");
  html = html.replace(/(<\/(?:table|ul|h[2-4]|pre)>)\s*<br>/g, "$1");

  return html;
}

// Anki uses spaces as tag separators and "::" for hierarchy.
function makeTag(...parts) {
  return parts
    .filter(Boolean)
    .map((p) =>
      p
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, ""),
    )
    .filter(Boolean)
    .join("::");
}

// Expand a section's level string into one or more Anki tags. A range like
// "Mid -> Senior" becomes two tags (`level::mid` + `level::senior`) so that
// a single-level filter (`tag:level::senior`) catches mixed cards too.
// "Must know" / "All Levels" stay as single semantic tags.
function levelTags(level) {
  if (!level) return [];
  const norm = level.toLowerCase().replace(/\s+/g, " ").trim();
  if (norm === "must know") return [makeTag("level", "must_know")];
  if (norm === "all levels") return [makeTag("level", "all")];
  return norm
    .split(/\s*(?:→|->)\s*/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => makeTag("level", p));
}

// Build personal tags from in-app state. Same id format as App.jsx:
// `${sectionIndex}-${itemIndex}`. Empty array if user hasn't touched it.
function personalTags(id, { confidence, bookmarks, checked }) {
  const tags = [];
  const c = confidence?.[id];
  if (c === "easy") tags.push("mine::easy");
  else if (c === "medium") tags.push("mine::medium");
  else if (c === "hard") tags.push("mine::hard");
  if (bookmarks?.[id]) tags.push("mine::bookmark");
  if (checked?.[id]) tags.push("mine::reviewed");
  return tags;
}

// Tabs inside fields would break TSV columns. Convert any stray ones to
// spaces — code blocks normally use spaces anyway.
const stripTabs = (s) => s.replace(/\t/g, "    ");

// Categories whose items are summaries / cheat-sheets rather than recall
// prompts ("Q16 — Common coding problems" is a heading, not a question).
// Items in these sections are skipped from the Anki export by default.
const EXCLUDED_CATS = new Set(["must"]);

export function buildAnkiTSV(sections, userState = {}) {
  const rows = [
    "#separator:tab",
    "#html:true",
    "#deck:Python Interview Prep",
    "#tags column:3",
    "#guid column:4",
  ];
  let included = 0;
  let skipped = 0;
  sections.forEach((sec, sIdx) => {
    const sectionExcluded = EXCLUDED_CATS.has(sec.cat);
    const sectionTag = makeTag("python", sec.cat, sec.title);
    const lvlTags = levelTags(sec.level);
    sec.items.forEach((item, i) => {
      // Skip section-level (summary/cheat-sheet) and per-item opt-outs.
      if (sectionExcluded || item.noAnki) {
        skipped++;
        return;
      }
      const id = `${sIdx}-${i}`;
      const front = stripTabs(mdToAnkiHtml(item.q));
      const back = stripTabs(mdToAnkiHtml(item.a));
      const tags = [sectionTag, ...lvlTags, ...personalTags(id, userState)].join(" ");
      // GUID is based on the item's position (or its explicit `id` if set),
      // NOT the question text. This way you can rewrite a question and Anki
      // will update the same card instead of creating a duplicate. To pin a
      // card across reordering, add `id: "stable-slug"` to that item.
      const guid = "pyg_" + stableHash(item.id ?? id);
      rows.push([front, back, tags, guid].join("\t"));
      included++;
    });
  });
  return { tsv: rows.join("\n"), included, skipped };
}

export function downloadAnkiDeck(sections, userState = {}) {
  const { tsv, included, skipped } = buildAnkiTSV(sections, userState);
  const blob = new Blob([tsv], {
    type: "text/tab-separated-values;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `python-prep-anki-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return { cardCount: included, skippedCount: skipped };
}
