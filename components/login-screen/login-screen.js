import {Modals} from '@wiajs/core';
import LoginScreen from './login-screen-class';

export default {
  name: 'loginScreen',
  static: {
    LoginScreen,
  },
  create() {
    const app = this;
    app.loginScreen = Modals({
      app,
      constructor: LoginScreen,
      defaultSelector: '.login-screen.modal-in',
    });
  },
  clicks: {
    '.login-screen-open': function openLoginScreen($clickedEl, data = {}) {
      const app = this;
      app.loginScreen.open(data.loginScreen, data.animate);
    },
    '.login-screen-close': function closeLoginScreen($clickedEl, data = {}) {
      const app = this;
      app.loginScreen.close(data.loginScreen, data.animate);
    },
  },
};
