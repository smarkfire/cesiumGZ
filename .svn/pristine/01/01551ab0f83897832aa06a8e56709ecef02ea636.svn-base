define(['dojo/_base/declare',
  'jimu/BaseWidgetFrame',
  './FoldableDijit'],
  function(declare, BaseWidgetFrame, FoldableDijit){
  return declare([BaseWidgetFrame, FoldableDijit], {
    baseClass: 'jimu-widget-frame jimu-foldable-dijit foldable-widget-frame',

    postCreate: function(){
      this.inherited(arguments);
      this.createFoldableBtn();
      this.titleHeight = 30;
      this.foldEnable = true;
    },

    startup: function(){
      this.inherited(arguments);
      this.setTitleLabel(this.label);
    },

    setWidget: function(){
      this.inherited(arguments);
      this.setTitleLabel(this.widget.label);
    },

    onFoldableNodeClick: function(){
      this.inherited(arguments);
      if(!this.widget){
        return;
      }
      if(this.folded){
        this.widgetManager.minimizeWidget(this.widget);
      }else{
        this.widgetManager.maximizeWidget(this.widget);
      }
    }
  });
});