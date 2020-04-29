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

      name: 'HelpButton',
      baseClass: 'jimu-widget-helpbutton',

      postCreate: function () {
        this.inherited(arguments);
      },

      startup: function () {
        var that = this;
        this.inherited(arguments);

        var NavigationHelpButton = new Cesium.NavigationHelpButton({ container: this.domNode });
        if (NavigationHelpButton) {
          NavigationHelpButton.viewModel.tooltip = "操作指南";
          var clickHelper = NavigationHelpButton.container.getElementsByClassName("cesium-click-navigation-help")[0];
          var touchHelper = NavigationHelpButton.container.getElementsByClassName("cesium-touch-navigation-help")[0];

          var button = NavigationHelpButton.container.getElementsByClassName("cesium-navigation-button-right")[0];
          button.innerHTML = button.innerHTML.replace(">Touch", ">手势");
          button = NavigationHelpButton.container.getElementsByClassName("cesium-navigation-button-left")[0];
          button.innerHTML = button.innerHTML.replace(">Mouse", ">鼠标");

          var click_help_pan = clickHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
          click_help_pan.innerHTML = "平移";
          var click_help_pan_details = click_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0];
          click_help_pan_details.innerHTML = "按下左键 + 拖动";

          var click_help_zoom = clickHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
          click_help_zoom.innerHTML = "旋转";
          click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "按下右键+拖动";
          click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";

          var click_help_rotate = clickHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
          click_help_rotate.innerHTML = "缩放";
          click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "滚动鼠标滚轮";
          click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";
          //触屏操作
          var touch_help_pan = touchHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
          touch_help_pan.innerHTML = "平移";
          touch_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "单指拖动";

          var touch_help_zoom = touchHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
          touch_help_zoom.innerHTML = "缩放";
          touch_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指捏合";

          var touch_help_tilt = touchHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
          touch_help_tilt.innerHTML = "俯仰";
          touch_help_tilt.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指同向拖动";

          var touch_help_rotate = touchHelper.getElementsByClassName("cesium-navigation-help-tilt")[0];
          touch_help_rotate.innerHTML = "旋转";
          touch_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指反向拖动";
        }

      }

    });
    return clazz;
  });