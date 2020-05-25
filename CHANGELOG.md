# Change Log

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
