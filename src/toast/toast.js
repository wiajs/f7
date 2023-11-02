import {Utils, Modals} from '@wiajs/core';
import Toast from './toast-class';

const { extend } = Utils;

export default {
  name: 'toast',
  static: {
    Toast,
  },
  create() {
    const app = this;
    app.toast = extend(
      {},
      Modals({
        app,
        constructor: Toast,
        defaultSelector: '.toast.modal-in',
      }),
      {
        // Shortcuts
        show(params) {
          extend(params, {
            destroyOnClose: true,
          });
          return new Toast(app, params).open();
        },
      },
    );
  },
  params: {
    toast: {
      icon: null,
      text: null,
      position: 'bottom',
      horizontalPosition: 'left',
      closeButton: false,
      closeButtonColor: null,
      closeButtonText: 'Ok',
      closeTimeout: null,
      cssClass: null,
      render: null,
      containerEl: null,
    },
  },
};
