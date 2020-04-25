define(['dojo/_base/declare',
  'jimu/BaseWidgetPanel',
  'jimu/BaseWidgetFrame',
  './BoxFrame'
],
function(declare, BaseWidgetPanel, BaseWidgetFrame, BoxFrame) {

  return declare([BaseWidgetPanel], {
    baseClass: 'jimu-widget-panel box-panel',

    startup: function(){
      this.inherited(arguments);
      this.started = true;
    },

    createFrame: function(widgetConfig) {
        var frame;
        if (this.config.widgets && this.config.widgets.length === 1 || !this.config.widgets) {
          frame = new BaseWidgetFrame();
        } else {
          frame = new BoxFrame({
            label: widgetConfig.label,
            widgetManager: this.widgetManager
          });
        }
        return frame;
      }

  });
});