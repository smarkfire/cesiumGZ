///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:飞行管理
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'dojo/topic',
        'jimu/BaseWidget',
        './FlightTool',
        './FileSaver'
    ],
    function (declare,
              lang,
              array,
              html,
              topic,
              BaseWidget,
              FlightTool
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-FlightManagement',
            name: 'FlightManagement',
            flightTool:null,
            startup: function () {
                this.inherited(arguments);
                this.init();
            },
            init: function(evt) {
            	var self = this;
            	self.flightTool = new FlightTool({"map":self.map});
            	$.ajax({
	                url: "widgets/FlightManagement/flyroute.json",
	                type: "GET",
	                dataType: "json",
	                success: function (data) {
	                    if (data.length == undefined) return;
	                    self.flightTool.createFlyRoute(data[0]);
	                    //self.flightTool.startFly();
	                    for (var i = 0; i < data.length; i++) {
	                    	$("#flightRoute").append("<option value='"+data[i].name+"'>"+data[i].name+"</option>");
	                    }
	                    
	                    $("#flightRoute").on("change",data, function(e){
	                    	for (var i = 0; i < e.data.length; i++) {
	                    		if(e.data[i].name==$("#flightRoute").val()){
	                    			self.flightTool.createFlyRoute(e.data[i]);
	                    			self.flightTool.startFly();
	                    			break;
	                    		}
	                    	}
        				});
	                    
	                }
	            });
	            
	            $("#ks").click(function(){
	            	self.flightTool.startFly();
	            });
	            $("#zt").click(function(){
	            	self.flightTool.pasueFly();
	            });
	            $("#tz").click(function(){
	            	self.flightTool.stopFly();
	            });
	            
	            var dataArr = [];
	            
	            $("#add").click(function(){
	            	var liStr = "<li class='item'>途径点"+($("#passPoint").children().length+1)+"</li>";
	            	var liDom = $(liStr);
	            	var data = {lgtd:$("#jd").html(),lttd:$("#wd").html(),height:$("#gd").html(),heading:$("#phj").html(),pitch:$("#fyj").html(),roll:$("#fgj").html()};
	            	dataArr.push(data);
	            	liDom.on('click',data,function(event){
					    console.log(event.data);
					});
	            	$('#passPoint').append(liDom);
	            });
	            $("#export").click(function(){
	            	  let data = {name:$('#routeName').val(),speed:Number($('#speed').val()),points:dataArr};
				      var content = JSON.stringify(data);
				      var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
				      saveAs(blob, "save.json");
				      dataArr = [];
	            });
            },
            
            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            resize: function () {

            },

            destroy: function () {
                //销毁的时候触发
                //todo
                //do something before this func
                this.inherited(arguments);
            }

        });
    });