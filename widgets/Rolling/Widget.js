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
            startup: function () {
                // 赣州地图
                var imageryProviderArrUrl = {
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
                };
                // 天地图
                var imageryProviderArrOneWeb1 = {
                    "label": "天地图影像",
                    "type": "wmts",
                    "url": "http://t0.tianditu.gov.cn/img_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                    "layer": "img",
                    "style": "default",
                    "format": "tiles",
                    "tileMatrixSetID": "w",
                    "maximumLevel": 17
                };
                var imageryProviderArrOneWeb2 = {
                    "label": "天地图影像标注",
                    "type": "wmts",
                    "url": "http://t0.tianditu.gov.cn/cia_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                    "layer": "cia",
                    "style": "default",
                    "format": "tiles",
                    "tileMatrixSetID": "w",
                    "maximumLevel": 17
                }
                var that = this;
                // 点击卷帘关闭面板
                $('.rollinng-table-hezi-xx').click(function () {
                    $('.jimu-widget-Rolling').hide();
                });

                $('#hezi-selectOne').on('click', function () {
                    console.log($('#hezi-selectOne').val());
                });

                $('#hezi-selectTwo').on('click', function () {
                    console.log($('#hezi-selectTwo').val());
                });


                var layers = viewer.imageryLayers;//imageryLayers获取将在地球上渲染的图像图层的集合   UrlTemplateImageryProvider    WebMapTileServiceImageryProvider
                var earthAtNight = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    "label": "天地图影像",
                    "type": "wmts",
                    "url": "http://t0.tianditu.gov.cn/img_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                    "layer": "img",
                    "style": "default",
                    "format": "tiles",
                    "tileMatrixSetID": "w",
                    "maximumLevel": 17
                }));//addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中

                var zj = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    "label": "天地图影像标注",
                    "type": "wmts",
                    "url": "http://t0.tianditu.gov.cn/cia_w/wmts?tk=e9533f5acb2ac470b07f406a4d24b4f0",
                    "layer": "cia",
                    "style": "default",
                    "format": "tiles",
                    "tileMatrixSetID": "w",
                    "maximumLevel": 17
                }));//addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中




                earthAtNight.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the slider.只显示在滑块的左侧
                // zj.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the slider.只显示在滑块的左侧

                // Sync the position of the slider with the split position 将滑块的位置与拆分位置同步
                var slider = document.getElementById('slider');
                viewer.scene.imagerySplitPosition = ((slider.offsetLeft) / slider.parentElement.offsetWidth);

                var handler = new Cesium.ScreenSpaceEventHandler(slider);

                var moveActive = false;
                function move(movement) {
                    if (!moveActive) {
                        return;
                    }
                    var relativeOffset = movement.endPosition.x;
                    var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                    slider.style.left = 100.0 * splitPosition + '%';
                    viewer.scene.imagerySplitPosition = splitPosition;
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