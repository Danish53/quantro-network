import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../app/components/dashboard");
const oldFab =
  "rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/35 transition hover:bg-[#1d4ed8]";
const newFab =
  "rounded-full bg-[#5C5AFF] text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4b49eb]";

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".js"))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes(oldFab)) continue;
  fs.writeFileSync(p, s.split(oldFab).join(newFab));
  console.log("fab", f);
}
