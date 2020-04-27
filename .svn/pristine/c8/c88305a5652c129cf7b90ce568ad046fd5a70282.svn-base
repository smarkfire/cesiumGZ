
var
  apiUrl = null,

  debug = false,

  //deprecated, use appInfo.appPath instead
  path = null,

  isXT = false,

  allCookies,

  verboseLog = true,

  deployVersion = '2.10';


(function(global){
  //init API URL
  var queryObject = getQueryObject();
  var apiVersion = '3.26';

  apiUrl = './corelib/';
  //////////////////////////////////////////////////////////////
  allCookies = getAllCookies();

  if (queryObject.apiurl) {
    if(!checkApiUrl(queryObject.apiurl)){
      console.error('?apiurl must point to an ULR that is in the app or in esri.com/arcgis.com domain.');
      return;
    }
    apiUrl = queryObject.apiurl;
  }
  window.appInfo = {isRunInPortal: !isXT};


  path = getPath();

  function getAllCookies(){
    var strAllCookie = document.cookie;
    var cookies = {};
    if (strAllCookie) {
      var strCookies = strAllCookie.split(';');
      for(var i = 0; i < strCookies.length; i++){
        var splits = strCookies[i].split('=');
        if(splits && splits.length > 1){
          cookies[splits[0].replace(/^\s+|\s+$/gm, '')] = splits[1];
        }
      }
    }
    return cookies;
  }

  function checkApiUrl(url){
    if(/^\/\//.test(url) || /^https?:\/\//.test(url)){
      return /(?:[\w\-\_]+\.)+(?:esri|arcgis)\.com/.test(url); //api url must be in esri.com or arcgis.com
    }else{
      return true;
    }
  }

  function getPortalUrlFromLocation(){
    var portalUrl = getPortalServerFromLocation() +  getDeployContextFromLocation();
    return portalUrl;
  }

  function getPortalServerFromLocation(){
    var server = window.location.protocol + '//' + window.location.host;
    return server;
  }

  function getDeployContextFromLocation (){
    var keyIndex = window.location.href.indexOf("/home");
    if(keyIndex < 0){
      keyIndex = window.location.href.indexOf("/apps");
    }
    var context = window.location.href.substring(window.location.href.indexOf(
      window.location.host) + window.location.host.length + 1, keyIndex);
    if (context !== "/") {
      context = "/" + context + "/";
    }
    return context;
  }

  function getPath() {
    var fullPath, path;

    fullPath = window.location.pathname;
    if (fullPath === '/' || fullPath.substr(fullPath.length - 1) === '/') {
      path = fullPath;
    }else{
      var sections = fullPath.split('/');
      var lastSection = sections.pop();
      if (/\.html$/.test(lastSection) || /\.aspx$/.test(lastSection) ||
         /\.jsp$/.test(lastSection) || /\.php$/.test(lastSection)) {
        //index.html may be renamed to index.jsp, etc.
        path = sections.join('/') + '/';
      } else {
        return false;
      }
    }
    return path;
  }

  function getQueryObject(){
    var query = window.location.search;
    if (query.indexOf('?') > -1) {
      query = query.substr(1);
    }
    var pairs = query.split('&');
    var queryObject = {};
    for(var i = 0; i < pairs.length; i++){
      var splits = decodeURIComponent(pairs[i]).split('=');
      queryObject[splits[0]] = splits[1];
    }
    return queryObject;
  }
  function _loadPolyfills(prePath, cb) {
    prePath = prePath || "";
    var ap = Array.prototype,
      fp = Function.prototype,
      sp = String.prototype,
      loaded = 0,
      completeCb = function() {
        loaded++;
        if (loaded === tests.length) {
          cb();
        }
      },
      tests = [{
        test: window.console,
        failure: prePath + "libs/polyfills/console.js",
        callback: completeCb
      }, {
        test: ap.indexOf && ap.lastIndexOf && ap.forEach && ap.every && ap.some &&
          ap.filter && ap.map && ap.reduce && ap.reduceRight,
        failure: prePath + "libs/polyfills/array.generics.js",
        callback: completeCb
      }, {
        test: fp.bind,
        failure: prePath + "libs/polyfills/bind.js",
        callback: completeCb
      }, {
        test: Date.now,
        failure: prePath + "libs/polyfills/now.js",
        callback: completeCb
      }, {
        test: sp.trim,
        failure: prePath + "libs/polyfills/trim.js",
        callback: completeCb
      }, {
        test: false,
        failure: prePath + "libs/polyfills/FileSaver.js",
        callback: completeCb
      }, {
        test: typeof Blob !== 'undefined',
        failure: prePath + "libs/polyfills/FileSaver.ie9.js",
        callback: completeCb
      }, {
        test: window.Blob,
        failure: prePath + "libs/polyfills/Blob.js",
        callback: completeCb
      }, {
        test: window.ArrayBuffer,
        failure: prePath + "libs/polyfills/typedarray.js",
        callback: completeCb
      }];

    for(var i = 0; i < tests.length; i++){
      testLoad(tests[i]);
    }
  }

  function localeIsSame(locale1, locale2){
    return locale1.split('-')[0] === locale2.split('-')[0];
  }

  function _setRTL(locale){
    var rtlLocales = ["ar", "he"];
    var dirNode = document.getElementsByTagName("html")[0];
    var isRTLLocale = false;
    for (var i = 0; i < rtlLocales.length; i++) {
      if (localeIsSame(rtlLocales[i], locale)) {
        isRTLLocale = true;
      }
    }

    dirNode.setAttribute("lang", locale);
    if (isRTLLocale) {
      dirNode.setAttribute("dir", "rtl");
      dirNode.className += " esriRtl jimu-rtl";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }else {
      dirNode.setAttribute("dir", "ltr");
      dirNode.className += " esriLtr jimu-ltr";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }

    window.isRTL = isRTLLocale;
  }

  global._loadPolyfills = _loadPolyfills;
  global.queryObject = queryObject;
  global._setRTL = _setRTL;

  global.avoidRequireCache = function(require){
    var dojoInject = require.injectUrl;
    require.injectUrl = function(url, callback, owner){
      url = appendDeployVersion(url);
      dojoInject(url, callback, owner);
    };
  };

  global.avoidRequestCache = function (aspect, requestUtil){
    aspect.after(requestUtil, 'parseArgs', function(args){
      args.url = appendDeployVersion(args.url);
      return args;
    });
  };

  function appendDeployVersion(url){
    if(/^http(s)?:\/\//.test(url) || /^\/proxy\.js/.test(url) || /^\/\//.test(url)){
      return url;
    }
//  if(url.indexOf('?') > -1){
//    url = url + '&wab_dv=' + deployVersion;
//  }else{
//    url = url + '?wab_dv=' + deployVersion;
//  }
    return url;
  }
})(window);