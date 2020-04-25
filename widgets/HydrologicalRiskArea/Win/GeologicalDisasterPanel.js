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
                this.crainfall.innerHTML = this.data.crainfall || "--";
                this.cenconding.innerHTML = this.data.cenconding || "--";
                this.arainfall.innerHTML = this.data.arainfall || "--";
                this.aconding.innerHTML = this.data.aconding || "--";
                this.township.innerHTML = this.data.township || "--";
                this.village.innerHTML = this.data.village || "--";
                this.village_group.innerHTML = this.data.village_group || "--";
                this.dj.innerHTML = this.data.dj || "--";
                this.bw.innerHTML = this.data.bw || "--";
                this.fyear.innerHTML = this.data.fyear|| "--";
                this.tyear.innerHTML = this.data.tyear|| "--";
                this.oyear.innerHTML = this.data.oyear|| "--";
                this.county.innerHTML = this.data.county|| "--";
            }

        });
    });