import {Utils, Constructors} from '@wiajs/core';
import PullToRefresh from './pull-to-refresh-class';

const { extend } = Utils;

export default {
  name: 'pullToRefresh',
  create() {
    const app = this;
    app.ptr = extend(
      Constructors({
        defaultSelector: '.ptr-content',
        constructor: PullToRefresh,
        app,
        domProp: 'f7PullToRefresh',
      }),
      {
        done(el) {
          const ptr = app.ptr.get(el);
          if (ptr) return ptr.done();
          return undefined;
        },
        refresh(el) {
          const ptr = app.ptr.get(el);
          if (ptr) return ptr.refresh();
          return undefined;
        },
      }
    );
  },
  static: {
    PullToRefresh,
  },
  on: {
    tabMounted(tabEl) {
      const app = this;
      const $tabEl = $(tabEl);
      const $ptrEls = $tabEl.find('.ptr-content');
      if ($tabEl.is('.ptr-content')) $ptrEls.add($tabEl);
      $ptrEls.forEach((el) => {
        app.ptr.create(el);
      });
    },
    tabBeforeRemove(tabEl) {
      const $tabEl = $(tabEl);
      const app = this;
      const $ptrEls = $tabEl.find('.ptr-content');
      if ($tabEl.is('.ptr-content')) $ptrEls.add($tabEl);
      $ptrEls.forEach((el) => {
        app.ptr.destroy(el);
      });
    },
    pageInit(page) {
      const app = this;
      page.$el.find('.ptr-content').forEach((el) => {
        app.ptr.create(el);
      });
    },
    pageBeforeRemove(page) {
      const app = this;
      page.$el.find('.ptr-content').forEach((el) => {
        app.ptr.destroy(el);
      });
    },
  },
};
