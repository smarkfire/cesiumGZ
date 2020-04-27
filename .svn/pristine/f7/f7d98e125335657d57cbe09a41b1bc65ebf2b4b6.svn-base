define([
  'dijit/TooltipDialog',
  'dijit/popup',
  'dojo/_base/html',
  'dojo/on',
  'dojo/mouse',
  'dojo/query'
], function(TooltipDialog, dojoPopup, html, on, Mouse, query) {
  var mo = {}, tooltipTimeout = 200;

  mo.initTooltips = function(domNode) {
    query('[title]', domNode).forEach(function(node){
      if (node) {
        var content = html.getAttr(node, 'title');
        html.setAttr(node, 'title', '');
        createTooptipDialog(content, node);
      }
    });
  };

  function createTooptipDialog(content, node){
    var tooltipDialogContent = html.create("div", {
      'innerHTML': content,
      'class': 'dialog-content'
    });

    var tooltipDialog = new TooltipDialog({
      content: tooltipDialogContent
    }), tooltipTimeoutId;

    on(node, Mouse.enter, function() {
      clearTimeout(tooltipTimeoutId);
      tooltipTimeoutId = -1;
      tooltipTimeoutId = setTimeout(function() {
        dojoPopup.open({
          parent: null,
          popup: tooltipDialog,
          around: node,
          position: ["below"]
        });
      }, tooltipTimeout);
    });
    on(node, Mouse.leave, function(){
      clearTimeout(tooltipTimeoutId);
      tooltipTimeoutId = -1;
      dojoPopup.close(tooltipDialog);
    });

    return tooltipDialog;
  }

  return mo;
});