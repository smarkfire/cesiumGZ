///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:模型加载，显示控制
///////////////////////////////////////////////////////////////////////////
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/html',
    "dojo/_base/fx",
    'jimu/BaseWidget'
],function(
    declare,
    lang,
    html,
    fx,
    BaseWidget
){
    //https://github.com/KhronosGroup/OpenCOLLADA/wiki/OpenCOLLADA-Tools
    //https://github.com/KhronosGroup/COLLADA2GLTF


    //http://www.xue51.com/soft/1810.html

    //https://blog.csdn.net/l491453302/article/details/46766909
    //https://blog.csdn.net/umgsoil/article/details/74572877
    //https://blog.csdn.net/HobHunter/article/details/75014054
    //https://blog.csdn.net/umgsoil/article/details/75352698
    //https://blog.csdn.net/y5492853/article/details/77046843?utm_source=blogxgwz0

    //COLLADA2GLTF-bin.exe -i e:\models\shafa3\shafa2.dae -s --doubleSided  新的不好使，动画导不出来
    return declare([BaseWidget], {
        baseClass: 'jimu-widget-ModelAdd',  

        postCreate:function(){ 
            this.inherited(arguments); 
        }, 

        startup:function(){
            this.inherited(arguments); 
        },
        onOpen: function () {
            //面板打开的时候触发 （when open this panel trigger）
            this.entity1?this.entity1.show=true:'';

            this.entity2?this.entity2.show=true:'';
        },

        onClose: function () {
            //面板关闭的时候触发 （when this panel is closed trigger）
            this.entity1?this.entity1.show=false:'';

            this.entity2?this.entity2.show=false:'';
        },
        loadModel:function(){

            if(this.entity1)return;
            //添加模型
            var position = Cesium.Cartesian3.fromDegrees(123.0744619, 44.0503706, 0);
            var heading = Cesium.Math.toRadians(0);
            var pitch = 0;
            var roll = 0;
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            var entity1 = this.map.entities.add({
                name : "shafa",
                position : position,
                orientation : orientation,
                model : {
                    uri : './widgets/ModelAdd/models/shafa/shafa.gltf',
                    // minimumPixelSize : 128,
                    // maximumScale : 20000
                }
            });

            this.map.trackedEntity = entity1;

            this.entity1 = entity1;

        },

        loadAnimateModel:function(){
            if(this.entity2)return;

            //默认地球的动画状态是关闭的需要打开
            this.map.clock.shouldAnimate  = true;

            var origin = Cesium.Cartesian3.fromDegrees(123.0744619, 44.0504706, 0.0);
            var modelMatrix =  Cesium.Transforms.eastNorthUpToFixedFrame(origin);
            this.model =  this.map.scene.primitives.add(Cesium.Model.fromGltf({
                url : './widgets/ModelAdd/models/shafa2/shafa.gltf',
                modelMatrix : modelMatrix,
                show : true,                     // default
                scale : 2.0,                     // double size
                // minimumPixelSize : 128,          // never smaller than 128 pixels
                // maximumScale: 20000,             // never larger than 20000 * model size (overrides minimumPixelSize)
                allowPicking : false            // not pickable
            }));

            this.model.readyPromise.then(function(model) {
                // Play all animations when the model is ready to render
                model.activeAnimations.addAll({
                    speedup : 0.5,
                    loop:Cesium.ModelAnimationLoop.REPEAT
                });
            });

            this.map.trackedEntity = null;

            this.entity2 = this.model;
        },
        pause:function(){
            this.model.activeAnimations.removeAll();
        },
        speedUp:function(){
            this.model.activeAnimations.addAll({
                speedup : 2.5,
                loop:Cesium.ModelAnimationLoop.REPEAT
            });
        }

    });
});