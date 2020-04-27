define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/html',
        "dojo/topic",
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        "dojo/text!./hsymqPanel.html"
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
        return declare('hsymqPanel',[_WidgetBase, _TemplatedMixin], {

            templateString: template,
            width:270,
            constructor: function (args) {
                declare.safeMixin(this, args);
            },

            postCreate: function () {
                this.rivername.innerHTML = this.data.rivername || "--";
                this.district.innerHTML = this.data.district || "--";
                this.station.innerHTML = this.data.station || "--";
                this.stationcode.innerHTML = this.data.stationcode || "--";
                this.township.innerHTML = this.data.township || "--";
                this.village.innerHTML = this.data.village || "--";
                this.villagegroup.innerHTML = this.data.villagegroup || "--";
                this.dj.innerHTML = this.data.dj || "--";
                this.bw.innerHTML = this.data.bw || "--";
                this.elevation.innerHTML = this.data.elevation|| "--";
                this.waterline.innerHTML = this.data.waterline|| "--";
                this.totalp.innerHTML = this.data.totalp|| "--";
                this.disaster.innerHTML = this.data.disaster|| "--";
                this.fpopulation.innerHTML = this.data.fpopulation|| "--";
                this.fhouseholds.innerHTML = this.data.fhouseholds|| "--";
                this.ftill.innerHTML = this.data.ftill|| "--";
                this.tpopulation.innerHTML = this.data.tpopulation|| "--";
                this.thouseholds.innerHTML = this.data.thouseholds|| "--";
                this.ttill.innerHTML = this.data.ttill|| "--";
                this.ftpopulation.innerHTML = this.data.ftpopulation|| "--";
                this.fthouseholds.innerHTML = this.data.fthouseholds|| "--";
                this.fttill.innerHTML = this.data.fttill|| "--";
                this.waterid.innerHTML = this.data.waterid|| "--";
                this.origin.innerHTML = this.data.origin|| "--";


            }

        });
    });