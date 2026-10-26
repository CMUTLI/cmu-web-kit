// The Components page lists every component in the docs, built from the
// section headings of the CMU Standard, CMS and App pages and the classes
// listed under each. This rewrites that table.
//   node tools/components.mjs            write the table into docs/components.html
//   node tools/components.mjs --check    fail if the table is out of date
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const docs = new URL("../docs/", import.meta.url);
const read = (f) => readFileSync(new URL(f, docs), "utf8");
const SETS = [
  ["standard", "CMU Standard"],
  ["cms", "CMS Components"],
  ["app", "App Components"],
];
// Sections that explain rather than show a component
const SKIP = new Set(["sections", "more-template", "home", "colors"]);

const text = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const pageTitle = (html) => text(html.match(/<h1>(.*?)<\/h1>/s)[1]);

const rows = [];
for (const [prefix, set] of SETS) {
  const pages = readdirSync(docs).filter((f) => f === prefix + ".html" || f.startsWith(prefix + "-")).sort();
  pages.sort((a, b) => (a === prefix + ".html" ? -1 : b === prefix + ".html" ? 1 : 0));
  for (const file of pages) {
    const html = read(file);
    const page = pageTitle(html);
    const parts = html.split(/^ {6}<h2 id="/m).slice(1);
    for (const part of parts) {
      const [, id, name] = part.match(/^([\w-]+)"[^>]*>(.*?)<\/h2>/s);
      if (SKIP.has(id)) continue;
      const kit = part.match(/<p class="kit-classes">(.*?)<\/p>/s);
      const classes = kit ? [...kit[1].matchAll(/<code>(.*?)<\/code>/g)].map((m) => m[1]).join(", ") : "";
      // A kit component shown among the template's (marked "From the kit")
      const fromKit = prefix === "standard" && /<strong>From the kit<\/strong>/.test(part);
      rows.push({ name: text(name), href: `${file}#${id}`, set: fromKit ? "CMS Components" : set, page, classes });
    }
  }
}

const esc = (s) => s.replace(/&(?!\w+;)/g, "&amp;");
const table = `<!-- components:start (written by tools/components.mjs) -->
      <table class="alternate cmu-full" id="kit-components" data-kit-sortable>
        <thead><tr><th scope="col" data-sort-key="name" aria-sort="ascending"><button class="cmu-sort" type="button">Component<span class="cmu-sort-arrow"> ▲</span></button></th><th scope="col" data-sort-key="set"><button class="cmu-sort" type="button">Set<span class="cmu-sort-arrow"></span></button></th><th scope="col" data-sort-key="page"><button class="cmu-sort" type="button">Page<span class="cmu-sort-arrow"></span></button></th><th scope="col">Classes</th></tr></thead>
        <tbody>
${rows
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) => `          <tr><td><a href="${r.href}">${esc(r.name)}</a></td><td>${r.set}</td><td>${esc(r.page)}</td><td>${r.classes ? `<code>${r.classes.split(", ").join("</code>, <code>")}</code>` : ""}</td></tr>`)
  .join("\n")}
        </tbody>
      </table>
      <!-- components:end -->`;

const file = new URL("components.html", docs);
const html = readFileSync(file, "utf8");
const next = html.replace(/<!-- components:start[\s\S]*?<!-- components:end -->/, table);
if (next === html && !html.includes("<!-- components:start")) throw new Error("components.html has no components:start/end markers");
if (process.argv.includes("--check")) {
  if (next !== html) { console.error("The components table is out of date: run node tools/components.mjs"); process.exit(1); }
  console.log(`ok: the components table lists all ${rows.length}`);
} else {
  writeFileSync(file, next);
  console.log(`components.html lists ${rows.length} components`);
}
