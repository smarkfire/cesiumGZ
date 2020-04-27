///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:控制地图切换到不同区域
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget',
        'dojo/on',
        'dojo/aspect',
        'dojo/string',
        './ImageNode',
        'jimu/dijit/TileLayoutContainer',
        'jimu/utils',
        'libs/storejs/store'
    ],
    function (declare,
              lang,
              array,
              html,
              BaseWidget,
              on,
              aspect,
              string,
              ImageNode,
              TileLayoutContainer,
              utils,
              store ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-bookmark',
            name: 'Bookmark',
            bookmarks: [],

            currentIndex: -1,

            startup: function () {
                this.inherited(arguments);

                // console.log("jquery获取浏览器版本："+$.support);
                this.bookmarkList = new TileLayoutContainer({
                    strategy: 'fixCols',
                    itemSize: {height: ((110 / 130) * 100) + '%'},
                    maxCols: 2
                }, this.bookmarkListNode);

                this.bookmarkList.startup();

                this.displayBookmarks();
            },

            onOpen: function () {

            },

            onClose: function () {

            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            resize: function () {
                var box = html.getMarginBox(this.domNode);
                var listHeight = box.h - 37;
                html.setStyle(this.bookmarkListNode, 'height', listHeight + 'px');
                if (this.bookmarkList) {
                    this.bookmarkList.resize();
                }
            },

            destroy: function () {
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },

            displayBookmarks: function () {
                var items = [];
                this.bookmarkList.empty();
                array.forEach(this.config.bookmarks, function (bookmark) {
                    items.push(this._createBookMarkNode(bookmark));
                }, this);

                this.bookmarkList.addItems(items);
                this.resize();
            },



            _createBookMarkNode: function (bookmark) {
                var thumbnail, node;

                if (bookmark.thumbnail) {
                    thumbnail = utils.processUrlInWidgetConfig(bookmark.thumbnail, this.folderUrl);
                } else {
                    thumbnail = this.folderUrl + 'images/thumbnail_default.png';
                }

                node = new ImageNode({
                    img: thumbnail,
                    label: bookmark.name
                });
                on(node.domNode, 'click', lang.hitch(this, lang.partial(this._onBookmarkClick, bookmark)));

                return node;
            },


            _onBookmarkClick: function (bookmark) {
                // summary:
                //    set the map extent or camera, depends on it's 2D/3D map
                array.some(this.bookmarks, function (b, i) {
                    if (b.name === bookmark.name) {
                        this.currentIndex = i;
                        return true;
                    }
                }, this);


                var ext = bookmark.extent;

                var west = ext.xmin;
                var south = ext.ymin;
                var east = ext.xmax
                var north = ext.ymax;

                //有动画效果的
                setTimeout(lang.hitch(this, function () {
                    this.map.camera.flyTo({
                        destination: Cesium.Rectangle.fromDegrees(Number(west), Number(south), Number(east), Number(north))
                    });
                }), 100);
            }
        });
    });