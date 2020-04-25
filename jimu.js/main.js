
define([
    './ConfigManager',
    './LayoutManager',
    './DataManager',
    './WidgetManager',
    'dojo/_base/html',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/mouse',
    'dojo/topic',
    'dojo/cookie',
    'dojo/Deferred',
    'dojo/promise/all',
    'dojo/io-query',
    './utils',
    'require',
    'dojo/i18n',
    'dojo/i18n!./nls/main',
    'dojo/ready'
  ],
  function(ConfigManager, LayoutManager, DataManager, WidgetManager,
     html, lang, array, on, mouse,
    topic, cookie, Deferred, all, ioquery
    , jimuUtils, require, i18n, mainBundle,  dojoReady) {
    /* global jimuConfig:true */
    var mo = {}, appConfig;

    window.topic = topic;

    //patch for JS API 3.10
    var hasMethod = typeof cookie.getAll === 'function';
    if (!hasMethod) {
      cookie.getAll = function(e) {
        var result = [];
        var v = cookie(e);
        if (v) {
          result.push(v);
        }
        return result;
      };
    }

    //jimu nls
    window.jimuNls = mainBundle;

    var ancestorWindow = jimuUtils.getAncestorWindow();
    var parentHttps = false, patt = /^http(s?):\/\//gi;

    try {
      parentHttps = ancestorWindow.location.href.indexOf("https://") === 0;
    } catch (err) {

    }
    // disable middle mouse button scroll
    on(window, 'mousedown', function(evt) {
      if (!mouse.isMiddle(evt)) {
        return;
      }

      evt.preventDefault();
      evt.stopPropagation();
      evt.returnValue = false;
      return false;
    });

    String.prototype.startWith = function(str) {
      if (this.substr(0, str.length) === str) {
        return true;
      } else {
        return false;
      }
    };

    String.prototype.endWith = function(str) {
      if (this.substr(this.length - str.length, str.length) === str) {
        return true;
      } else {
        return false;
      }
    };

    // Polyfill isNaN for IE11
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function (value) {
      return value !== value;
    };

    /*jshint unused: false*/
    if (typeof jimuConfig === 'undefined') {
      jimuConfig = {};
    }
    jimuConfig = lang.mixin({
      loadingId: 'main-loading',
      loadingImageId: 'app-loading',
      loadingGifId: 'loading-gif',
      layoutId: 'jimu-layout-manager',
      mapId: 'map',
      mainPageId: 'main-page',
      timeout: 5000,
      breakPoints: [600, 1280]
    }, jimuConfig);


    window.wabVersion = '2.10';
    window.productVersion = 'CesiumViewer2018';

    function initApp() {
      var urlParams, configManager, layoutManager;
      console.log('jimu.js init...');
      urlParams = getUrlParams();

      if(urlParams.mobileBreakPoint){
        try{
          var bp = parseInt(urlParams.mobileBreakPoint, 10);
          jimuConfig.breakPoints[0] = bp;
        }catch(err){
          console.error('mobileBreakPoint URL parameter must be a number.', err);
        }
      }

      if(urlParams.mode){
        html.setStyle(jimuConfig.loadingId, 'display', 'none');
        html.setStyle(jimuConfig.mainPageId, 'display', 'block');
      }
      DataManager.getInstance(WidgetManager.getInstance());

      layoutManager = LayoutManager.getInstance({
        mapId: jimuConfig.mapId,
        urlParams: urlParams
      }, jimuConfig.layoutId);
      configManager = ConfigManager.getInstance(urlParams);

      layoutManager.startup();
      configManager.loadConfig();
      //load this module here to make load modules and load app parallelly
      require(['dynamic-modules/preload']);

      dojoReady(function(){
        setTimeout(function(){
          html.removeClass(document.body, 'dj_a11y');
        }, 50);
      });
    }

    function getUrlParams() {
      var s = window.location.search,
        p;
      // params that don't need to `sanitizeHTML`
      var exceptUrlParams = {
        query: true
      };
      if (s === '') {
        return {};
      }

      p = ioquery.queryToObject(s.substr(1));

      for(var k in p){
        if(!exceptUrlParams[k]){
          p[k] = jimuUtils.sanitizeHTML(p[k]);
        }
      }
      return p;
    }

    topic.subscribe("appConfigLoaded", onAppConfigChanged);
    topic.subscribe("appConfigChanged", onAppConfigChanged);

    function onAppConfigChanged(_appConfig, reason){
      appConfig = _appConfig;

      if(reason === 'loadingPageChange'){
        return;
      }

      html.setStyle(jimuConfig.loadingId, 'display', 'none');
      html.setStyle(jimuConfig.mainPageId, 'display', 'block');
    }
    //ie css
    var ieVersion = jimuUtils.has('ie');
    if(ieVersion > 10){
      html.addClass(document.body, 'ie-gte-10');
    }
    mo.initApp = initApp;
    return mo;
  });