import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'clean-css';
import Less from 'less';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // 不带 /

async function writeFileSync(file, content) {
  await fs.ensureDir(path.dirname(file));
  return fs.writeFileSync(file, content);
}

async function writeFile(file, content) {
  await fs.ensureDir(path.dirname(file));
  return fs.writeFile(file, content);
}

async function less(content, resolvePath = path.resolve(__dirname, '../core')) {
  let R;
  try {
    const rs = await Less.render(content, { paths: [resolvePath] });
    if (rs.css) R = rs.css;
  } catch (e) {
    console.error(`less exp:${e.message}`);
  }

  return R;
}

async function prefixer(content, { from = undefined, to = undefined } = {}) {
  let R;
  try {
    const rs = postcss([autoprefixer]).process(content, { from, to });

    if (rs) {
      if (rs.css) R = rs.css;
      const warns = rs.warnings();
      if (warns) for (const warn of warns) console.warn(warn.toString());
    }
  } catch (e) {
    console.error(`prefixer exp:${e.message}`);
  }

  return R;
}

function cleanCss(content, opts = {}) {
  opts = { compatibility: '*,-properties.zeroUnits', ...opts };

  return new Promise((resolve, reject) => {
    if (content instanceof Promise) {
      content
        .then((c) => {
          const minified = new cleanCSS(opts).minify(c);
          resolve(minified.styles);
        })
        .catch((err) => {
          reject(err);
          throw err;
        });
      return;
    }
    const minified = new cleanCSS(opts).minify(content);
    resolve(minified.styles);
  });
}

export { less, writeFileSync, writeFile, prefixer, cleanCss };
