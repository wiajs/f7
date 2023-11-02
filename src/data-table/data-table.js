import {Constructors} from '@wiajs/core';
import DataTable from './data-table-class';

export default {
  name: 'dataTable',
  static: {
    DataTable,
  },
  create() {
    const app = this;
    app.dataTable = Constructors({
      defaultSelector: '.data-table',
      constructor: DataTable,
      app,
      domProp: 'f7DataTable',
    });
  },
  on: {
    tabBeforeRemove(tabEl) {
      const app = this;
      $(tabEl)
        .find('.data-table-init')
        .forEach((tableEl) => {
        app.dataTable.destroy(tableEl);
      });
    },
    tabMounted(tabEl) {
      const app = this;
      $(tabEl)
        .find('.data-table-init')
        .forEach((tableEl) => {
        app.dataTable.create({ el: tableEl });
      });
    },
    pageBeforeRemove(page) {
      const app = this;
      page.$el.find('.data-table-init').forEach((tableEl) => {
        app.dataTable.destroy(tableEl);
      });
    },
    pageInit(page) {
      const app = this;
      page.$el.find('.data-table-init').forEach((tableEl) => {
        app.dataTable.create({ el: tableEl });
      });
    },
  },
  vnode: {
    'data-table-init': {
      insert(vnode) {
        const app = this;
        const tableEl = vnode.elm;
        app.dataTable.create({ el: tableEl });
      },
      destroy(vnode) {
        const app = this;
        const tableEl = vnode.elm;
        app.dataTable.destroy(tableEl);
      },
    },
  },
};
