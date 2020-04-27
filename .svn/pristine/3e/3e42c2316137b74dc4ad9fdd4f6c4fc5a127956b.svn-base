define(['dojo/_base/lang',
        'dojo/_base/array',
        "dojo/_base/declare"
    ],
    function (lang,
              array,
              declare
    ){
        return declare("FlightTool",[], { // 飞行工具类
            _map: null,
            _route:null,
            ispause:false,
            startTime:null,
            frame_handler:null,
            constructor: function (options) {
            	var self = this;
            	self._map = options.map;
            	/**
		         * 帧处理者
		         **/
		        self.frame_handler = function () {
		            self._route.thistime = new Date().getTime();
		            self._route.timespan = 0;
		            self._route.nexttime = 0.001;
		            self._route.timespan = (self._route.thistime - self.startTime) / 1000;
		
		            self._route.lasttime = self._route.lasttime + self._route.timespan;
		            if (self._route.lasttime > self._route.timesum) {
		                self._route.lasttime = 0;
		            }
		            self._route.nexttime = self._route.lasttime + self._route.timespan * 2;
		            if (self._route.nexttime > self._route.timesum) {
		                self._route.nexttime = self._route.timesum;
		            }
		            self._route.point = self._route.spline.evaluate(self._route.lasttime);
		            self._route.point2 = self._route.spline.evaluate(self._route.nexttime);
		
		            self._route.heading = self.getHeadingRadian(self.ctsn3ToDegree(self._route.point), self.ctsn3ToDegree(self._route.point2));
		            self._route.pitch = Cesium.Cartesian3.angleBetween(self._route.point, self._route.point2)-Math.PI/12;
		            self._map.camera.lookAt(self._route.point, new Cesium.HeadingPitchRange(self._route.heading, self._route.pitch, 100.0));
		            self.startTime = self._route.thistime;
		        }
            },
            startFly:function () {
            	this.stopFly();
	            this.ispause = false;
	            var points = [];
	            for(var i=0;i<this._route.timesum;i+=0.1){//航线线条的平滑度(与飞行无关)
	                points.push(this._route.spline.evaluate(i));//根据时间获取三次曲线坐标
	            }
	            this._route.flyline = this._map.entities.add({
	                name : '路线',
	                polyline : {
	                    positions : points,
	                    width : 1,
	                    material : Cesium.Color.YELLOW,
	                    //clampToGround : true
	                }
	            });
	            this._route.lasttime = this._route.timesum;
	            this.startTime = new Date().getTime();
	            this._map.clock.onTick.addEventListener(this.frame_handler);
	        },
	        pasueFly:function () {
            	if(this.ispause){
	               this.ispause = false;
	               this._map.clock.onTick.addEventListener(this.frame_handler);
	            }else{
	                this.ispause = true;
	                this._map.clock.onTick.removeEventListener(this.frame_handler);
	            }
	        },
	        stopFly:function () {
	        	if(this._route!=undefined&&this._route.flyline!=undefined){
	                this._map.entities.remove(this._route.flyline);
	                this._route.flyline = undefined;
	            }
	            this._map.clock.onTick.removeEventListener(this.frame_handler);
	            this._map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
	        },
	        /**
	         * 创建路线
	         **/
	        createFlyRoute:function (option) {
	            option.timeline = [];
	            option.timeline.push(0);
	            option.pointline = [];
	            option.timesum = 0;
	            option.pointline.push(Cesium.Cartesian3.fromDegrees(option.points[0].lgtd, option.points[0].lttd, option.points[0].height));
	            for (var index = 0; index < option.points.length-1; index ++) {
	                let length = this.getSpaceDistance([{
	                    longitude: option.points[index].lgtd,
	                    latitude: option.points[index].lttd,
	                    height: option.points[index].height
	                },
	                {
	                    longitude: option.points[index + 1].lgtd,
	                    latitude: option.points[index + 1].lttd,
	                    height: option.points[index + 1].height
	                }]);
	                let t = length / option.speed;//计算时间
	                option.timesum += t;
	                option.timeline.push(option.timesum);
	
	                option.pointline.push(Cesium.Cartesian3.fromDegrees(option.points[index + 1].lgtd, option.points[index + 1].lttd, option.points[index + 1].height));
	            }
	            option.lasttime = option.timesum;
	            option.spline = new Cesium.CatmullRomSpline({
	                times: option.timeline,
	                points: option.pointline
	            });
	            //航向
	            option.hpRange = new Cesium.HeadingPitchRange();
	            option.fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
	            if(this._route!=null&&this._route.flyline!=undefined){
	                this._map.entities.remove(this._route.flyline);
	                this._route.flyline = undefined;
	            }
	            this._route = option;
	        },
            ctsn3ToDegree:function (cartesian3) {
	            var cartographic = this._map.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
	            return {
	                lng: Cesium.Math.toDegrees(cartographic.longitude),
	                lat: Cesium.Math.toDegrees(cartographic.latitude),
	                alt: cartographic.height
	            };
	        },
	        getHeadingRadian:function (point1, point2) {
	            return Math.atan2(point2.lng - point1.lng, point2.lat - point1.lat);
	        },
	        /**
	         * 空间两点距离计算函数 单位 米
	         **/
	        getSpaceDistance:function (positions) {
	            var distance = 0;
	            var deg;
	            for (var i = 0; i < positions.length - 1; i++) {
	                deg = positions[i];
	                var point1cartographic = Cesium.Cartographic.fromDegrees(deg.longitude, deg.latitude, deg.height);
	                deg = positions[i + 1];
	                var point2cartographic = Cesium.Cartographic.fromDegrees(deg.longitude, deg.latitude, deg.height);
	                //根据经纬度计算出距离
	                var geodesic = new Cesium.EllipsoidGeodesic();
	                geodesic.setEndPoints(point1cartographic, point2cartographic);
	                var s = geodesic.surfaceDistance;
	                //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
	                //返回两点之间的距离
	                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
	                distance = distance + s;
	            }
	            return distance;
	        }
        });
	});