/**
 * F7 Build Configuration
 * Don't modify this file!
 * If you want to build custom version of F7, just put f7.config.js with the required configuration in your prj folder. Or build it using command line:
 */

const config = {
  rtl: false, // 从右到左
  // 根据项目需要，选择需要的组件
  components: [
    // Appbar
    'appbar',

    // Modals
    'dialog',
    'popup',
    'login-screen',
    'popover',
    'actions',
    'sheet',
    'toast',

    // Loaders
    'preloader',
    'progressbar',

    // List Components
    'sortable',
    'swipeout',
    'accordion',
    'contacts-list',
    'virtual-list',
    'list-index',

    // Timeline
    'timeline',

    // Tabs
    'tabs',

    // Panel
    'panel',

    // Card
    'card',

    // Chip
    'chip',

    // Form Components
    'form',
    'input',
    'checkbox',
    'radio',
    'toggle',
    'range',
    'stepper',
    'smart-select',

    // Grid
    'grid',

    // Pickers
    'calendar',
    'picker',

    // Page Components
    'infinite-scroll',
    'pull-to-refresh',
    'lazy',

    // Data table
    'data-table',

    // FAB
    'fab',

    // Searchbar
    'searchbar',

    // Messages
    'messages',
    'messagebar',

    // Swiper
    'swiper',

    // Photo Browser
    'photo-browser',

    // Notifications
    'notification',

    // Autocomplete
    'autocomplete',

    // Tooltip
    'tooltip',

    // Gauge
    'gauge',

    // Skeleton
    'skeleton',

    // Menu
    'menu',

    // Color Picker
    'color-picker',

    // Tree View
    'treeview',

    // WYSIWYG Editor
    'text-editor',

    // Elevation
    'elevation',

    // Typography
    'typography',

    // VI Video Ads
    'vi',
  ],
  darkTheme: true, // 夜晚主题，屏幕变暗
  lightTheme: true,
  themes: [
    'ios', // ios苹果手机样式
    'md', // 安卓md样式
    'pc', // 桌面样式
  ],
  themeColor: '#007aff', // 默认蓝色主题，f7内置15个颜色主题
  // 项目中用到哪个颜色主题，就选择哪个
  colors: {
    primary: '#007aff',
    red: '#ff3b30',
    green: '#4cd964',
    blue: '#2196f3',
    pink: '#ff2d55',
    yellow: '#ffcc00',
    orange: '#ff9500',
    purple: '#9c27b0',
    deeppurple: '#673ab7',
    lightblue: '#5ac8fa',
    teal: '#009688',
    lime: '#cddc39',
    deeporange: '#ff6b22',
    white: '#ffffff',
    black: '#000000',
    gray: '#8e8e93',
  },
};

module.exports = config;
