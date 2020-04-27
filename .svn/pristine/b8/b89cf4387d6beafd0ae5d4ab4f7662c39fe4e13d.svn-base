define(['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetFrame'
  ],
  function(declare, lang, html, on, _WidgetBase, _TemplatedMixin, BaseWidgetFrame) {
    return declare([BaseWidgetFrame, _WidgetBase, _TemplatedMixin], {
      baseClass: 'box-frame',
      width: '100%',
      titleHeight: 30,
      content: null, //content is a dijit
      collapsed: false,
      templateString: '<div>' +
        '<div class="title" data-dojo-attach-point="titleNode">' +
        '<div class="title-label"' +
        'data-dojo-attach-point="titleLabelNode"></div>' + '</div>' +
        '<div class="panel-content" data-dojo-attach-point="containerNode"></div>' +
        '</div>',

      startup: function() {
        this.inherited(arguments);

        html.setStyle(this.titleNode, {
          width: this.width,
          height: this.titleHeight + 'px'
        });
        html.setStyle(this.containerNode, {
          top: this.titleHeight + 'px'
        });
        html.setStyle(this.titleLabelNode, {
          lineHeight: this.titleHeight + 'px'
        });
        if (this.label) {
          this.setTitleLabel(this.label);
        }
        this.own(on(this.titleNode, 'click', lang.hitch(this, function(){
          if(this.collapsed){
            this.collapsed = false;
            html.removeClass(this.domNode, 'collapsed');
          }else{
            this.collapsed = true;
            html.addClass(this.domNode, 'collapsed');
          }
        })));
      },

      setTitleLabel: function(label) {
        this.label = label;
        this.titleLabelNode.innerHTML = label;
        this.titleLabelNode.title = label;
      }

    });
  });