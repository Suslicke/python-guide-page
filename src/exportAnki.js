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
const BLOCK_OPEN = "@@PYGBLOCK_";
const BLOCK_CLOSE = "_PYGBLOCK@@";

export function mdToAnkiHtml(md) {
  if (!md) return "";

  // 1) Pull fenced code blocks out first so their contents aren't
  //    mangled by the inline replacements below.
  const blocks = [];
  let html = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = blocks.length;
    blocks.push(
      `<pre><code class="language-${lang || "plain"}">${escapeHtml(code)}</code></pre>`,
    );
    return `${BLOCK_OPEN}${idx}${BLOCK_CLOSE}`;
  });

  // 2) Escape the rest so stray < or & don't break rendering.
  html = escapeHtml(html);

  // 3) Inline formatting.
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  // 4) Simple bullet lists (`- item`).
  html = html.replace(/(^|\n)((?:- .+\n?)+)/g, (_, lead, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^- /, "")}</li>`)
      .join("");
    return `${lead}<ul>${items}</ul>`;
  });

  // 5) Put code blocks back in.
  const blockRe = new RegExp(`${BLOCK_OPEN}(\\d+)${BLOCK_CLOSE}`, "g");
  html = html.replace(blockRe, (_, i) => blocks[+i]);

  // 6) Newlines -> <br>. Inside <pre> the browser still respects this
  //    visually, so code formatting survives.
  html = html.replace(/\n/g, "<br>");

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

export function buildAnkiTSV(sections, userState = {}) {
  const rows = [
    "#separator:tab",
    "#html:true",
    "#tags column:3",
    "#guid column:4",
  ];
  sections.forEach((sec, sIdx) => {
    const sectionTag = makeTag("python", sec.cat, sec.title);
    const lvlTags = levelTags(sec.level);
    sec.items.forEach((item, i) => {
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
    });
  });
  return rows.join("\n");
}

export function downloadAnkiDeck(sections, userState = {}) {
  const tsv = buildAnkiTSV(sections, userState);
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
  return { cardCount: sections.reduce((n, s) => n + s.items.length, 0) };
}
