define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'jimu/BaseWidget',
],
    function (declare,
        lang,
        array,
        html,
        topic,
        BaseWidget
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-Rolling',
            name: 'Rolling',
            // 天地图
            imageryProviderAdd: [{
                "label": "天地图影像",
                "type": "wmts",
                "url": "http://t0.tianditu.gov.cn/img_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                "layer": "img",
                "style": "default",
                "format": "tiles",
                "tileMatrixSetID": "w",
                "maximumLevel": 17
            }, {
                "label": "天地图影像标注",
                "type": "wmts",
                "url": "http://t0.tianditu.gov.cn/cia_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                "layer": "cia",
                "style": "default",
                "format": "tiles",
                "tileMatrixSetID": "w",
                "maximumLevel": 17
            }],
            // 赣州地图
            imageryProviderArrUrl: {
                "name": "离线影像",
                "tooltip": "赣州市离线影像",
                "iconUrl": "images/basemaps/gzyx.png",
                "layers": [
                    {
                        "label": "赣州市离线影像",
                        "type": "url",
                        "url": "http://www.sw797.com:801/gzsw3D/v2/data/wp/{z}/{x}/{y}.png"
                    }
                ]
            },
            earthAtNight: '',
            zj: '',
            startup: function () {
                var that = this;

                // 点击卷帘关闭面板
                $('.rollinng-table-hezi-xx').click(function () {
                    $('.jimu-widget-Rolling').hide();
                    that.map.imageryLayers.remove(that.earthAtNight);
                    that.map.imageryLayers.remove(that.zj);
                    $('#hezi-selectLeft').val(1);
                    $('#hezi-selectRight').val(1);
                });

                // 加载左边图层
                $('#hezi-selectLeft').on('change', function () {
                    // 将滑块的位置与拆分位置同步
                    var slider = document.getElementById('slider');
                    that.map.scene.imagerySplitPosition = (slider.offsetLeft - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                    if ($(this).val() == 2) {
                        loadMap();
                        that.earthAtNight.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                        that.zj.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    } else {
                        viewer.imageryLayers.remove(that.earthAtNight);
                        viewer.imageryLayers.remove(that.zj);
                    }
                });

                // 加载右边图层
                $('#hezi-selectRight').on('change', function () {
                    // 将滑块的位置与拆分位置同步
                    var slider = document.getElementById('slider');
                    that.map.scene.imagerySplitPosition = (slider.offsetLeft - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                    if ($(this).val() == 2) {
                        loadMap();
                        that.earthAtNight.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
                        that.zj.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
                    } else {
                        viewer.imageryLayers.remove(that.earthAtNight);
                        viewer.imageryLayers.remove(that.zj);
                    }
                });

                // 加载图层方法
                function loadMap() {
                    //imageryLayers获取将在地球上渲染的图像图层的集合
                    var layers = viewer.imageryLayers;
                    //addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中
                    that.earthAtNight = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[0]
                    ));
                    that.zj = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[1]
                    ));
                }

                var handler = new Cesium.ScreenSpaceEventHandler(slider);

                var moveActive = false;
                function move(movement) {
                    if (!moveActive) {
                        return;
                    }
                    var relativeOffset = movement.endPosition.x;
                    viewer.scene.imagerySplitPosition = (slider.offsetLeft + relativeOffset - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                    slider.style.left = 100.0 * + (slider.offsetLeft + relativeOffset) / (slider.parentElement.offsetWidth) + '%';
                }


                handler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);//左键按下事件
                handler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.PINCH_START);//触摸表面上双指事件的开始

                handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);//鼠标移动事件
                handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);//触摸表面上双指移动事件

                handler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.LEFT_UP);//鼠标左键抬起事件
                handler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.PINCH_END);//触摸表面上的双指事件的结束
            },

            onOpen: function () {

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