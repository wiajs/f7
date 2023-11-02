import {Utils} from '@wiajs/core';
import Modal from '../modal/modal-class';

const { extend } = Utils;

class LoginScreen extends Modal {
  constructor(app, params) {
    const extendedParams = extend(
      {
      on: {},
      },
      params,
    );

    // Extends with open/close Modal methods;
    super(app, extendedParams);

    const loginScreen = this;

    loginScreen.params = extendedParams;

    // Find Element
    let $el;
    if (!loginScreen.params.el) {
      $el = $(loginScreen.params.content)
        .filter((node) => node.nodeType === 1)
        .eq(0);
    } else {
      $el = $(loginScreen.params.el).eq(0);
    }

    if ($el && $el.length > 0 && $el[0].f7Modal) {
      return $el[0].f7Modal;
    }

    if ($el.length === 0) {
      return loginScreen.destroy();
    }

    extend(loginScreen, {
      app,
      $el,
      el: $el[0],
      type: 'loginScreen',
    });

    $el[0].f7Modal = loginScreen;

    return loginScreen;
  }
}
export default LoginScreen;
