import {Constructors} from '@wiajs/core';
import VirtualList from './virtual-list-class';

export default {
  name: 'virtualList',
  static: {
    VirtualList,
  },
  create() {
    const app = this;
    app.virtualList = Constructors({
      defaultSelector: '.virtual-list',
      constructor: VirtualList,
      app,
      domProp: 'f7VirtualList',
    });
  },
};
