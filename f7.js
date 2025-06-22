import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { less, prefixer, cleanCss, writeFile } from './utils/tool.js';
import Cfg from './config.js';
import pkg from './package.json' with { type: 'json' };

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // 不带 /

let cfg = Cfg;

const env = process.env.NODE_ENV || 'production'; // 'dev'; // 默认开发环境
const dev = !env.startsWith('prod'); // production
const banner = getBanner();

let _prj = ''; // 项目名称
let _dir = ''; // 项目目录
let output = '';

/**
 * 根据f7.config.js 配置，修改项目 app.js，生成项目css文件
 * @param {string} dir
 * @param {string} name
 * @param {*} cb
 */
async function buildF7(dir, name, cb) {
  _dir = dir;
  _prj = name;

  await getConfig();
  getOutput();

  let cbs = 0;
  function onCb() {
    cbs += 1;
    // 最后一次回调
    if (cbs === 4 && cb) cb();
  }

  await makeApp(onCb);
  await buildBase(onCb);
  await buildExtra(onCb);
  await createVarsLess(onCb);
}

/**
 * 修改 app.js，config/f7.js 中配置模块添加其中
 * @param {*} cb
 */
async function makeApp(cb) {
  const components = [];
  // 通过项目配置获取组件样式

  cfg.components.forEach((name) => {
    const dir = path.resolve(__dirname, `./lib/${name}`);
    if (fs.existsSync(`${dir}/${name}.js`)) {
      const cap = capitalized(name);
      components.push({ name, cap });
    }
  });
  // console.log('makeApp:', { components });

  // 根据项目配置修改 应用app.js
  await addAppModule(components);

  if (cb) cb();
}

/**
 * Build CSS Core，根据配置，生成f7的基本 css文件
 * 该文件被所有wia应用共用
 * @param {function} cb
 */
async function buildBase(cb) {
  try {
    const lessContent = await createBaseLess();

    let css;
    try {
      css = await less(lessContent, path.resolve(__dirname, '.'));
      css = await prefixer(css);
    } catch (e) {
      console.error(e);
    }

    // lessVars.forEach((v, k) => {
    //   cssContent = cssContent
    //     .replace(new RegExp(`--${v}\\s*:`, 'gi'), `--f7-${k}:`)
    //     .replace(new RegExp(`var\\(--${v}([),])`, 'gi'), `var(--f7-${k}$1`);
    // });

    // Write file
    writeFile(`${output}/f7${cfg.rtl ? '.rtl' : ''}.css`, `${css}`);

    // Minified
    const minifiedContent = await cleanCss(css);

    // Write file
    writeFile(`${output}/f7${cfg.rtl ? '.rtl' : ''}.min.css`, `${banner}\n${minifiedContent}`);

    if (cb) cb();
  } catch (e) {
    console.error(`buildBase exp:${e.message}`);
  }
}

/**
 * Build App's Extra CSS Bundle
 * 根据 config/f7.js 配置中额外增加的组件，生成应用css
 * @param {*} cb
 */
async function buildExtra(cb) {
  const components = [];
  // 通过项目配置获取组件样式
  cfg.components.forEach((name) => {
    const dir = path.resolve(__dirname, `./lib/${name}`);

    if (fs.existsSync(`${dir}/${name}.less`)) components.push(name);
  });

  // console.log('buildPart:', { components });
  // 根据项目配置生成 转换 less 文件
  const lessContent = await createExtraLess(components);
  const outputFileName = `f7.${_prj}${cfg.rtl ? '.rtl' : ''}`;

  let css;
  try {
    css = await less(lessContent, path.resolve(__dirname, '.'));
    css = await prefixer(css);
  } catch (err) {
    console.error(err);
  }

  // Write file
  writeFile(`${output}/${outputFileName}.css`, `${banner}\n${css}`);

  // if (dev) {
  //   if (cb) cb();
  //   return;
  // }

  // Minified
  const minifiedContent = await cleanCss(css);

  // Write file
  writeFile(`${output}/${outputFileName}.min.css`, `${minifiedContent}`);

  if (cb) cb();
}

