// Fails if the live CMU template CSS defines any class we define, so a
// template update can't silently collide with ours. Run: npm run check
import { readFileSync } from "node:fs";

const TEMPLATE = [
  "https://www.cmu.edu/common/standard-v6/css/main.6.7.min.css",
  "https://www.cmu.edu/common/standard-v6/css/print.min.css",
];
const ours = new Set();
for (const f of ["css/cmu-cms.css", "css/cmu-app.css"])
  for (const m of readFileSync(new URL(`../${f}`, import.meta.url), "utf8").matchAll(
    /\.(cmu-[\w-]+)/g,
  ))
    ours.add(m[1]);
const theirs = new Set();
for (const url of TEMPLATE) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  for (const m of (await res.text()).matchAll(/\.(cmu-[\w-]+)/g)) theirs.add(m[1]);
}
const clash = [...ours].filter((c) => theirs.has(c));
if (clash.length) {
  console.error("The template now defines:", clash.join(" "));
  process.exit(1);
}
console.log(`ok: ${ours.size} classes, none in the template (${theirs.size} cmu- classes there)`);
