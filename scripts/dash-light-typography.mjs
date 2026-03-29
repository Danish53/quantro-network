import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../app/components/dashboard");
const skip = new Set(["PremiumPlasticCard.js"]);

const rules = [
  [/text-sm text-white outline-none/g, "text-sm text-slate-900 outline-none"],
  [/text-2xl font-bold tracking-tight text-white/g, "text-2xl font-bold tracking-tight text-slate-900"],
  [/text-xl font-bold tracking-tight text-white/g, "text-xl font-bold tracking-tight text-slate-900"],
  [/text-xl font-semibold text-white/g, "text-xl font-semibold text-slate-900"],
  [/text-lg font-semibold text-white/g, "text-lg font-semibold text-slate-900"],
  [/text-lg font-bold text-white/g, "text-lg font-bold text-slate-900"],
  [/text-sm font-semibold text-white sm:text-base/g, "text-sm font-semibold text-slate-900 sm:text-base"],
  [/text-xl font-bold tracking-tight text-white sm:text-2xl/g, "text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"],
];

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".js"))) {
  if (skip.has(f)) continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  const o = s;
  for (const [re, rep] of rules) s = s.replace(re, rep);
  if (s !== o) fs.writeFileSync(p, s);
}