// 合并项目中的f7配置文件
async function getConfig() {
  // Overwrite with local config
  try {
    const appCfg = require(`${_dir}/src/config/f7.js`).default;
    cfg = { ...Cfg, ...appCfg };
    if (appCfg.colors) cfg.colors = { ...Cfg.colors, ...appCfg.colors };
    // console.log({ appCfg, cfg }, 'getConfig');
  } catch (e) {
    console.error(`getConfig exp:${e.message}`);
  }
}

function getOutput() {
  output = path.resolve(__dirname, `${_dir}/dist/`);
}

function getBanner() {
  let R = '';
  const date = {
    day: new Date().getDate(),
    month:
      'January February March April May June July August September October November December'.split(
        ' '
      )[new Date().getMonth()],
    year: new Date().getFullYear(),
  };

  // 嵌套目标字符串
  R = `${`
/**
 * F7 ${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 *
 * Copyright 2014-${date.year} ${pkg.author}
 *
 * Released under the ${pkg.license} License
 *
 * Released on: ${date.month} ${date.day}, ${date.year}
 */
`.trim()}\n`;

  return R;
}

/**
 * 根据应用配置，替换f7.less中的变量，生成转换为css的应用f7.less 文件
 * @param {object} components
 * @param {function} cb
 */
async function createBaseLess() {
  let R;
  try {
    const colors = `{\n${Object.keys(cfg.colors)
      .map((colorName) => `  ${colorName}: ${cfg.colors[colorName]};`)
      .join('\n')}\n}`;
    const includeIosTheme = cfg.themes.indexOf('ios') >= 0;
    const includeMdTheme = cfg.themes.indexOf('md') >= 0;
    const includePcTheme = cfg.themes.indexOf('pc') >= 0;
    const includeDarkTheme = cfg.darkTheme;
    const includeLightTheme = cfg.lightTheme;
    const { rtl } = cfg;

    // Core LESS
    let tx = await fs.readFile(path.resolve(__dirname, './f7.less'), 'utf8');
    // lessContent = `${banner}\n${lessContent}`;
    tx = tx
      .replace('$includeIosTheme', includeIosTheme)
      .replace('$includeMdTheme', includeMdTheme)
      .replace('$includePcTheme', includePcTheme)
      .replace('$includeDarkTheme', includeDarkTheme)
      .replace('$includeLightTheme', includeLightTheme)
      .replace('$colors', colors)
      .replace('$themeColor', cfg.themeColor)
      .replace('$rtl', rtl);

    writeFile(`${output}/f7.less`, tx);
    R = tx;
  } catch (e) {
    console.error(`createBaseLess exp:${e.message}`);
  }
  return R;
}

async function createExtraLess(components) {
  const colors = `{\n${Object.keys(cfg.colors)
    .map((colorName) => `  ${colorName}: ${cfg.colors[colorName]};`)
    .join('\n')}\n}`;
  const includeIosTheme = cfg.themes.indexOf('ios') >= 0;
  const includeMdTheme = cfg.themes.indexOf('md') >= 0;
  const includePcTheme = cfg.themes.indexOf('pc') >= 0;
  const includeDarkTheme = cfg.darkTheme;
  const includeLightTheme = cfg.lightTheme;
  const { rtl } = cfg;

  // Extra LESS
  let lessContent = await fs.readFile(path.resolve(__dirname, './f7.extra.less'), 'utf8');
  // lessContent = `${banner}\n${lessContent}`;
  lessContent = lessContent
    .replace('$includeIosTheme', includeIosTheme)
    .replace('$includeMdTheme', includeMdTheme)
    .replace('$includePcTheme', includePcTheme)
    .replace('$includeDarkTheme', includeDarkTheme)
    .replace('$includeLightTheme', includeLightTheme)
    .replace('$colors', colors)
    .replace('$themeColor', cfg.themeColor)
    .replace('$rtl', rtl);

  // Bundle LESS，加入项目选择组件 less
  const lessBundleContent = lessContent.replace(
    '//IMPORT_COMPONENTS',
    components.map((component) => `@import './lib/${component}/${component}.less';`).join('\n')
  );

  writeFile(`${output}/f7.${_prj}.less`, lessBundleContent);

  return lessBundleContent;
}

