define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/config',
  'dojo/cookie',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  './utils',
  './WidgetManager',
  './shared/utils'
],
function (declare, lang, array, html, dojoConfig, cookie,
  Deferred, all, xhr, jimuUtils, WidgetManager, sharedUtils) {
  var instance = null, clazz;

  clazz = declare(null, {
    urlParams: null,
    appConfig: null,
    rawAppConfig: null,
    configFile: null,
    _configLoaded: false,
    portalSelf: null,

    constructor: function (urlParams, options) {
      this._removeHash(urlParams);
      this.urlParams = urlParams || {};
      this.widgetManager = WidgetManager.getInstance();
      lang.mixin(this, options);
    },

    /****************************************************
    * The app accept the following URL parameters:
    * ?config=<abc-config.json>, this is a config file url
    * ?id=<123>, the id is WAB app id, which is created from portal.
          URL has this parameter means open WAB app from portal.
    * ?appid=<123>, the appid is portal/AGOL app id, which is created from portal/AGOL template.
          The template is created from WAB's app.
          When URL has this parameter, we'll check whether the app is launched
          in portal/AGOL, or not in portal/AGOL.
          > IF in portal, we'll use the appid to get portal/AGOL template id and app data,
          then get WAB app id, then get WAB app config, then merge config;
          > IF NOT in portal, we'll use the appid to get app data, then merge the data
          to WAB app config.
        How to check whether the app is in portal?
          When try to load config file, if URL has no config or id parameter, we'll load
          <app>/config.json file. If the app is in XT, the portalUrl in config.json is not empty.
          If the app is in portal/AGOL, the app is stemapp indeed, which portalUrl is empty.
          So, if portal url is empty, we consider the app is in portal. However, the exception is
          launch stemapp directly. The solution is the XT builder will write "wab_portalurl" cookie
          for stemapp. So, if we find this cookie, we know the app is not in portal.
    * ?itemid=<itemid>, this webmap item will override the itemid in app config
    * ?mode=<config|preview>, this is for internal using purpose
    * ?URL parameters that affect map extent
    ********************************************************/
    loadConfig: function () {
      console.time('Load Config');
        return this._tryLoadConfig().then(lang.hitch(this, function(appConfig) {
            var err = this.checkConfig(appConfig);
            if (err) {
                throw err;
            }
            this.rawAppConfig = lang.clone(appConfig);
            appConfig = this._upgradeAppConfig(appConfig);
            this._processAfterTryLoad(appConfig);
            this.appConfig = appConfig;

            return this.loadWidgetsManifest(appConfig).then(lang.hitch(this, function() {
                return this.loadAndUpgradeAllWidgetsConfig(appConfig);
            })).then(lang.hitch(this, function() {
                this._configLoaded = true;
                if(appConfig.title){
                    document.title = appConfig.title;
                }
                return this.getAppConfig();
            }));
        }), lang.hitch(this, function(err){
            this.showError(err);
        }));
    },

    getAppConfig: function(){
      var c = lang.clone(this.appConfig);
      c.getConfigElementById = function(id){
        return jimuUtils.getConfigElementById(this, id);
      };

      c.getConfigElementsByName = function(name){
        return jimuUtils.getConfigElementsByName(this, name);
      };

      c.visitElement = function(cb){
        jimuUtils.visitElement(this, cb);
      };


      return c;
    },

    checkConfig: function(){
      return false;
    },

    addNeedValues: function(appConfig){
      this._processNoUriWidgets(appConfig);
      this._processEmptyGroups(appConfig);
      this._addElementId(appConfig);

      //do't know why repreated id is generated sometimes, so fix here.
      this._fixRepeatedId(appConfig);
    },

    showError: function(err){
      if(err && err.message){
        html.create('div', {
          'class': 'app-error',
          innerHTML: jimuUtils.sanitizeHTML(err.message)
        }, document.body);
      }
    },

    _tryLoadConfig: function() {
      if(this.urlParams.id === 'stemapp'){
        this.urlParams.config = window.appInfo.appPath + 'config.json';
        delete this.urlParams.id;
      }
      if(this.urlParams.config) {
        this.configFile = this.urlParams.config;
        return xhr(this.configFile, {
          handleAs: 'json',
          headers: {
            "X-Requested-With": null
          }
        }).then(lang.hitch(this, function(appConfig){
          return appConfig;
        }));
      }else if(this.urlParams.id){

      } else{
        this.configFile = "config.json";
        return xhr(this.configFile, {handleAs: 'json'}).then(lang.hitch(this, function(appConfig){

          return appConfig;
        }));
      }
    },

    _upgradeAppConfig: function(appConfig){
      var appVersion = window.wabVersion;
      var configVersion = appConfig.wabVersion;
      var newConfig;

      //save wabVersion in app config json here
      appConfig.configWabVersion = appConfig.wabVersion;

      if(appVersion === configVersion){
        return appConfig;
      }
      var configVersionIndex = this.versionManager.getVersionIndex(configVersion);
      var appVersionIndex = this.versionManager.getVersionIndex(appVersion);
      if(configVersionIndex > appVersionIndex){
        throw Error('Bad version number, ' + configVersion);
      }else{
        newConfig = this.versionManager.upgrade(appConfig, configVersion, appVersion);
        newConfig.wabVersion = appVersion;
        return newConfig;
      }
    },

    loadAndUpgradeAllWidgetsConfig: function(appConfig){
      var def = new Deferred(), defs = [];

      sharedUtils.visitElement(appConfig, lang.hitch(this, function(e){
        if(!e.uri){
          return;
        }
        var upgradeDef = this.widgetManager.tryLoadWidgetConfig(e);
        defs.push(upgradeDef);
      }));
      all(defs).then(lang.hitch(this, function(){
        def.resolve(appConfig);
      }), function(err){
        def.reject(err);
      });
      return def;
    },

    _processAfterTryLoad: function(appConfig){
      this._processUrlParams(appConfig);

      this.addNeedValues(appConfig);

      return appConfig;
    },

    _processNoUriWidgets: function(appConfig){
      var i = 0;
      sharedUtils.visitElement(appConfig, function(e, info){
        if(info.isWidget && !e.uri){
          i ++;
          e.placeholderIndex = i;
        }
      });
    },

    _processEmptyGroups: function(appConfig){
      var i = 0;
      if(!appConfig.widgetOnScreen.groups){
        return;
      }
      array.forEach(appConfig.widgetOnScreen.groups, function(g){
        if(!g.widgets || g.widgets && g.widgets.length === 0){
          i ++;
          g.placeholderIndex = i;
        }
      });
    },

    _addElementId: function (appConfig){
      var maxId = 0, i;

      sharedUtils.visitElement(appConfig, function(e){
        if(!e.id){
          return;
        }
        //fix element id
        e.id = e.id.replace(/\//g, '_');

        var li = e.id.lastIndexOf('_');
        if(li > -1){
          i = e.id.substr(li + 1);
          maxId = Math.max(maxId, i);
        }
      });

      sharedUtils.visitElement(appConfig, function(e){
        if(!e.id){
          maxId ++;
          if(e.itemId){
            e.id = e.itemId + '_' + maxId;
          }else if(e.uri){
            e.id = e.uri.replace(/\//g, '_') + '_' + maxId;
          }else{
            e.id = ''  + '_' + maxId;
          }
        }
      });
    },


    _removeHash: function(urlParams){
      for(var p in urlParams){
        if(urlParams[p]){
          urlParams[p] = urlParams[p].replace('#', '');
        }
      }
    },

    loadWidgetsManifest: function(config){
      var defs = [], def = new Deferred();
      if(this.urlParams.manifest && config._buildInfo && config._buildInfo.widgetManifestsMerged){
        delete config._buildInfo.widgetManifestsMerged;
      }
      if(config._buildInfo && config._buildInfo.widgetManifestsMerged){
        this._loadMergedWidgetManifests().then(lang.hitch(this, function(manifests){
          sharedUtils.visitElement(config, lang.hitch(this, function(e){
            if(!e.widgets && (e.uri || e.itemId)){
              if(e.uri && manifests[e.uri]){
                this._addNeedValuesForManifest(manifests[e.uri], e.uri);
                jimuUtils.widgetJson.addManifest2WidgetJson(e, manifests[e.uri]);
              }else{
                defs.push(loadWidgetManifest(this.widgetManager, e, config.portalUrl));
              }
            }
          }));
          all(defs).then(function(){
            def.resolve(config);
          });
        }));
      }else{
        sharedUtils.visitElement(config, lang.hitch(this, function(e){
          if(!e.widgets && (e.uri || e.itemId)){
            defs.push(loadWidgetManifest(this.widgetManager, e, config.portalUrl));
          }
        }));
        all(defs).then(function(){
          def.resolve(config);
        });
      }

      function loadWidgetManifest(widgetManager, e, portalUrl){
        function _doLoadWidgetManifest(e){
          return widgetManager.loadWidgetManifest(e).then(function(manifest){
            return manifest;
          }, function(err){
            console.log('Widget failed to load, it is removed.', e.name);

            if(err.stack){
              console.error(err.stack);
            }else{
              //TODO err.code === 400, err.code === 403
              console.log(err);
            }
            deleteUnloadedWidgets(config, e);
          });
        }

        if(e.itemId){

        }else{
          return _doLoadWidgetManifest(e);
        }
      }

      function isWidgetUsable(/*widgetUrl*/){
        return true;
      }

      function deleteUnloadedWidgets(config, e){
        //if has e, delete a specific widget
        //if has no e, delete all unloaded widget
        deleteInSection('widgetOnScreen');
        deleteInSection('widgetPool');

        function deleteInSection(section){
          if(config[section] && config[section].widgets){
            config[section].widgets = config[section].widgets.filter(function(w){
              if(e){
                return w.id !== e.id;
              }else{
                if(w.uri && !w.manifest){
                  console.error('Widget is removed because it is not loaded successfully.', w.uri);
                }
                return w.manifest;
              }
            });
          }
          if(config[section] && config[section].groups){
            config[section].groups.forEach(function(g){
              if(g.widgets){
                g.widgets = g.widgets.filter(function(w){
                  if(e){
                    return w.id !== e.id;
                  }else{
                    if(w.uri && !w.manifest){
                      console.error('Widget is removed because it is not loaded successfully.', w.uri);
                    }
                    return w.manifest;
                  }
                });
              }
            });
          }
        }
      }

      setTimeout(function(){
        //delete problem widgets to avoid one widget crash app
        if(!def.isResolved()){
          deleteUnloadedWidgets(config);
          def.resolve(config);
        }
      }, 60 * 1000);
      return def;
    },

    _addNeedValuesForManifest: function(manifest, uri){
      lang.mixin(manifest, jimuUtils.getUriInfo(uri));

      jimuUtils.manifest.addManifestProperies(manifest);
      jimuUtils.manifest.processManifestLabel(manifest, dojoConfig.locale);
    },

    _loadMergedWidgetManifests: function(){
      var file = window.appInfo.appPath + 'widgets/widgets-manifest.json';
      return xhr(file, {
        handleAs: 'json'
      });
    },

    _fixRepeatedId: function(appConfig){
      var id = [];
      sharedUtils.visitElement(appConfig, function(e){
        if(id.indexOf(e.id) >= 0){
          e.id += '_';
        }
        id.push(e.id);
      });
    },

    //we use URL parameters for the first loading.
    //After loaded, if user changes app config through builder,
    //we'll use the configuration in builder.
    _processUrlParams: function(appConfig){
      var urlWebmap = this.urlParams.itemid || this.urlParams.webmap;
      if(urlWebmap && appConfig.map.itemId !== urlWebmap){
        if(appConfig.map.mapOptions){
          jimuUtils.deleteMapOptions(appConfig.map.mapOptions);
        }
        appConfig.map.itemId = urlWebmap;
      }
      if(this.urlParams.mode){
        appConfig.mode = this.urlParams.mode;
      }
      if(!appConfig.map.mapOptions){
        appConfig.map.mapOptions = {};
      }

      if(this.urlParams.scale){
        appConfig.map.mapOptions.scale = this.urlParams.scale;
      }
      if(this.urlParams.level || this.urlParams.zoom){
        appConfig.map.mapOptions.zoom = this.urlParams.level || this.urlParams.zoom;
      }
    }
  });

  clazz.getInstance = function (urlParams, options) {
    if(instance === null) {
      instance = new clazz(urlParams, options);
    }else{
      instance.urlParams = urlParams || {};
      instance.options = options;
    }
    return instance;
  };

  return clazz;
});
