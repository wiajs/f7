import {Utils} from '@wiajs/core';

const Breadcrumbs = {};

export default {
  name: 'breadrumbs',
  create() {
    const app = this;
    Utils.bindMethods(app, {
      breadrumbs: Breadcrumbs,
    });
  },
};
