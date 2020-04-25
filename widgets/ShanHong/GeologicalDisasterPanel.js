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
                $('#onto').click(function () {
                   // alert(123)
                })
                // 县
                this.county.innerHTML = this.data.cnnm || "--";
                // 乡
                this.country.innerHTML = this.data.adnm || "--";
                // 行政区
                this.district.innerHTML = this.data.vtnm || "--";
                // 断面代码
                this.section.innerHTML = this.data.adcd || "--";
                // 流域名称
                this.basin.innerHTML = this.data.name || "--";
            }

        });
    });