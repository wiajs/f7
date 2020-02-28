import ConstructorMethods from '@wiajs/core/constructors';
import VirtualList from './virtual-list-class';

export default {
  name: 'virtualList',
  static: {
    VirtualList,
  },
  create() {
    const app = this;
    app.virtualList = ConstructorMethods({
      defaultSelector: '.virtual-list',
      constructor: VirtualList,
      app,
      domProp: 'f7VirtualList',
    });
  },
};
