import {Constructors} from '@wiajs/core';
import Picker from './picker-class';

export default {
  name: 'picker',
  static: {
    Picker,
  },
  create() {
    const app = this;
    app.picker = Constructors({
      defaultSelector: '.picker',
      constructor: Picker,
      app,
      domProp: 'f7Picker',
    });
    app.picker.close = function close(el = '.picker') {
      const $el = $(el);
      if ($el.length === 0) return;
      const picker = $el[0].f7Picker;
      if (!picker || (picker && !picker.opened)) return;
      picker.close();
    };
  },
  params: {
    picker: {
      // Picker settings
      rotateEffect: false,
      freeMode: false,
      cols: [],
      // Common opener settings
      containerEl: null,
      openIn: 'auto', // or 'popover' or 'sheet'
      sheetPush: false,
      sheetSwipeToClose: undefined,
      backdrop: undefined, // uses Popover or Sheet defaults
      formatValue: null,
      inputEl: null,
      inputReadOnly: true,
      closeByOutsideClick: true,
      scrollToInput: true,
      scrollToEl: undefined,
      toolbar: true,
      toolbarCloseText: 'Done',
      cssClass: null,
      routableModals: false,
      view: null,
      url: 'select/',
      // Render functions
      renderToolbar: null,
      render: null,
    },
  },
};
