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
                this.STNM.innerHTML = this.data.STNM || "--";
                this.STCD.innerHTML = this.data.STCD || "--";
                this.市.innerHTML = this.data.市 || "--";
                this.站类.innerHTML = this.data.站类 || "--";
                this.流域.innerHTML = this.data.流域 || "--";
                this.水系.innerHTML = this.data.水系 || "--";
                this.河流.innerHTML = this.data.河流 || "--";
                this.建站年月.innerHTML = this.data.建站年月 || "--";
                this.所在市县.innerHTML = this.data.所在_市县 || "--";
                this.所在乡镇.innerHTML = this.data.所在乡镇|| "--";
            }

        });
    });