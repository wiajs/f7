import {Modals} from '@wiajs/core';
import Actions from './actions-class';

export default {
  name: 'actions',
  params: {
    actions: {
      convertToPopover: true,
      forceToPopover: false,
      backdrop: true,
      backdropEl: undefined,
      backdropUnique: false,
      cssClass: null,
      closeByBackdropClick: true,
      closeOnEscape: false,
      render: null,
      renderPopover: null,
      containerEl: null,
    },
  },
  static: {
    Actions,
  },
  create() {
    const app = this;
    app.actions = Modals({
      app,
      constructor: Actions,
      defaultSelector: '.actions-modal.modal-in',
    });
  },
  clicks: {
    '.actions-open': function openActions($clickedEl, data = {}) {
      const app = this;
      app.actions.open(data.actions, data.animate, $clickedEl);
    },
    '.actions-close': function closeActions($clickedEl, data = {}) {
      const app = this;
      app.actions.close(data.actions, data.animate, $clickedEl);
    },
  },
};