/**
 * 应用引用@wiajs/ui组件（f7扩展的独立组件），需f7对应less 变量
 * 如：
    @import '../../config/f7.vars.less';
    // f7 swipeout 样式，包含 :root，放入全局
    @import '@wiajs/ui/dist/swipeout/index.less';
    #wiapage-id {}
 * @param {*} cb
 * @returns {promise}
 */
async function createVarsLess(cb) {
  try {
    const colors = `{\n${Object.keys(cfg.colors)
      .map((colorName) => `  ${colorName}: ${cfg.colors[colorName]};`)
      .join('\n')}\n}`;
    const includeIosTheme = cfg.themes.indexOf('ios') >= 0;
    const includeMdTheme = cfg.themes.indexOf('md') >= 0;
    const includePcTheme = cfg.themes.indexOf('pc') >= 0;
    const includeDarkTheme = cfg.darkTheme;
    const includeLightTheme = cfg.lightTheme;
    const { rtl } = cfg;

    // var LESS
    let lessContent = await fs.readFile(path.resolve(__dirname, './f7.vars.less'), 'utf8');
    // lessContent = `${banner}\n${lessContent}`;
    lessContent = lessContent
      .replace('$includeIosTheme', includeIosTheme)
      .replace('$includeMdTheme', includeMdTheme)
      .replace('$includePcTheme', includePcTheme)
      .replace('$includeDarkTheme', includeDarkTheme)
      .replace('$includeLightTheme', includeLightTheme)
      .replace('$colors', colors)
      .replace('$themeColor', cfg.themeColor)
      .replace('$rtl', rtl);

    const dir = path.resolve(_dir, './src/config');
    writeFile(`${dir}/f7.vars.less`, lessContent);

    if (cb) cb();
  } catch (e) {
    console.error(`createVarsLess exp:${e.message}`);
  }
}

function capitalized(name) {
  return name
    .split('-')
    .map((word) =>
      // eslint-disable-next-line
      word
        .split('')
        .map((char, index) => {
          if (index === 0) return char.toUpperCase();
          return char;
        })
        .join('')
    )
    .join('');
}

/**
 * f7.js 中配置的组件写入 app.js
 * @param {*[]} components
 * @returns
 */
async function addAppModule(components) {
  let tx = fs.readFileSync(`${_dir}/src/app.js`, 'utf8');
  let ms = components
    .map((m) => {
      return `import ${m.cap} from '@wiajs/f7/${m.name}'`;
    })
    .join('\n');

  // Bundle LESS，加入项目选择组件 less
  tx = tx.replace(
    /\/\/\s*IMPORT_COMPONENTS_BEGIN[\s\S]*\/\/\s*IMPORT_COMPONENTS_END/g,
    `// IMPORT_COMPONENTS_BEGIN\n${ms}\n// IMPORT_COMPONENTS_END`
  );

  ms = components.map((m) => `  ${m.cap},`).join('\n');
  tx = tx.replace(
    /\/\/\s*INSTALL_COMPONENTS_BEGIN[\s\S]*\/\/\s*INSTALL_COMPONENTS_END/g,
    `// INSTALL_COMPONENTS_BEGIN\n${ms}\n// INSTALL_COMPONENTS_END`
  );
  await writeFile(`${_dir}/src/app.js`, tx);

  return tx;
}

// module.exports = buildF7;
export default buildF7;
