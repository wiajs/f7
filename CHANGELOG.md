# Change Log

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
