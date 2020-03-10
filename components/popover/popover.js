import {Utils, Modals} from '@wiajs/core';
import Popover from './popover-class';

export default {
  name: 'popover',
  params: {
    popover: {
      backdrop: true,
      backdropEl: undefined,
      closeByBackdropClick: true,
      closeByOutsideClick: true,
      closeOnEscape: false,
    },
  },
  static: {
    Popover,
  },
  create() {
    const app = this;
    app.popover = Utils.extend(
      Modals({
        app,
        constructor: Popover,
        defaultSelector: '.popover.modal-in',
      }),
      {
        open(popoverEl, targetEl, animate) {
          const $popoverEl = $(popoverEl);
          let popover = $popoverEl[0].f7Modal;
          if (!popover) popover = new Popover(app, { el: $popoverEl, targetEl });
          return popover.open(targetEl, animate);
        },
      }
    );
  },
  clicks: {
    '.popover-open': function openPopover($clickedEl, data = {}) {
      const app = this;
      app.popover.open(data.popover, $clickedEl, data.animate);
    },
    '.popover-close': function closePopover($clickedEl, data = {}) {
      const app = this;
      app.popover.close(data.popover, data.animate);
    },
  },
};
