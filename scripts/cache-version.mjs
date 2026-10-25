// Keep local stylesheets and shared JS consistent across public pages.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
if (!version || !/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error('Usage: node scripts/cache-version.mjs 20261025-2');
const files = ['index.html',...fs.readdirSync(path.join(root,'projects')).filter(f=>f.endsWith('.html')).map(f=>'projects/'+f)];
for (const name of files) {
  const file = path.join(root,name);
  const html = fs.readFileSync(file,'utf8');
  fs.writeFileSync(file,html.replace(/((?:css\/(?:style|refresh)\.css|js\/main\.js)\?v=)[^"\s]+/g, `$1${version}`));
}
console.log(`Cache version ${version}: ${files.length} pages.`);
