///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:获取两点间地形剖面
///////////////////////////////////////////////////////////////////////////
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/html',
    "dojo/_base/fx",
    'jimu/BaseWidget',
    "dojo/topic",
    "dojo/Deferred",
    "dojo/on",
    'jimu/dijit/Popup',
    "./SectionChart"

],function(
    declare,
    lang,
    html,
    fx,
    BaseWidget,
    topic,
    Deferred, 
    on, 
    Popup,
    SectionChart

){
    return declare("MapSection", [BaseWidget],{
        baseClass:"demo-widgets-MapSection",
        postCreate:function(){ 
            this.inherited(arguments);
         
            this._tooltip = this.createTooltip(this.map.cesiumWidget.container);
        },
        createTooltip: function (frameDiv) {

            var tooltip = function(frameDiv) {

                var div = document.createElement('DIV');
                div.className = "twipsy right";

                var arrow = document.createElement('DIV');
                arrow.className = "twipsy-arrow";
                div.appendChild(arrow);

                var title = document.createElement('DIV');
                title.className = "twipsy-inner";
                div.appendChild(title);

                this._div = div;
                this._title = title;

                // add to frame div and display coordinates
                frameDiv.appendChild(div);
            }

            tooltip.prototype.setVisible = function(visible) {
                this._div.style.display = visible ? 'block' : 'none';
            }

            tooltip.prototype.showAt = function(position, message) {
                if(position && message) {
                    this.setVisible(true);
                    this._title.innerHTML = message;
                    this._div.style.left = position.x + 10 + "px";
                    this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
                }
            }

            return new tooltip(frameDiv);
        },
        destroy:function(){

            this.inherited(arguments);
        },
        // click:function(){
        //     this.active = !this.active;
        //     if(this.active){
        //         this._tooltip.setVisible(true);
        //     }else{
        //         this._tooltip.setVisible(false);
        //     }
        //     this.clearEntity();
        // },
        onOpen: function () {
            this.active = true;
            this.clearEntity();
            this._tooltip.setVisible(true);
        },
        onClose: function () {
            this.active = false;
            this.clearEntity();
            this._tooltip.setVisible(false)
        },
        active:false,
        startup:function(){
            this.inherited(arguments);

            var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);

            handler.setInputAction(
                lang.hitch(this,function (movement) {
                    if(!this.active)return;
                    var ellipsoid = window.viewer.scene.globe.ellipsoid;
                    var ellipsoid = Cesium.Ellipsoid.WGS84;
//	            	var cartesian = window.viewer.scene.camera.pickEllipsoid(movement.position, ellipsoid);//两种的经纬度获取的不一样
                    var pickRay = window.viewer.scene.camera.getPickRay(movement.position);
                    var cartesian = window.viewer.scene.globe.pick(pickRay, window.viewer.scene);

                    if (cartesian) {

                        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);//.toFixed(2);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);//.toFixed(2);

                        this.points.push({"lgtd":longitudeString,"lttd":latitudeString});

                        if(this.points.length==2){
                            //计算
                            var points = this.createHundryPoints(this.points);
                            //弹出
                            this.getData(points);
                            this.points = [];
                            this.active = false;
                            this._tooltip.setVisible(false);
                            this.bill2 = window.viewer.entities.add({
                                position : Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString ),
                                billboard : {
                                    image : "images/marker_green.png",
                                    pixelOffset: new Cesium.Cartesian2(0, 0),
                                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                }
                            });
                            return;
                        }
                        this.bill1 = window.viewer.entities.add({
                            position : Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString ),
                            billboard : {
                                image : "images/marker_green.png",
                                pixelOffset: new Cesium.Cartesian2(0, 0),
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });
                    }

                }), Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handler.setInputAction(
                lang.hitch(this,function (movement) {
                    if(!this.active)return;
                    if(this.points.length==0){
                        this._tooltip.showAt(movement.endPosition, "请获取起点");
                        return;
                    }
                    this._tooltip.showAt(movement.endPosition, "点击结束");

                }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },
        clearEntity:function(){
            window.viewer.entities.remove(this.bill1);
            window.viewer.entities.remove(this.bill2);
            window.viewer.entities.remove(this.line);
        },
        createHundryPoints:function(list){

            var lgtd1 = list[0].lgtd;
            var lgtd100 = list[1].lgtd;
            var lgtdStep = (lgtd100-lgtd1)/1000;

            var lttd1 = list[0].lttd;
            var lttd100 = list[1].lttd;
            var lttdStep = (lttd100-lttd1)/1000;
            var ary = [];
            for(var i=0;i<1000;i++){
                var lgtd = lgtd1 +(lgtdStep*i);
                var lttd = lttd1 +(lttdStep*i);
                ary.push({"id":i,"lgtd":lgtd,"lttd":lttd});
            }

            return ary;
        },
        points:[],
        getData:function(ary){
            var mappints = [];
            for(var j=0;j<ary.length;j++){
                var pt = ary[j];
                mappints.push({lgtd:pt.lgtd,lttd:pt.lttd,height:0});
            }
            //获取高程去
            this.makeChange(mappints).then(lang.hitch(this,function(list){
                var ptsAry = [];
                var numbers_lgtd=[];
                var numbers_lttd=[];
                for(var j=0;j<list.length;j++){
                    var pt = list[j];
                    ptsAry.push(Number(pt.lgtd));
                    ptsAry.push(Number(pt.lttd));
                    ptsAry.push(Number(pt.height));

                    numbers_lgtd.push(Number(pt.lgtd));
                    numbers_lttd.push(Number(pt.lttd));
                }


                this.line = window.viewer.entities.add({
                    polyline : {
                        positions : Cesium.Cartesian3.fromDegreesArrayHeights(ptsAry),
                        width : 3,
                        material : new Cesium.PolylineOutlineMaterialProperty({
                            color : Cesium.Color.ORANGE,
                            outlineWidth : 1,
                            outlineColor : Cesium.Color.BLACK
                        }),
                        clampToGround: true
                    }
                });

                var panel = new SectionChart({list:ptsAry,oList:list});
                new Popup({
                    content: panel,
                    titleLabel: "地形剖面图",
                    width: 650,
                    height: 370,
                    buttons: [],
                    onClose:lang.hitch(this,function(){
                        return true;
                    })
                });
            }));
        },
        makeChange:function(datas){
            var datas = datas;
            var def = new Deferred();
            var tIds = [];
            var pos = [];
            for(var i=0;i<datas.length;i++){
                var item = datas[i];
                tIds.push(item.id);
                pos.push(Cesium.Cartographic.fromDegrees(item.lgtd, item.lttd));
            }
            Cesium.sampleTerrain(window.viewer.terrainProvider, 9, pos).then(function (pos) {//去获取高程
                for (var i=0; i<tIds.length; i++) {
                    datas[i].height =   pos[i].height;
                }
                def.resolve(datas);
            });
            return def;
        }
    });
});