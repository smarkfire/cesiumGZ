///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:按钮恢复全图视角
///////////////////////////////////////////////////////////////////////////
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'jimu/BaseWidget',
  'dojo/_base/html',
  'dojo/dom-construct',
  'dojo/topic',
  'dojo/on'
],
  function (
    declare,
    lang,
    BaseWidget,
    html,
    domConstruct,
    topic,
    on) {
    var clazz = declare([BaseWidget], {

      name: 'VrButton',
      baseClass: 'jimu-widget-vrbutton',

      postCreate: function () {
        this.inherited(arguments);
      },

      startup: function () {
        var that = this;
        this.inherited(arguments);
        new Cesium.VRButton (this.domNode, this.map.scene )
        // new Cesium.VRButtonViewModel (scene, vrElement )
      }

    });
    return clazz;
  });