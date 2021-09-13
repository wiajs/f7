# Change Log

## 2021-09-13

- f7\components\tabs\tabs.js
  $.clas -> $.class

## 2021-08-06

- 修正 data-table.less bug
  .if-md-theme 改为 .if-aurora-theme

## 2021-08-01

- \+ pie-chart
- \+ area-chart
- \+ searchbar\remove-diacritics

## 2021-07-31

- 组件更新到 F7 的 6.1.1 版本。
- 增加 area-chart pie-chart 组件
- 增加 jsx 解析器，支持 react 语法
  通过 /\*_ @jsx $jsx _/ 让 @babel/plugin-transform-react-jsx 使用指定的函数解析 js 代码中的 html 代码！
  无需使用 插值字符串，带语法支持，js 中写 html 代码，确实很舒服。
- wia 项目需配置为 jsx 项目，否则无法编译 jsx 语法。
  - eslintrc.js 需配置为支持 jsx 语法高亮
  - eslintrc.js 使用 plugin:prettier/recommended。
    需安装 prettier，否则 eslint 无法加载 prettier 模块而停止工作。
  - babel.config.js 需配置为 @babel/preset-react，支持 jsx 语法转换。
    presets: ['@babel/preset-react', ['@babel/preset-env', { modules, loose: true }]],
  - prettier.config.js
    增加 endOfLine: 'auto', 否则 CRLF 提示错误！
- 编译 f7 原项目报错。
  - build\core\components 不存在，手工创建。
  - build\core\modules 不存在，手工创建。
  - getOutput 路径问题
    return outputPath.replace(/\\/gim, '/');

### f7 组件 修改为 wiajs f7 组件

```js
import $ from '../../shared/dom7';
import { extend, deleteProps } from '../../shared/utils';
import Framework7Class from '../../shared/class';
/\*_ @jsx $jsx _/;
import $jsx from '../../shared/$jsx';

class AreaChart extends Framework7Class {}

// 改为：

/\*_ @jsx jsx _/;
import { Utils, Event, jsx } from '@wiajs/core';

class AreaChart extends Event {}
```

## 2021-07-12

部分组件更新到 F7 的 6.00.10 版本。

- accordion
- actions
- app
- block
- button
- card
- checkBox
- chip
- data-table
- dialog
- grid
- icon
- input
- list
- navbar
- preloader
- radio
- tabs
- toggle
- toolbar
- view

## 2021-06-10

- grid\grid.less
  更新到 v6.0.21

## 2020-09-01

    dialog\dialog.js 文件编码恢复为UTF8
    calendar\calendar.js 修正bug

## 2020-07-10

dialog\dialog.js
弹出中文对话框
tabs\tabs.js
激活点击的 .tab-link

## 2020-06-03

f7.js

- \+ buildVars
- \+ createVarsLess
  根据配置创建其他组件需要的 less 变量，用于脱离 f7 组件架构，
  在页面中可单独引用组件或 f7 样式。
  f7 组件架构，在 app 创建时，所有样式集中打包。
  wia 架构是每个页面独立打包、独立运行，因此需将 less 引用变量分拆出来，
  在页面 less 中单独引用，比如：
  `@import '../config/f7.vars.less';`

\+ f7.vars.less

f7 组件 less 所需要的变量、函数

## 2020-05-24

### tabs

tabs.js

- \* show
  原 f7 tabs 仅支持一级 tabs，多级 tabs 非常麻烦，修改后可支持多级 tabs
  支持多级 tab，比如两个 div，一个 div 中 两个 tab-link 的 data-tab 为 t1 t2
  另一个 div 中，两个 tab-link 的 data-tab 为 t1 t2
  tabs 中 4 个 tab 的 name 分别为 t1-t1 t1-t2 t2-t1 t2-t2
  四个 tab 被 四个 tab-link 控制
  事件：

  ```js
  $.app.on('tabHide', el);
  $.app.on('tabShow', el);
  ```

  代码修改：

  ```js
  // 原代码
  const $newTabEl = $(tabEl);

  // 修改为
  tabLinkEl.addClass('tab-link-active', true);
  let tabs = '';
  const links = tabLinkEl.parentNode('.tab-links').classes('tab-link-active');
  if (links)
    tabs = links
      .toArray()
      .reduce(
        (prev, v) => (prev ? `${prev}-${$(v).data('tab')}` : \$(v).data('tab')),
        ''
      );

  const \$newTabEl = tabLinkEl.parentNode('.page').name(tabs);
  ```
