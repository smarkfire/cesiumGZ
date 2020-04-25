define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dijit/_WidgetBase',
  './utils'
],
function(declare, lang, html, _WidgetBase, utils) {
  return declare(_WidgetBase, {
    'class': 'jimu-widget-placeholder',

    postCreate: function(){
      this.inherited(arguments);
      this.indexNode = html.create('div', {
        'class': 'inner',
        innerHTML: this.index
      }, this.domNode);
      html.setAttr(this.domNode, 'title', window.jimuNls.widgetPlaceholderTooltip);
    },

    moveTo: function(position){
      var style = {
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        top: 'auto',
        width: 'auto',
        height: 'auto'
      };
      style = lang.mixin(style, utils.getPositionStyle(position));
      //we don't change width and height through layout
      delete style.width;
      delete style.height;
      html.setStyle(this.domNode, style);
    },

    setIndex: function(index){
      this.index = index;
      this.indexNode.innerHTML = index;
    }
  });
});