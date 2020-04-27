define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/html',
        "dojo/topic",
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        "dojo/text!./GeologicalDisasterPanel.html"
    ],
    function (
        declare,
        lang,
        html,
        topic,
        _WidgetBase,
        _TemplatedMixin,
        template
    ) {
        return declare('GeologicalDisasterPanel',[_WidgetBase, _TemplatedMixin], {

            templateString: template,

            width:270,
            constructor: function (args) {
                declare.safeMixin(this, args);
            },

            postCreate: function () {
                this.inherited(arguments);
                this.name.innerHTML = this.data.name||"--"; 
                this.location.innerHTML = this.data.location||"--";  
                this.creator.innerHTML = this.data.creator||"--";
                this.nt.innerHTML = this.data.nt||"--";
            }

        });
    });