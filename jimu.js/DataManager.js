define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/topic'],
  function (declare, lang, topic) {
  var instance = null, clazz;

  clazz =  declare(null, {
    constructor: function (widgetManager) {
      topic.subscribe('publishData', lang.hitch(this, this.onDataPublished));
      topic.subscribe('fetchData', lang.hitch(this, this.onFetchData));
      topic.subscribe('clearAllData', lang.hitch(this, this.onClearAllData));
      topic.subscribe('removeData', lang.hitch(this, this.onRemoveData));
      topic.subscribe('clearDataHistory', lang.hitch(this, this.onClearDataHistory));

      this.widgetManager = widgetManager;
    },

    _dataStore: {},

    onDataPublished: function (name, id, data, keepHistory) {
      // jshint unused:false

      if(typeof keepHistory === 'undefined') {
        keepHistory = false;
      }

      if(!this._dataStore[id]) {
        this._dataStore[id] = {current: data};
        if(keepHistory){
          this._dataStore[id].history = [data];
        }
      }else{
        this._dataStore[id].current = data;
        if(keepHistory){
          if(this._dataStore[id].history){
            this._dataStore[id].history.push(data);
          }else{
            this._dataStore[id].history = [data];
          }

        }
      }
    },

    onFetchData: function (id) {
      var w;
      if(id){
        if(id === 'framework'){
          if(this._dataStore[id]) {
            topic.publish('dataFetched', 'framework', 'framework',
              this._dataStore[id].current, this._dataStore[id].history);
          } else {
            topic.publish('noData', 'framework', 'framework');
          }
        }else{
          w = this.widgetManager.getWidgetById(id);
          if(w){
            if(this._dataStore[id]) {
              topic.publish('dataFetched', w.name, id,
                this._dataStore[id].current, this._dataStore[id].history);
            } else {
              topic.publish('noData', w.name, id);
            }
          }else{
            topic.publish('noData', undefined, id);
          }
        }
      }else{
        for(var p in this._dataStore){
          w = this.widgetManager.getWidgetById(p);
          if(w){
            topic.publish('dataFetched', w.name, p,
              this._dataStore[p].current, this._dataStore[p].history);
          }
        }
        if(!w) {
          topic.publish('noData', undefined, undefined);
        }
      }
    },

    onClearAllData: function(){
      this._dataStore = {};
      topic.publish('allDataCleared');
    },

    onRemoveData: function(id){
      delete this._dataStore[id];
      topic.publish('dataRemoved', id);
    },

    onClearDataHistory: function(id){
      if(this._dataStore[id]){
        this._dataStore[id].history = [];
      }
      topic.publish('dataHistoryCleared', id);
    }
  });

  clazz.getInstance = function(widgetManager) {
    if(instance === null) {
      instance = new clazz(widgetManager);
    }
    return instance;
  };
  return clazz;
});