import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../app/components/dashboard");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));

const rules = [
  [
    /rounded-\[12px\] border border-white\/\[0\.08\] bg-\[#161b33\] p-5 shadow-\[inset_0_1px_0_0_rgba\(255,255,255,0\.04\)\] sm:p-6/g,
    "rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
  ],
  [/rounded-\[12px\] border border-white\/\[0\.08\] bg-\[#161b33\] p-5 sm:p-6/g, "rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"],
  [/rounded-\[12px\] border border-white\/\[0\.08\] bg-\[#161b33\] p-6/g, "rounded-xl border border-slate-200 bg-white p-6 shadow-sm"],
  [/rounded-\[12px\] border border-white\/\[0\.08\] bg-\[#161b33\] p-5 sm:p-8/g, "rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"],
  [
    /rounded-\[12px\] border border-white\/\[0\.08\] bg-\[#161b33\] p-6 shadow-\[inset_0_1px_0_0_rgba\(255,255,255,0\.04\)\]/g,
    "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
  ],
  [/border-\[#2a3558\] bg-\[#14182b\]/g, "border-slate-200 bg-white"],
  [/bg-\[#14182b\]/g, "bg-slate-50"],
  [/border-white\/\[0\.06\] bg-\[#1C1C30\]/g, "border-slate-200 bg-white shadow-sm"],
  [/bg-\[#14142a\]\/80/g, "bg-slate-50"],
  [/border-white\/\[0\.08\] bg-\[#14182b\]/g, "border-slate-200 bg-slate-50"],
  [/border-dashed border-white\/\[0\.08\]/g, "border-dashed border-slate-200"],
  [/border-white\/\[0\.04\]/g, "border-slate-100"],
  [/border-white\/\[0\.08\]/g, "border-slate-200"],
];

for (const f of files) {
  if (f === "PremiumPlasticCard.js") continue;
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  const o = s;
  for (const [re, rep] of rules) {
    s = s.replace(re, rep);
  }
  if (s !== o) {
    fs.writeFileSync(p, s);
    console.log("updated", f);
  }
}
