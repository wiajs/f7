/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: "off" */
/* eslint global-require: "off" */
/* eslint no-param-reassign: ["error", { "props": false }] */

const path = require('path');
const less = require('./utils/less');
const autoprefixer = require('./utils/autoprefixer');
const cleanCSS = require('./utils/clean-css');
const fs = require('./utils/fs-extra');
let cfg = require('./config.js');
const pkg = require('./package.json');

const env = process.env.NODE_ENV || 'prod'; //'dev'; // 默认开发环境
const dev = !env.startsWith('prod'); // production
const banner = getBanner();

let _prj = ''; // 项目名称
let _dir = ''; // 项目目录
let output = '';

// 合并项目中的f7配置文件
function getConfig() {
  // Overwrite with local config
  try {
    // eslint-disable-next-line
    const prjConfig = require(`${_dir}/src/f7.config.js`);
    cfg = Object.assign({}, cfg, prjConfig);
    console.log(cfg);
  } catch (err) {
    // No local config
  }
}

function getOutput() {
  output = path.resolve(__dirname, `${_dir}/dist/`);
}

function getBanner() {
  let R = '';
  const date = {
    day: new Date().getDate(),
    month: 'January February March April May June July August September October November December'.split(
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
 * 根据配置生成 转换为css 的 less 文件
 * @param {object} components
 * @param {function} cb
 */
function createBaseLess() {
  const colors = `{\n${Object.keys(cfg.colors)
    .map(colorName => `  ${colorName}: ${cfg.colors[colorName]};`)
    .join('\n')}\n}`;
  const includeIosTheme = cfg.themes.indexOf('ios') >= 0;
  const includeMdTheme = cfg.themes.indexOf('md') >= 0;
  const includeAuroraTheme = cfg.themes.indexOf('aurora') >= 0;
  const includeDarkTheme = cfg.darkTheme;
  const includeLightTheme = cfg.lightTheme;
  const {rtl} = cfg;

  // Core LESS
  let lessContent = fs.readFileSync(path.resolve(__dirname, './f7.less'));
  lessContent = `${banner}\n${lessContent}`;
  lessContent = lessContent
    .replace('$includeIosTheme', includeIosTheme)
    .replace('$includeMdTheme', includeMdTheme)
    .replace('$includeAuroraTheme', includeAuroraTheme)
    .replace('$includeDarkTheme', includeDarkTheme)
    .replace('$includeLightTheme', includeLightTheme)
    .replace('$colors', colors)
    .replace('$themeColor', cfg.themeColor)
    .replace('$rtl', rtl);

  fs.writeFileSync(`${output}/f7.less`, lessContent);

  return lessContent;
}

/**
 * Build CSS Core，根据配置，生成基本 css
 * @param {string} themes
 * @param {bool} rtl
 * @param {function} cb
 */
async function buildBase(cb) {
  const lessContent = createBaseLess();

  let cssContent;
  try {
    cssContent = await autoprefixer(
      await less(lessContent, path.resolve(__dirname, '.'))
    );
  } catch (e) {
    console.log(e);
  }

  // lessVars.forEach((v, k) => {
  //   cssContent = cssContent
  //     .replace(new RegExp(`--${v}\\s*:`, 'gi'), `--f7-${k}:`)
  //     .replace(new RegExp(`var\\(--${v}([),])`, 'gi'), `var(--f7-${k}$1`);
  // });

  // Write file
  fs.writeFileSync(`${output}/f7${cfg.rtl ? '.rtl' : ''}.css`, `${cssContent}`);

  if (dev) {
    if (cb) cb();
    return;
  }

  // Minified
  const minifiedContent = await cleanCSS(cssContent);

  // Write file
  fs.writeFileSync(
    `${output}/f7${cfg.rtl ? '.rtl' : ''}.min.css`,
    `${banner}\n${minifiedContent}`
  );

  if (cb) cb();
}

function capitalized(name) {
  return name
    .split('-')
    .map(word =>
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

function addAppModule(components) {
  let appContent = fs.readFileSync(`${_dir}/src/app.js`);
  let ms = components
    .map(m => {
      return `import ${m.cap} from '@wiajs/f7/components/${m.name}/${m.name}';`;
    })
    .join('\n');

  // Bundle LESS，加入项目选择组件 less
  appContent = appContent.replace(
    /\/\/\s*IMPORT_COMPONENTS_BEGIN[\s\S]*\/\/\s*IMPORT_COMPONENTS_END/g,
    `// IMPORT_COMPONENTS_BEGIN\n${ms}\n// IMPORT_COMPONENTS_END`
  );

  ms = components.map(m => `  ${m.cap},`).join('\n');
  appContent = appContent.replace(
    /\/\/\s*INSTALL_COMPONENTS_BEGIN[\s\S]*\/\/\s*INSTALL_COMPONENTS_END/g,
    `// INSTALL_COMPONENTS_BEGIN\n${ms}\n// INSTALL_COMPONENTS_END`
  );
  fs.writeFileSync(`${_dir}/src/app.js`, appContent);

  return appContent;
}

/**
 * 修改 app.js，将配置模块添加其中
 * @param {*} cb
 */
async function makeApp(cb) {
  const components = [];
  // 通过项目配置获取组件样式

  cfg.components.forEach(name => {
    const dir = path.resolve(__dirname, `./components/${name}`);
    if (fs.existsSync(`${dir}/${name}.js`)) {
      const cap = capitalized(name);
      components.push({name, cap});
    }
  });
  console.log('makeApp:', {components});

  // 根据项目配置生成 转换 less 文件
  const appContent = addAppModule(components);

  if (cb) cb();
}

// Build CSS Bundle
async function buildPart(cb) {
  const components = [];
  // 通过项目配置获取组件样式
  cfg.components.forEach(name => {
    const dir = path.resolve(__dirname, `./components/${name}`);

    if (fs.existsSync(`${dir}/${name}.less`)) {
      components.push(name);
    }
  });

  console.log('buildPart:', {components});
  // 根据项目配置生成 转换 less 文件
  const lessContent = createPartLess(components);
  const outputFileName = `f7.${_prj}${cfg.rtl ? '.rtl' : ''}`;

  let cssContent;
  try {
    cssContent = await autoprefixer(
      await less(lessContent, path.resolve(__dirname, '.'))
    );
  } catch (err) {
    console.log(err);
  }

  // Write file
  fs.writeFileSync(
    `${output}/${outputFileName}.css`,
    `${banner}\n${cssContent}`
  );

  if (dev) {
    if (cb) cb();
    return;
  }

  // Minified
  const minifiedContent = await cleanCSS(cssContent);

  // Write file
  fs.writeFileSync(`${output}/${outputFileName}.min.css`, `${minifiedContent}`);

  if (cb) cb();
}

/**
 * 根据f7.config.js 配置，修改项目 app.js，生成项目css文件
 * @param {*} dir
 * @param {*} name
 * @param {*} cb
 */
function buildF7(dir, name, cb) {
  _prj = name;
  _dir = dir;

  getConfig();
  getOutput();

  let cbs = 0;
  function onCb() {
    cbs += 1;
    // 最后一次回调
    if (cbs === 3 && cb) cb();
  }

  makeApp(onCb);
  buildBase(onCb);
  buildPart(onCb);
}

module.exports = buildF7;
