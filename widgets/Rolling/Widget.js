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
            flag: false,
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
            earthAtNightLeft: '',
            earthAtNightRight: '',
            zjLeft: '',
            zjRight: '',
            startup: function () {
                topic.subscribe("openRolling", lang.hitch(this, this.openRolling));
                var that = this;
                // 点击卷帘关闭面板
                $('.rollinng-table-hezi-xx').click(function () {
                    that.map.imageryLayers.remove(that.earthAtNightLeft);
                    that.map.imageryLayers.remove(that.earthAtNightRight);
                    that.map.imageryLayers.remove(that.zjLeft);
                    that.map.imageryLayers.remove(that.zjRight);
                    $('.jimu-widget-Rolling').hide();
                    $('#hezi-selectLeft').val(2);
                    $('#hezi-selectRight').val(1);
                });

                // 加载左边图层
                $('#hezi-selectLeft').on('change', function () {
                    // 将滑块的位置与拆分位置同步
                    var slider = document.getElementById('slider');
                    that.map.scene.imagerySplitPosition = (slider.offsetLeft - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                    if ($(this).val() == 2) {
                        // loadMap(that.earthAtNightLeft, that.zjLeft);
                        loadMapLeft()
                        that.earthAtNightLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                        that.zjLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                    } else {
                        viewer.imageryLayers.remove(that.earthAtNightLeft);
                        viewer.imageryLayers.remove(that.zjLeft);
                    }
                });

                // 加载右边图层
                $('#hezi-selectRight').on('change', function () {
                    // 将滑块的位置与拆分位置同步
                    var slider = document.getElementById('slider');
                    that.map.scene.imagerySplitPosition = (slider.offsetLeft - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                    if ($(this).val() == 2) {
                        // loadMap(that.earthAtNightRight, that.zjRight);
                        loadMapRight();
                        that.earthAtNightRight.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
                        that.zjRight.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
                    } else {
                        viewer.imageryLayers.remove(that.earthAtNightRight);
                        viewer.imageryLayers.remove(that.zjRight);
                    }
                });

                // 加载图层方法
                // function loadMap(mapLeft, mapRight) {
                //     //imageryLayers获取将在地球上渲染的图像图层的集合
                //     var layers = viewer.imageryLayers;
                //     //addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中
                //     console.log(layers)
                //     mapLeft = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                //         that.imageryProviderAdd[0]
                //     ));
                //     console.log(mapLeft)
                //     mapRight = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                //         that.imageryProviderAdd[1]
                //     ));
                // }

                // 加载左边图层方法
                function loadMapLeft() {
                    //imageryLayers获取将在地球上渲染的图像图层的集合
                    var layers = viewer.imageryLayers;
                    //addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中
                    that.earthAtNightLeft = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[0]
                    ));
                    that.zjLeft = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[1]
                    ));
                }

                // 加载右边图层方法
                function loadMapRight() {
                    //imageryLayers获取将在地球上渲染的图像图层的集合
                    var layers = viewer.imageryLayers;
                    //addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中
                    that.earthAtNightRight = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[0]
                    ));
                    that.zjRight = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
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
                    // 将滑块的位置与拆分位置同步
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

            openRolling: function (item) {
                if (item == this.name) {
                    this.flag = true;
                    this.onOpen()
                }
            },

            onOpen: function () {
                var that = this;
                if (this.flag != true) return;
                var slider = document.getElementById('slider');
                that.map.scene.imagerySplitPosition = (slider.offsetLeft - slider.parentElement.offsetWidth) / (slider.parentElement.offsetWidth);
                loadMapLeft();
                that.earthAtNightLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;
                that.zjLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT;

                function loadMapLeft() {
                    //imageryLayers获取将在地球上渲染的图像图层的集合
                    var layers = that.map.imageryLayers;
                    //addImageryProvider使用给定的ImageryProvider创建一个新层，并将其添加到集合中
                    that.earthAtNightLeft = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[0]
                    ));
                    that.zjLeft = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(
                        that.imageryProviderAdd[1]
                    ));
                }
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