import {Utils, Modals} from '@wiajs/core';
import Toast from './toast-class';

export default {
  name: 'toast',
  static: {
    Toast,
  },
  create() {
    const app = this;
    app.toast = Utils.extend(
      {},
      Modals({
        app,
        constructor: Toast,
        defaultSelector: '.toast.modal-in',
      }),
      {
        // Shortcuts
        show(params) {
          Utils.extend(params, {
            destroyOnClose: true,
          });
          return new Toast(app, params).open();
        },
      }
    );
  },
  params: {
    toast: {
      icon: null,
      text: null,
      position: 'bottom',
      closeButton: false,
      closeButtonColor: null,
      closeButtonText: 'Ok',
      closeTimeout: null,
      cssClass: null,
      render: null,
    },
  },
};
