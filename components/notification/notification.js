import {Utils, Modals} from '@wiajs/core';
import Notification from './notification-class';

export default {
  name: 'notification',
  static: {
    Notification,
  },
  create() {
    const app = this;
    app.notification = Utils.extend(
      {},
      Modals({
        app,
        constructor: Notification,
        defaultSelector: '.notification.modal-in',
      })
    );
  },
  params: {
    notification: {
      icon: null,
      title: null,
      titleRightText: null,
      subtitle: null,
      text: null,
      closeButton: false,
      closeTimeout: null,
      closeOnClick: false,
      swipeToClose: true,
      cssClass: null,
      render: null,
      containerEl: null,
    },
  },
};
