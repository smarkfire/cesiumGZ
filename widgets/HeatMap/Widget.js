///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:热图实现，集成第三方js
/////////////////////////////////////////////////////////////////////////// 
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/html',
    "dojo/_base/fx",
    'jimu/BaseWidget',
    "./CesiumHeatmap"

],function(
    declare,
    lang,
    html,
    fx,
    BaseWidget 
){
    return declare("demo.widgets.HeatMap", [BaseWidget],{
        baseClass:"demo-widgets-HeatMap",
        postCreate:function(){
            this.inherited(arguments);

        },
        destroy:function(){

            this.inherited(arguments);
        },

        startup:function(){
            this.inherited(arguments);

        },
        flag:false,
        click:function(){
            if(this.heatMap){//判断是否创建了，如果创建了就是控制显示隐藏
                this.flag = !this.flag;

                if(this.flag){
                    this.labelNode.innerHTML = "隐藏热图";
                }else{
                    this.labelNode.innerHTML = "显示热图";
                }

                this.heatMap.show(this.flag);
            }else{
                this.addHeatmap();
                this.flag = true;
                this.labelNode.innerHTML = "隐藏热图";
            }
        },

        addHeatmap: function() {
            var bounds = {
                west: -109.0, south: 30.0, east: -80.0, north: 50.0
            };
            //初始化cesiumheatmap对象，传入相应的参数
            var heatMap = CesiumHeatmap.create(
                window.viewer, // 视图层
                bounds, // 矩形坐标
                {
                    backgroundColor: "rgba(0,0,0,0)",
                    radius: 50,
                    maxOpacity: .5,
                    minOpacity: 0,
                    blur: .75
                }
            );
            // random example data 添加数据 最小值，最大值，数据集
            var data = [{"x":147.1383442264,"y":-41.4360048372,"value":76},{"x":147.1384363011,"y":-41.4360298848,"value":63},{"x":147.138368102,"y":-41.4358360603,"value":1},{"x":147.1385627739,"y":-41.4358799123,"value":21},{"x":147.1385138501,"y":-41.4359327669,"value":28},{"x":147.1385031219,"y":-41.4359730105,"value":41},{"x":147.1384127393,"y":-41.435928255,"value":75},{"x":147.1384551136,"y":-41.4359450132,"value":3},{"x":147.1384927196,"y":-41.4359158649,"value":45},{"x":147.1384938639,"y":-41.4358498311,"value":45},{"x":147.1385183299,"y":-41.4360213794,"value":93},{"x":147.1384007925,"y":-41.4359860133,"value":46},{"x":147.1383604844,"y":-41.4358298672,"value":54},{"x":147.13851025,"y":-41.4359098303,"value":39},{"x":147.1383874733,"y":-41.4358511035,"value":34},{"x":147.1384981796,"y":-41.4359355403,"value":81},{"x":147.1384504107,"y":-41.4360332348,"value":39},{"x":147.1385582664,"y":-41.4359788335,"value":20},{"x":147.1383967364,"y":-41.4360581999,"value":35},{"x":147.1383839615,"y":-41.436016316,"value":47},{"x":147.1384082712,"y":-41.4358423338,"value":36},{"x":147.1385092651,"y":-41.4358577623,"value":69},{"x":147.138360356,"y":-41.436046789,"value":90},{"x":147.138471893,"y":-41.4359184292,"value":88},{"x":147.1385605689,"y":-41.4360271359,"value":81},{"x":147.1383585714,"y":-41.4359362476,"value":32},{"x":147.1384939114,"y":-41.4358844253,"value":67},{"x":147.138466724,"y":-41.436019121,"value":17},{"x":147.1385504355,"y":-41.4360614056,"value":49},{"x":147.1383883832,"y":-41.4358733544,"value":82},{"x":147.1385670669,"y":-41.4359650236,"value":25},{"x":147.1383416534,"y":-41.4359310876,"value":82},{"x":147.138525285,"y":-41.4359394661,"value":66},{"x":147.1385487719,"y":-41.4360137656,"value":73},{"x":147.1385496029,"y":-41.4359187277,"value":73},{"x":147.1383989222,"y":-41.4358556562,"value":61},{"x":147.1385499424,"y":-41.4359149305,"value":67},{"x":147.138404523,"y":-41.4359563326,"value":90},{"x":147.1383883675,"y":-41.4359794855,"value":78},{"x":147.1383967187,"y":-41.435891185,"value":15},{"x":147.1384610005,"y":-41.4359044797,"value":15},{"x":147.1384688489,"y":-41.4360396127,"value":91},{"x":147.1384431875,"y":-41.4360684409,"value":8},{"x":147.1385411067,"y":-41.4360645847,"value":42},{"x":147.1385237178,"y":-41.4358843181,"value":31},{"x":147.1384406464,"y":-41.4360003831,"value":51},{"x":147.1384679169,"y":-41.4359950456,"value":96},{"x":147.1384194314,"y":-41.4358419739,"value":22},{"x":147.1385049792,"y":-41.4359574813,"value":44},{"x":147.1384097378,"y":-41.4358598672,"value":82},{"x":147.1384993219,"y":-41.4360352975,"value":84},{"x":147.1383640499,"y":-41.4359839518,"value":81}];


            var valueMin = 70;
            var valueMax = 100;

            // add data to heatmap
            //获取动态数据
			heatMap.setWGS84Data(valueMin, valueMax, getData(300));
            // 动态数据 [{x: -97.6433525165054, y: 45.61443064377248, value: 11.409122369106317}]
            function getData(length) {
                var data = [];
                for (var i = 0; i < length; i++) {
                    var x = Math.random() * (-109 + 80) - 80;
                    var y = Math.random() * (50 - 30) + 30;
                    var value = Math.random() * 100;
                    data.push({x: x, y: y, value: value});
                }
                return data;
            }
            //添加场景切换
            window.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(-94.49779637932467,27.991962497251976, 6692645.195460422),
                orientation: {
                    heading: Cesium.Math.toRadians(1.6274034281916507),
                    pitch: Cesium.Math.toRadians(-80.54782386821914),
                    roll: 0.010774672052431971
                }
            });

            this.heatMap = heatMap;
        }
    });
});