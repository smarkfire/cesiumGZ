///////////////////////////////////////////////////////////////////////////
// Copyright © 2020 zhongsong. All Rights Reserved.
// 模块描述:飞行路线
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'dojo/topic',
        'jimu/BaseWidget',
        './fly',
        './FileSaver'
    ],
    function (declare,
              lang,
              array,
              html,
              topic,
              BaseWidget
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-FlyRoute',
            name: 'FlyRoute',
            flightTool:null,
            allRoutes:null,
            startup: function () {
				var self = this;
                this.inherited(arguments);
				this.init();
				
				$('.close-flyrouter').click(function () {
					$('.jimu-widget-FlyRoute').hide();
					self.flightTool.RouteCollection.removeAllSites();
	            	$("#passPoint").empty();
				})
            },
            init: function(evt) {
            	var self = this;
            	//实例化飞行工具
            	self.flightTool = new Fly_NZC(self.map);
            	
            	//获取全部路线数据
            	$.ajax({
	                url: "widgets/FlyRoute/flyroute.json",
	                type: "GET",
	                dataType: "json",
	                success: function (data) {
	                    if (data.length == undefined) return;
	                    self.allRoutes = data;
	                    for (var i = 0; i < data.length; i++) {
	                    	$("#flightRoute").append("<option value='"+data[i].name+"'>"+data[i].name+"</option>");
	                    }
	                    
	                    $("#flightRoute").on("change", function(e){
	                    	let selectRoute = self.allRoutes.find(x => x.name == $("#flightRoute").val());
	                    	self._loadRoute(selectRoute.sites);
        				});
        				
        				//初始加载默认路线
        				//self._loadRoute(self.allRoutes[0].sites);
	                    
	                }
	            });
	            
	            //开始漫游
	            $("#ks").click(function(){
	            	self.flightTool.flyManager.play();
	            });
	            //暂停漫游
	            $("#zt").click(function(){
	            	self.flightTool.flyManager.pause();
	            });
	            //停止漫游
	            $("#tz").click(function(){
	            	self.flightTool.flyManager.stop();
	            });
	            //删除路线
	            $("#detele").click(function(){
	            	self.flightTool.RouteCollection.removeAllSites();
	            	$("#passPoint").empty();
	            });
	            
	            //绘制路线
	            var dataArr = [],id = 0;
	            $("#add").click(function(){
	            	var liStr = "<li class='item'>途径点"+($("#passPoint").children().length+1)+"</li>";
	            	var liDom = $(liStr);
	            	
			        var camera=self.map.scene.camera;
			        
			        var cartographic=Cesium.Cartographic.fromCartesian(camera.position);
			        var lat=Cesium.Math.toDegrees(cartographic.latitude);
					var lng=Cesium.Math.toDegrees(cartographic.longitude);
					var height=cartographic.height;
					
			    	var data = {};
			    	data.id=id;
			        data.lgtd=lng;
			        data.lttd=lat; 
			        data.height=height;
			        data.heading=Cesium.Math.toDegrees(camera.heading);
			        data.pitch=Cesium.Math.toDegrees(camera.pitch);
			        data.roll=Cesium.Math.toDegrees(camera.roll);
			        data.time=3;
	            	dataArr.push(data);
	            	
	            	liDom.on('click',data,function(event){
					    console.log(event.data);
					});
					
	            	$('#passPoint').append(liDom);
	            	
	            	self.flightTool.RouteCollection.AddSiteByView(id);
	            	id++;
	            });
	            
	            //导出路线
	            $("#export").click(function(){
	            	  let data = {name:$('#routeName').val(),sites:dataArr};
				      var content = JSON.stringify(data);
				      var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
				      saveAs(blob, "save.json");
				      dataArr = [];
	            });
	            
	            topic.subscribe("autoRoam", lang.hitch(this, this._executeRoam));
	            
            },
            
            _executeRoam: function (data) {
            	let selectRoute = this.allRoutes.find(x => x.name == data);
            	for (var i = 0; i < selectRoute.sites.length; i++) {
		    		let cartesian3 = Cesium.Cartesian3.fromDegrees(selectRoute.sites[i].lgtd, selectRoute.sites[i].lttd, selectRoute.sites[i].height);
		    		let site = {"ids":selectRoute.sites[i].id,"position_x":cartesian3.x,"position_y":cartesian3.y,"position_z":cartesian3.z,
		    					"pitch":Cesium.Math.toRadians(selectRoute.sites[i].pitch),"heading":Cesium.Math.toRadians(selectRoute.sites[i].heading),
		    					"roll":Cesium.Math.toRadians(selectRoute.sites[i].roll),"time":selectRoute.sites[i].time};
		    		this.flightTool.allSites[i] = site;
		    	}
            	this.flightTool.flyManager.play();
            },
            
            _loadRoute: function (route) {
            	var self = this;
            	$("#passPoint").empty();
                self.flightTool.RouteCollection.AddRoute(route);
                for (var j = 0; j < route.length; j++) {
            		var liStr = "<li class='item'>途径点"+(j+1)+"</li>";
	        		var liDom = $(liStr);
	                liDom.on('click',route[j],function(event){
				    	console.log(event.data);
				    	var site = self.flightTool.RouteCollection.getSiteByIndex(event.data.id);
				    	self.flightTool.flyManager.viewToSite(site);
					});
	            	$('#passPoint').append(liDom);
            	}
                
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