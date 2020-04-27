///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:控制地图二三维模式切换
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
  function(
    declare,
    lang,
    BaseWidget,
    html,
    domConstruct,
    topic,
    on) {
    var clazz = declare([BaseWidget], {

      name: 'SceneMode',
      baseClass: 'jimu-widget-SceneMode',

      postCreate: function() {
          this.inherited(arguments);
      },

      startup: function() {
        this.inherited(arguments);
        new Cesium.SceneModePicker(this.domNode, this.map.scene);
      }

    });
    return clazz;
  });