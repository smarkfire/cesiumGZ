define([], function () {
    var thisoption = {};

    function Flyobj() {

        function ctsn3ToDegree(cartesian3) {
            let cartographic = AppScope.Viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
            return {
                lng: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                alt: cartographic.height
            };
        }

        function getHeadingRadian(point1, point2) {
            return Math.atan2(point2.lng - point1.lng, point2.lat - point1.lat);
        }

        /**
         * 空间两点距离计算函数 单位 米
         **/
        function getSpaceDistance(positions) {
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

        var frame_obj={};//上层变量 防止内存溢出
        /**
         * 帧处理者
         **/
        var frame_handler = function (clock) {
            frame_obj.thistime = new Date().getTime();
            frame_obj.timespan = 0;
            frame_obj.nexttime = 0.001;
            frame_obj.timespan = (frame_obj.thistime - AppScope.FlyRoute.timeclock) / 1000;

            frame_obj.lasttime = frame_obj.lasttime + frame_obj.timespan;
            if (frame_obj.lasttime > frame_obj.timesum) {
                frame_obj.lasttime = 0;
            }
            frame_obj.nexttime = frame_obj.lasttime + frame_obj.timespan * 2;
            if (frame_obj.nexttime > frame_obj.timesum) {
                frame_obj.nexttime = frame_obj.timesum;
            }
            frame_obj.point = frame_obj.spline.evaluate(frame_obj.lasttime);
            frame_obj.point2 = frame_obj.spline.evaluate(frame_obj.nexttime);

            frame_obj.heading = getHeadingRadian(ctsn3ToDegree(frame_obj.point), ctsn3ToDegree(frame_obj.point2));
            frame_obj.pitch = Cesium.Cartesian3.angleBetween(frame_obj.point, frame_obj.point2)-Math.PI/12;
            AppScope.Viewer.camera.lookAt(frame_obj.point, new Cesium.HeadingPitchRange(frame_obj.heading, frame_obj.pitch, 100.0));
            AppScope.FlyRoute.timeclock = frame_obj.thistime;
        }

        /**
         * 创建路线
         **/
        function CreateFlyRoute(option) {
            option.timeline = [];
            option.timeline.push(0);
            option.pointline = [];
            option.timesum = 0;
            option.pointline.push(Cesium.Cartesian3.fromDegrees(option.points[0], option.points[1], option.points[2]+option.add_height));
            var len = option.points.length - 3;
            for (var index = 0; index < len; index += 3) {
                let length = getSpaceDistance([{
                    longitude: option.points[index],
                    latitude: option.points[index + 1],
                    height: option.points[index + 2]+option.add_height
                },
                {
                    longitude: option.points[index + 3],
                    latitude: option.points[index + 4],
                    height: option.points[index + 5]+option.add_height
                }]);
                let t = length / option.speed;//计算速度
                option.timesum += t;
                option.timeline.push(option.timesum);

                option.pointline.push(Cesium.Cartesian3.fromDegrees(option.points[index + 3], option.points[index + 4], option.points[index + 5]+option.add_height));
            }
            option.lasttime = option.timesum;
            option.spline = new Cesium.CatmullRomSpline({
                times: option.timeline,
                points: option.pointline
            });
            //航向
            option.hpRange = new Cesium.HeadingPitchRange();
            option.fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
        }


        var fly_obj = {};
        fly_obj.routes = [];
        fly_obj.stop = function () {
            if(AppScope.FlyRoute.thisRoute!=undefined&&AppScope.FlyRoute.thisRoute.flyline!=undefined){
                AppScope.Viewer.entities.remove(AppScope.FlyRoute.thisRoute.flyline);
                AppScope.FlyRoute.thisRoute.flyline = undefined;
            }
            AppScope.Viewer.clock.onTick.removeEventListener(frame_handler);
            AppScope.Viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        };
        fly_obj.ispause = false;
        fly_obj.pause = function () {
            if(fly_obj.ispause){
               fly_obj.ispause = false;
               AppScope.Viewer.clock.onTick.addEventListener(frame_handler);
            }else{
                fly_obj.ispause = true;
                AppScope.Viewer.clock.onTick.removeEventListener(frame_handler);
            }
        };
        fly_obj.load = function (arr) {
            $.ajax({
                url: "data/flyroute.json",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data.length == undefined) return;
                    AppScope.FlyRoute.routes=[];
                    data.forEach(item => {
                        CreateFlyRoute(item);
                        AppScope.FlyRoute.routes.push(item);
                    });
                }
            });
        };
        fly_obj.start = function () {
            this.stop();
            fly_obj.ispause = false;
            AppScope.FlyRoute.thisRoute = AppScope.FlyRoute.routes[0];
            var points = [];
            for(var i=0;i<AppScope.FlyRoute.thisRoute.timesum;i+=0.1){//航线线条的平滑度(与飞行无关)
                points.push(AppScope.FlyRoute.thisRoute.spline.evaluate(i));
            }
            AppScope.FlyRoute.thisRoute.flyline = AppScope.Viewer.entities.add({
                name : '航线',
                polyline : {
                    positions : points,
                    width : 0.4,
                    material : Cesium.Color.DARKSLATEBLUE,
                    //clampToGround : true
                }
            });
            AppScope.FlyRoute.thisRoute.lasttime = AppScope.FlyRoute.thisRoute.timesum;
            AppScope.FlyRoute.timeclock = new Date().getTime();
            frame_obj = AppScope.FlyRoute.thisRoute;
            AppScope.Viewer.clock.onTick.addEventListener(frame_handler);
        }
        return fly_obj;
    }
    if (AppScope.FlyRoute == undefined) {
        AppScope.FlyRoute = Flyobj();
    }

    thisoption.ShowTool = function () {

        layer.closeAll();
        var html1 = "<div style='margin:6px'><input type='button' class='cesium-button' value='开始飞行' onclick='AppScope.FlyRoute.start();'><input type='button' class='cesium-button' value='暂停\\继续' onclick='AppScope.FlyRoute.pause();'><input class='cesium-button layui-layer-close' type='button' value='退出飞行'/></div>";
        $('.cesium-viewer-animationContainer').hide();
        layer.closeAll();
        layer.open({
            type: 1,
            title: "飞行功能",
            area: ['280px', '80px'],
            shade: 0,
            offset: ['100px', 'calc(100% - 380px)'],
            content: html1,
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
                AppScope.FlyRoute.load();
            },
            end: function () {
                AppScope.FlyRoute.stop();
            }
        });
    }


    return thisoption;
});