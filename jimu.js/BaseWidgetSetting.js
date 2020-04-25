define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin'
],
  function(declare, lang, on, _WidgetBase, _TemplatedMixin) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div></div>',
    postCreate: function(){
      this.own(on(window, 'resize', lang.hitch(this, this._onWindowResize)));
    },

    getConfig: function(){
      //implemented by sub class, should return the config object.
      //if this function return a promise, the promise should resolve the config object.
    },

    getDataSources: function(){
      //implemented by sub class, should return the data sources that this widget generates.
      //if this function return a promise, the promise should resolve the data sources object.
    },

    // setConfig: function(/* jshint unused:false */ config){
    //   //implemented by sub class, should update the config UI
    // },

    resize: function(){

    },

    _onWindowResize: function(){
      this.resize();
    }

  });
});