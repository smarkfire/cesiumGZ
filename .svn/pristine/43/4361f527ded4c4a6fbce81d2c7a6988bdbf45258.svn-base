
var dojoConfig, jimuConfig;

var ie = (function() {
  var undef,
    v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');

  div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
  while(all[0]){
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
  }
  return v > 4 ? v : undef;
}());

(function(argument) {
  if (ie < 8){
    var mainLoading = document.getElementById('main-loading');
    var appLoading = document.getElementById('app-loading');
    var ieNotes = document.getElementById('ie-note');
    appLoading.style.display = 'none';
    ieNotes.style.display = 'block';
    mainLoading.style.backgroundColor = "#fff";
    return;
  }

  var resources = [];

  if (!window.apiUrl) {
    console.error('no apiUrl.');
  } else if (!window.path) {
    console.error('no path.');
  } else {
    if(window.location.protocol === 'https:'){
      var reg = /^http:\/\//i;
      if(reg.test(window.apiUrl)){
        window.apiUrl = window.apiUrl.replace(reg, 'https://');
      }
      if(reg.test(window.path)){
        window.path = window.path.replace(reg, 'https://');
      }
    }

    /*jshint unused:false*/
    dojoConfig = {
      parseOnLoad: false,
      async: true,
      tlmSiblingOfDojo: false,
      has: {
        'extend-esri': 1
      }
    };

    setLocale();

    if(window.isRTL){
      dojoConfig.has['dojo-bidi'] = true;
    }

    resources = resources.concat([
      window.apiUrl + 'dojo/resources/dojo.css',
      window.apiUrl + 'dijit/themes/claro/claro.css',
      window.path + 'libs/Cesium/CesiumViewer.css',
      window.path + 'libs/font-awesome-4.7.0/css/font-awesome.css',
      window.apiUrl + 'dojox/layout/resources/ResizeHandle.css',
      window.path + 'jimu.js/css/jimu-theme.css',
        window.apiUrl + 'dgrid/css/dgrid.css',
      window.path + 'libs/caja-html-sanitizer-minified.js',
      window.path + 'libs/moment/twix.js',
      window.path + 'libs/Sortable.js',

      window.path + 'libs/cropperjs/cropperjs.js',
      window.path + 'libs/cropperjs/cropper.css',
      //because we have jimu/dijit/GridLayout dijit, so we import this css here
      window.path + 'libs/goldenlayout/goldenlayout-base.css',
      window.path + 'libs/goldenlayout/goldenlayout-light-theme.css'
    ]);

    if (window.apiUrl.substr(window.apiUrl.length - 'arcgis-js-api/'.length,
      'arcgis-js-api/'.length) === 'arcgis-js-api/') {


    } else {
      dojoConfig.baseUrl = window.path + 'corelib/dojo';
      dojoConfig.packages = [{
        name: "widgets",
        location: window.path + "widgets"
      }, {
        name: "jimu",
        location: window.path + "jimu.js"
      }, {
        name: "themes",
        location: window.path + "themes"
      }, {
        name: "libs",
        location: window.path + "libs"
      },  {
        name: "configs",
        location: window.path + "configs"
      }, {
          name: "dynamic-modules",
          location: window.path + "dynamic-modules"
      } , {
          name: "put-selector",
          location: window.path + "corelib/put-selector"
      }, {
          name: "xstyle",
          location: window.path + "corelib/xstyle"
      }, {
          name: "dgrid",
          location:window.path + "corelib/dgrid"
      }, {
          name: "common",
          location:window.path + "corelib/common"
      }];
      resources.push(window.path + 'corelib/dojo/dojo.js');
    }

    jimuConfig = {
      loadingId: 'main-loading',
      mainPageId: 'main-page',
      layoutId: 'jimu-layout-manager',
      mapId: 'map'
    };

    loadResources(resources, null, function(url, loaded) {
      if (typeof loadingCallback === 'function') {
        loadingCallback(url, loaded, resources.length);
      }
    }, function() {
      continueLoad();

      function continueLoad(){
        if(typeof require === 'undefined'){
          if (window.console){
            console.log('Waiting for API loaded.');
          }
          setTimeout(continueLoad, 100);
          return;
        }

        _loadPolyfills("", function() {
          window.appInfo.appPath = window.path;
          window.avoidRequireCache(require);
          require(['dojo/aspect', 'dojo/request/util'], function(aspect, requestUtil) {
            window.avoidRequestCache(aspect, requestUtil);

            require(['jimu/main', 'libs/main'], function(jimuMain) {
              jimuMain.initApp();
            });
          });
        });
      }
    });
  }

  function setLocale(){
    if(window.queryObject.locale){
      dojoConfig.locale = window.queryObject.locale.toLowerCase();
      window._setRTL(dojoConfig.locale);
      return;
    }

    if(allCookies.esri_auth){
      /*jshint -W061 */
      var userObj = eval('(' + unescape(allCookies.esri_auth) + ')');
      if(userObj.culture){
        dojoConfig.locale = userObj.culture;
      }
    }

    if(window.queryObject.mode){
      if(allCookies.wab_locale){
        dojoConfig.locale = allCookies.wab_locale;
      }
    }else{
      if(allCookies.wab_app_locale){
        dojoConfig.locale = allCookies.wab_app_locale;
      }
    }


    if(!dojoConfig.locale){
      dojoConfig.locale = navigator.language ? navigator.language : navigator.userLanguage;
    }

    dojoConfig.locale = dojoConfig.locale.toLowerCase();
    window._setRTL(dojoConfig.locale);
  }
})();