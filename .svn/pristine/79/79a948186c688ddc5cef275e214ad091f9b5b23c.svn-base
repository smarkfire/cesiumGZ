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
  function(
    declare,
    lang,
    BaseWidget,
    html,
    domConstruct,
    topic,
    on) {
    var clazz = declare([BaseWidget], {

      name: 'HomeButton',
      baseClass: 'jimu-widget-homebutton',

      postCreate: function() {
          this.inherited(arguments);
      },

      startup: function() {
        this.inherited(arguments);

        var homeButton = new Cesium.HomeButton(this.domNode, this.map.scene);
        // Subscribe to the home button beforeExecute event so that we can clear the trackedEntity.
        this.map._eventHelper.add(homeButton.viewModel.command.beforeExecute, Cesium.Viewer.prototype._clearTrackedObject, this.map);

      }

    });
    return clazz;
  });