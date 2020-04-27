///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:全屏按钮
/////////////////////////////////////////////////////////////////////////// 
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/on',
  "dojo/query",
  'jimu/BaseWidget',
  "dojo/_base/window",
  'jimu/utils'
], function (declare, lang, html, on, query, BaseWidget, win, jimuUtils) {
  var clazz = declare([BaseWidget], {
    name: 'FullScreen',
    baseClass: 'jimu-widget-fullScreen',

    _changeColorThemes: ["BillboardTheme", "BoxTheme", "DartTheme", "PlateauTheme"],

    startup: function () {
      this.inherited(arguments);
      new Cesium.FullscreenButton(this.domNode, null);
    },

    setPosition: function (/*position*/) {
      this.inherited(arguments);

    }
  });

  return clazz;
});