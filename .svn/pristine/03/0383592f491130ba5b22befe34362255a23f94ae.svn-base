define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dijit/_WidgetBase'],
  function (declare, lang, html, _WidgetBase) {
  return declare([_WidgetBase], {
    widget: null,
    baseClass: 'jimu-widget-frame jimu-container',

    postCreate: function(){
      this.inherited(arguments);
      if(!this.containerNode){
        this.containerNode = this.domNode;
      }
      if(this.widget){
        this.setWidget(this.widget);
      }
    },

    startup: function(){
      this.inherited(arguments);
      if(this.widget){
        this.widget.startup();
      }
    },

    resize: function(){
      if(this.widget && this.widget.state !== 'closed' &&
        lang.isFunction(this.widget.resize)){
        this.widget.resize();
      }
    },

    setLoading: function(_loading){
      this.loading = _loading;
      this.loading.placeAt(this.containerNode);
    },

    getWidget: function(){
      return this.widget;
    },

    setWidget: function(w){
      this.widget = w;
      if(this.loading){
        this.loading.destroy();
      }
      html.place(w.domNode, this.containerNode);
      this.resize();
    },

    destroy: function(){
      if(this.widget && this.widget.domNode){
        try{
          this.widget.destroy();
        }catch(error){
          console.error('destroy widget error. widget: [' + this.widget.uri + '], ' + error.stack);
        }
      }
      if(this.loading && this.loading.domNode){
        this.loading.destroy();
      }
    }

  });
});