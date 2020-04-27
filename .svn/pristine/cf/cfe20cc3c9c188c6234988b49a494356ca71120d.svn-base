///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/on',
  'dojo/mouse',
  'dojo/query'
],
function (declare, lang, html, _WidgetBase, _TemplatedMixin, on, mouse, query) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="jimu-img-node"></div>',
    /**
    *options:
    *img: the img url,
    *label:
    *width/height/marginTop/marginLeft: can be px or %
    **/
    constructor: function(options, dom){
      /*jshint unused: false*/
    },
    postCreate: function () {
      this.box = html.create('div', {
        'class': 'node-box'
      }, this.domNode);
      html.create('img', {
        'src': this.img
      }, this.box);
      html.create('div', {
        'class': 'node-label',
        'innerHTML': this.label,
        title: this.label
      }, this.domNode);

      this.own(on(this.domNode, 'click', lang.hitch(this, this.onClick)));
    },

    onClick: function(){
      query('.jimu-img-node', this.getParent().domNode).removeClass('jimu-state-selected');
      query(this.domNode).addClass('jimu-state-selected');
    },

    highLight: function(){
      query('.jimu-img-node', this.getParent().domNode).removeClass('jimu-state-selected');
      query(this.domNode).addClass('jimu-state-selected');
    },

    startup: function(){

    }

  });
});