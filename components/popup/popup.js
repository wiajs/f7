import {Modals} from '@wiajs/core';
import Popup from './popup-class';

export default {
  name: 'popup',
  params: {
    popup: {
      backdrop: true,
      backdropEl: undefined,
      closeByBackdropClick: true,
      closeOnEscape: false,
      swipeToClose: false,
      swipeHandler: null,
      push: false,
      containerEl: null,
    },
  },
  static: {
    Popup,
  },
  create() {
    const app = this;
    app.popup = Modals({
      app,
      constructor: Popup,
      defaultSelector: '.popup.modal-in',
      parentSelector: '.popup',
    });
  },
  clicks: {
    '.popup-open': function openPopup($clickedEl, data = {}) {
      const app = this;
      app.popup.open(data.popup, data.animate, $clickedEl);
    },
    '.popup-close': function closePopup($clickedEl, data = {}) {
      const app = this;
      app.popup.close(data.popup, data.animate, $clickedEl);
    },
  },
};
