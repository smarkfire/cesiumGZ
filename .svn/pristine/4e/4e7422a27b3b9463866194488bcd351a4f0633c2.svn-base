///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:Echarts示例
///////////////////////////////////////////////////////////////////////////

define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget',
        'dojo/on',
        "libs/echarts/v4/echarts.min"
    ],
    function (declare,
              lang,
              array,
              html,
              BaseWidget,
              on,
              echarts ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-EchartDemo',
            name: 'EchartDemo',
            startup: function () {
                this.inherited(arguments);

                this.createEchart();

            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },
            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）

                //同时加载geojson到地图上
                this.loadGeoJson();
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
                this.map.dataSources.removeAll();
            },

            resize: function () {

            },

            destroy: function () {
                this.inherited(arguments);
            },

            loadGeoJson:function(){
                /**
                 * This class is an example of a custom DataSource.  It loads JSON data as
                 * defined by Google's WebGL Globe, https://github.com/dataarts/webgl-globe.
                 * @alias WebGLGlobeDataSource
                 * @constructor
                 *
                 * @param {String} [name] The name of this data source.  If undefined, a name
                 *                        will be derived from the url.
                 *
                 * @example
                 * var dataSource = new Cesium.WebGLGlobeDataSource();
                 * dataSource.loadUrl('sample.json');
                 * viewer.dataSources.add(dataSource);
                 */
                function WebGLGlobeDataSource(name) {
                    //All public configuration is defined as ES5 properties
                    //These are just the "private" variables and their defaults.
                    this._name = name;
                    this._changed = new Cesium.Event();
                    this._error = new Cesium.Event();
                    this._isLoading = false;
                    this._loading = new Cesium.Event();
                    this._entityCollection = new Cesium.EntityCollection();
                    this._seriesNames = [];
                    this._seriesToDisplay = undefined;
                    this._heightScale = 10000000;
                    this._entityCluster = new Cesium.EntityCluster();
                }

                Object.defineProperties(WebGLGlobeDataSource.prototype, {
                    //The below properties must be implemented by all DataSource instances

                    /**
                     * Gets a human-readable name for this instance.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {String}
                     */
                    name : {
                        get : function() {
                            return this._name;
                        }
                    },
                    /**
                     * Since WebGL Globe JSON is not time-dynamic, this property is always undefined.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {DataSourceClock}
                     */
                    clock : {
                        value : undefined,
                        writable : false
                    },
                    /**
                     * Gets the collection of Entity instances.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {EntityCollection}
                     */
                    entities : {
                        get : function() {
                            return this._entityCollection;
                        }
                    },
                    /**
                     * Gets a value indicating if the data source is currently loading data.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Boolean}
                     */
                    isLoading : {
                        get : function() {
                            return this._isLoading;
                        }
                    },
                    /**
                     * Gets an event that will be raised when the underlying data changes.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Event}
                     */
                    changedEvent : {
                        get : function() {
                            return this._changed;
                        }
                    },
                    /**
                     * Gets an event that will be raised if an error is encountered during
                     * processing.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Event}
                     */
                    errorEvent : {
                        get : function() {
                            return this._error;
                        }
                    },
                    /**
                     * Gets an event that will be raised when the data source either starts or
                     * stops loading.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Event}
                     */
                    loadingEvent : {
                        get : function() {
                            return this._loading;
                        }
                    },

                    //These properties are specific to this DataSource.

                    /**
                     * Gets the array of series names.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {String[]}
                     */
                    seriesNames : {
                        get : function() {
                            return this._seriesNames;
                        }
                    },
                    /**
                     * Gets or sets the name of the series to display.  WebGL JSON is designed
                     * so that only one series is viewed at a time.  Valid values are defined
                     * in the seriesNames property.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {String}
                     */
                    seriesToDisplay : {
                        get : function() {
                            return this._seriesToDisplay;
                        },
                        set : function(value) {
                            this._seriesToDisplay = value;

                            //Iterate over all entities and set their show property
                            //to true only if they are part of the current series.
                            var collection = this._entityCollection;
                            var entities = collection.values;
                            collection.suspendEvents();
                            for (var i = 0; i < entities.length; i++) {
                                var entity = entities[i];
                                entity.show = value === entity.seriesName;
                            }
                            collection.resumeEvents();
                        }
                    },
                    /**
                     * Gets or sets the scale factor applied to the height of each line.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Number}
                     */
                    heightScale : {
                        get : function() {
                            return this._heightScale;
                        },
                        set : function(value) {
                            if (value > 0) {
                                throw new Cesium.DeveloperError('value must be greater than 0');
                            }
                            this._heightScale = value;
                        }
                    },
                    /**
                     * Gets whether or not this data source should be displayed.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {Boolean}
                     */
                    show : {
                        get : function() {
                            return this._entityCollection;
                        },
                        set : function(value) {
                            this._entityCollection = value;
                        }
                    },
                    /**
                     * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
                     * @memberof WebGLGlobeDataSource.prototype
                     * @type {EntityCluster}
                     */
                    clustering : {
                        get : function() {
                            return this._entityCluster;
                        },
                        set : function(value) {
                            if (!Cesium.defined(value)) {
                                throw new Cesium.DeveloperError('value must be defined.');
                            }
                            this._entityCluster = value;
                        }
                    }
                });

                /**
                 * Asynchronously loads the GeoJSON at the provided url, replacing any existing data.
                 * @param {Object} url The url to be processed.
                 * @returns {Promise} a promise that will resolve when the GeoJSON is loaded.
                 */
                WebGLGlobeDataSource.prototype.loadUrl = function(url) {
                    if (!Cesium.defined(url)) {
                        throw new Cesium.DeveloperError('url is required.');
                    }

                    //Create a name based on the url
                    var name = Cesium.getFilenameFromUri(url);

                    //Set the name if it is different than the current name.
                    if (this._name !== name) {
                        this._name = name;
                        this._changed.raiseEvent(this);
                    }

                    //Use 'when' to load the URL into a json object
                    //and then process is with the `load` function.
                    var that = this;
                    return Cesium.Resource.fetchJson(url).then(function(json) {
                        return that.load(json, url);
                    }).otherwise(function(error) {
                        //Otherwise will catch any errors or exceptions that occur
                        //during the promise processing. When this happens,
                        //we raise the error event and reject the promise.
                        this._setLoading(false);
                        that._error.raiseEvent(that, error);
                        return Cesium.when.reject(error);
                    });
                };

                /**
                 * Loads the provided data, replacing any existing data.
                 * @param {Array} data The object to be processed.
                 */
                WebGLGlobeDataSource.prototype.load = function(data) {
                    //>>includeStart('debug', pragmas.debug);
                    if (!Cesium.defined(data)) {
                        throw new Cesium.DeveloperError('data is required.');
                    }
                    //>>includeEnd('debug');

                    //Clear out any data that might already exist.
                    this._setLoading(true);
                    this._seriesNames.length = 0;
                    this._seriesToDisplay = undefined;

                    var heightScale = this.heightScale;
                    var entities = this._entityCollection;

                    //It's a good idea to suspend events when making changes to a
                    //large amount of entities.  This will cause events to be batched up
                    //into the minimal amount of function calls and all take place at the
                    //end of processing (when resumeEvents is called).
                    entities.suspendEvents();
                    entities.removeAll();

                    //WebGL Globe JSON is an array of series, where each series itself is an
                    //array of two items, the first containing the series name and the second
                    //being an array of repeating latitude, longitude, height values.
                    //
                    //Here's a more visual example.
                    //[["series1",[latitude, longitude, height, ... ]
                    // ["series2",[latitude, longitude, height, ... ]]

                    // Loop over each series
                    for (var x = 0; x < data.length; x++) {
                        var series = data[x];
                        var seriesName = series[0];
                        var coordinates = series[1];

                        //Add the name of the series to our list of possible values.
                        this._seriesNames.push(seriesName);

                        //Make the first series the visible one by default
                        var show = x === 0;
                        if (show) {
                            this._seriesToDisplay = seriesName;
                        }

                        //Now loop over each coordinate in the series and create
                        // our entities from the data.
                        for (var i = 0; i < coordinates.length; i += 3) {
                            var latitude = coordinates[i];
                            var longitude = coordinates[i + 1];
                            var height = coordinates[i + 2];

                            //Ignore lines of zero height.
                            if(height === 0) {
                                continue;
                            }

                            var color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5);
                            var surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                            var heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale);

                            //WebGL Globe only contains lines, so that's the only graphics we create.
                            var polyline = new Cesium.PolylineGraphics();
                            polyline.material = new Cesium.ColorMaterialProperty(color);
                            polyline.width = new Cesium.ConstantProperty(2);
                            polyline.followSurface = new Cesium.ConstantProperty(false);
                            polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);

                            //The polyline instance itself needs to be on an entity.
                            var entity = new Cesium.Entity({
                                id : seriesName + ' index ' + i.toString(),
                                show : show,
                                polyline : polyline,
                                seriesName : seriesName //Custom property to indicate series name
                            });

                            //Add the entity to the collection.
                            entities.add(entity);
                        }
                    }

                    //Once all data is processed, call resumeEvents and raise the changed event.
                    entities.resumeEvents();
                    this._changed.raiseEvent(this);
                    this._setLoading(false);
                };

                WebGLGlobeDataSource.prototype._setLoading = function(isLoading) {
                    if (this._isLoading !== isLoading) {
                        this._isLoading = isLoading;
                        this._loading.raiseEvent(this, isLoading);
                    }
                };

                var dataSource = new WebGLGlobeDataSource();
                dataSource.loadUrl(this.folderUrl+  '/population909500.json').then(function() {
                    function createSeriesSetter(seriesName) {
                        return function() {
                            dataSource.seriesToDisplay = seriesName;
                        };
                    }
                });

                this.map.dataSources.add(dataSource);


            },

            createEchart:function(){
                var img = {
                    "0":'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5OUVEQTc5QjBFRjExRThBMUI1RkUwNTZEMjNDOUIzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5OUVEQTdBQjBFRjExRThBMUI1RkUwNTZEMjNDOUIzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTk5RURBNzdCMEVGMTFFOEExQjVGRTA1NkQyM0M5QjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTk5RURBNzhCMEVGMTFFOEExQjVGRTA1NkQyM0M5QjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mgjFpAAAKp0lEQVR42uRb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',
                    '1':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlEOEQxQTcxQjBFRjExRTg5QzQzQTEyRDFBRjM2QzQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlEOEQxQTcyQjBFRjExRTg5QzQzQTEyRDFBRjM2QzQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUQ4RDFBNkZCMEVGMTFFODlDNDNBMTJEMUFGMzZDNDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUQ4RDFBNzBCMEVGMTFFODlDNDNBMTJEMUFGMzZDNDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7B46LbAAAK2ElEQVR42uRb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',
                    '2':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEwOEYyQUE0QjBFRjExRTg5OEIyRjM5OTc2ODU4MDJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEwOEYyQUE1QjBFRjExRTg5OEIyRjM5OTc2ODU4MDJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTA4RjJBQTJCMEVGMTFFODk4QjJGMzk5NzY4NTgwMkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTA4RjJBQTNCMEVGMTFFODk4QjJGMzk5NzY4NTgwMkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74lPHTAAALIklEQVR42uRb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',
                    '3':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE0M0E4N0M5QjBFRjExRTg4MTFCRTk4MzM1OEI3RTk2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE0M0E4N0NBQjBFRjExRTg4MTFCRTk4MzM1OEI3RTk2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTQzQTg3QzdCMEVGMTFFODgxMUJFOTgzMzU4QjdFOTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTQzQTg3QzhCMEVGMTFFODgxMUJFOTgzMzU4QjdFOTYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4uP4qxAAAMDElEQVR42uRb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',
                    '4':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFERDBFNkVBQjBFRjExRThCMjIwQkVCMkVBODE5MUQ2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFERDBFNkVCQjBFRjExRThCMjIwQkVCMkVBODE5MUQ2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUREMEU2RThCMEVGMTFFOEIyMjBCRUIyRUE4MTkxRDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUREMEU2RTlCMEVGMTFFOEIyMjBCRUIyRUE4MTkxRDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5uNGM9AAALf0lEQVR42uRb249VVxnfa619OZeZYWAKbSnKJUWmlNZyG6ZAJGpNDCbGBw364h9gfDAxvvtH+KJPvvnSxJimMTSaGrDACKVELEgLreNQLrYwh2HmnH1ba/ntM3sPH9+stfc+B5Qm3cnKvpx9Wb/vflmHfb9z1fkibtz5gm7u/+i9bIB7dI179ecVOCu5xgYgiDYca8Nz+kkDZxagda7bgGsLESgh9JMCbgLEyHAqjilny461BbT+fwGn3OSGY04IwCs4T4EqAlblvykDaDYMAdxHAGwCVhxzdI0bCGHjOAao0LViMAthBiaAO6RYmwALApqjazYCUHGmgCUBXlxjFvC19d8dUqwpGIH2wnDODZJARd0EEA8KmhEi4fNK7ruPwGVOwLmGY9dACE5EXhMOY5BpPiQ65+icEoHX5b47BGhu4K5rGR4Bj7mPNxOXEwS8GCK/XrwjRaAdtHeqXJ87BGhBhodAmkbxGwVPgZtAJ/mI871AgJN8XilRHVUn2KkS9TLQFKxPhof2HpICQfRcG0Qbg03y5+N8cINnkAZClnLdHRJ0AQQDDdDIzhv5fQEBX7wDA8c6nCCQ2YiIxHCDnTBtCmGpFHVmEXcM3iWggxxkMeg5lQKXiXSdCJa+Aa9OZNh+WyuxgMQbA85GmA9MMGaJ/U2GjZm47lZw2wbaQ1wtRhNGCx03CTF8h+kmAN7PvWhv/g7Hbd97USX+ORm1zzqahTnoEIH2ibRQd6hLBrNxvcy4cYvL8ohoZ8DaOWg6CgIE3O/tFH5vP4Bv92cro4/gU4IJfzMQ4lXuJrtk3JxRceODHHAvHz4S9TLQTklUN5Q7s3E7QFxuW0aLuclzwOVpxuWG/sxUekfF92ZU0r3Zp67X2siD8VcZc8bhvteACC/LsPWOlt4t+HmJgOaIe9oQ8QlDUMOqOF7lvrBuYz0ugI/kYzQ7B6DrRdCdZm68tf8+rUOV3D8ro3sf4kkAAW6opPd7EazZwb2RPYynG9zWwvdU6l9VUXtGK34HiTkjyYotrKXBDA2YKq06Be8hS431upWDHgNRHhd+N9Pjr8Jxdq9SafcfMuxcAPmOLWm4klHnsorvf8Qba/dyt7mDu/F2LpItKmm8K6PmeZgOM4S30hLa0rjeqWPV64DGol5we5T74Uugx0ccpkaX9Tiek9H8Gdgv1MmENCi+7H12SongkmiMH2Dc3wS2YZp50aSKmieACBeJ20uQN5Boj+2TGlTHbeB9wvEm6PEWEOujIKabcwAdFWV6vHR9mCIB4O+kS7ePc390s/BHp/r631j6LkjRLhm13gT9p6ALQrgotJUIg6pyZ8xg1W1RWh88cGQvgP5R/16tY5Usngc9vpyJr6W0lCJRxN9xqViC6M/C++aEP/4i99u7wf9vA/3/Cbi+34L1P5+7vBjNKzFkg0Zxt7mzsgzMQ66syZhal92jVXILxPTPYLVD+sJfjE0dY6Dw2LiwjLGOTudVePtkeP3cB+ndefRuLP+g//MXwTBeE83132LcfQq+OYGkLsoZERuyQVMprFLUeQXXAxSOAnvSeRPobOot5o3YxLotvIkfticn/xLO/eFENHctl4QGnSi8uwukugfTeIrYGpoHmIofcpDszLEUGYjIs6pixgoxgKsn52V4iwHL4CPsOTG6baMY2QfSwL/W+NLRi8mnvwIJ6OW3N+1GsP/NgMzFVPRgdQoRzKLrZSJffNC2Jbko9rerSefS2fjmP5HbOfHj9q77W901XxcOC6b8Z7cdDz++RL5hmzcF7RpAM1syw2tkZqwifHUrgCcrH2OMZl7xdXn/cvH7GPdbJB0tY5hbo8LDbNLs1uyIsIrami0tlFi/+MPVFM0hKHnBm5gqfgcf+CkpN2nLnLihssNq1PVr+3HH8CJeU49WAd/tP30EgO4Cne771bW88XybeVlI68RguM7ENy6iUlLxvFthfOm86vTtalVZWY3aelk7aCVoWM9bu003Skd1/xTO/ua+isPcqClbxFWzNcUeFbhT0q7RFSXcVR9fUPG11JEQvjKd/8juqnD27XD2xGeqF4MEjGpHN+CFzWwPhCgrkFd9fyjgukYDT1dwhdGK6pn4kzdORzfeR1a9L6KbxOjEz0b3/RKI8C8Fqq+0dl3G22AD/F8vXnirYn62MRBwXfIRW8HfBh4bnuJFAn1zpTlxONh0+FraOfV698pJnOr+dHTPsc3u2PhsutApsR90XmWd1lKOl3UqKejUFBWhzcO+WGst8miryJWdgAkPwB2CwGX2WGvy28BxF4aXDeC4mPY3TgLwMwbgqSEd1Ya9kbF1RN0EFqeFVcD9B0ZMF0XHolLi7PWfmRQOb4ClDya9iW8+mIBWIAUfbvfW7ci0hLw3JZkZJoCt3WwNYLSlX20Cjgr9Oi0BznPRzdnUB97EBYzMiKWOikC/5x9mqVa35dIdi4XG1Vicj9OKjFWFqziuLHXvBJWA8wiL8So7AmCCHPCKbbiU3LlzJPhysN1duw8s+yc6i2v0MthDwaaDs+m9a5RRjOkYpaQ0L1cV4l4JvILTefmXLQNnbuMrbnM9gxTy3X4mhbauThazfaSll1dsCpF07qmI35SLc7Ej5e+WLs/g534+tv8HV9POHKSiLdFYN8VEsJXkAJEBOOa81coztM6NlZSaAiSibVRUHINE6xnRWPoOc+P9y8/rWMVLF2TceT/LpWvEB/Zgg3EhgvGXuNd6GU6yuaQq9Wdk2P4jCMZ/MrrBuA9jMa/IFiXpCKlCajCApVZdkZ5WUdqJUfIfas3vpr3RN5hIL2blYdhv4f7IFPeakzJe+JuKF2frBjgPGYd+2WlsGsCPLJej3I9l1D4O+7ksrEcAqchLIu613JnJfZn6WqtawjChf6fdNa9zL9zJg94hxpw1Ilj7Gvfa12XYmcnqaLWWXriNCeDyAca9Z5cLEGJexc2/qiS4kgV/OXe7OfDQYOBkHfB1dJxyXVgGX66TNy7BJK+LoPcKEGF3Vil1Wxs2qrR3RYbz52wlZtDjBgDew9zm5HIdnsXwrvdk1HovF+diLBHgNo7Lup0UbfHhEpVvkhLQqMPBUpjwDEz8Ks96ZW78PHebL/B2Y2tejLyyUoxkoMhZMdFrvwLHfr8OD9yF58+CHndyoItk30PNRAzc5M+NoWwdd4Y5ztCKBLr4h/a5E614JHujbymR/B0M4GHG5dOguweZ19qpos6prHfGgzUHGBPjuR7fAMCn8/ZRYai6OdgldNwlRswUzKhBe2ea9KcUChFNJSnH0uAvXE4IQLrp0vh17oc7hN87uFwnnzj6IJTlHRU138kk5CFX+QB8D4G1iXlq4fbAAQxeVCMt/TX6DDWCAe6Rq7hxDsQ4s/7T3Iunc7E+vSzWLCIxAu6N42HT7dRg1NSgSYpDFtU4ZWWcklUN/qoet2auDEfeVHEKmRhTYLUXkUSltCaHQEYEsE23ZUmmVurOWEnMLmt4AAzAJ+tgVoyhVm7HsOIJP5sYiBCRc7oqqsyF1XZnVauITD4fZ26epQQsiH1QRE0kaQgmhsVAtjBVWRYHDGzcTCKvK1LX1LDSybUs3nFqpL6poTmY1sjHhzZuzGDkHMtSDJO4Js7q1Y3C4A0cQxYoSevXdEzT0Nqgq4qNpvVhinCKGyI8kU/ONRT6TUu1aNUEg0ktzf8q0a4sRFZVWSl4jaI4bony8OpD2wJe2zItaRF925IPutS7dvV10PKyQ0SfBjoc7aUhwqsCTjmvLetbysLRx7pe3RTR0RVFGLQNbJ2/ZijDAh/T9UqX9biA0+CGEoCuIlSkvcNK8nBtMHR16ucDAx4WuI0AjrN6WRUzuMOypZiOY/8zTtm1obZH/fuVLon8WEUHtk4jwynp5jzS9rj+cGeTAKcGeF2DoI8N8OMGPszE9GN6z+cC+BMDMuj2XwEGAIOo0PLFGi6uAAAAAElFTkSuQmCC',
                    '5':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIxQ0MwM0UwQjBFRjExRTg4RjZFRDE0RDM5MEMxREY2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIxQ0MwM0UxQjBFRjExRTg4RjZFRDE0RDM5MEMxREY2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjFDQzAzREVCMEVGMTFFODhGNkVEMTREMzkwQzFERjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjFDQzAzREZCMEVGMTFFODhGNkVEMTREMzkwQzFERjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73jhHbAAAMBUlEQVR42uRbWYwcRxnuqq7unmPXXtusYzsmXoeAHduJYzteHwnhSjjygHjgAR54QOKJN+ABRbKQQCAhECjiBSGFS0II8oAVcqAk4khCEjZ2bCdOYhw7p621TRzv7M7OTF9VxV8z3fHv2qru3rEhkdKrUnX19NTU99/1/7Xki62Tzvvxos779GL/o3nJIt6RFd6V71XgpOAZWQRBpOFeGr4n323gxAK0ynMbcGkhgk4I+W4BNwEiWnNK7nXOFt1LC2j5/wKuc5Ma7qlGAFrCeR2o0MCK7DNhAE2GIQC7DMAmYPk9Rc+ogRA2jmOAAj3LG7EQZtEEYEOKtQmwq4Gm6JmNALo464C5Bjx/RizgK+s/G1KsdTAu6l3DmBokQRd1E0DcdNBEIxIel3KfXQaXqQaOGe6ZgRBUE3mpcRiDTLPG0ZiisU4EWpX7bAjQ1MBdZmmeBh5zH18mLicIeN7c7Hk+R4pAO6h3ylwfGwK0qzUPgTS1/DMdvA7cBDrJWpz1LgKcZOtKNdURVYKdMlEvAq2D9bXmod5DUuBqei4Noo3BJtn346xRg2fgBkIWcp0NCToHgoEGqKlxLXsv0MDnc2DgWIcTBFK1SJMYarATpksgLKWiTizijsEzDXSQgcybPtalgBE3Xe4GnU/C1AkPm3+Xwp1D4o0BqxZmDROMWGJ/k2EjJq6zEm7bQHuIq3mrQ2ug+7pGDN8hsg6Ad1Iv2pHN4bDm7GaR+Ad51DzgSBJmoEME2tekRXeHsqARG9eLjBu1uCxPE20FrJmB1ltOgID6vU2u39sJ4Jv91fLoVfgpl7j+OiDEHsqSLTyuT4m49nIGuJc1H4l6EWinIKobyp3ZuB0gLjctrUFYcjVweTehfGV/ZSJ9W8SzUyLpnulT12usocHYHkKcMXjvdiDCjTxsPCm5dxY+7migKeKeNER8riGoIWUcL3NfWLexHufAR7I2qsYAdNwNursJi9f355MyFEn7AI9mT+BFAAGmRdLb7wZLN1BvZDuh6UrWmPuCSP2TImpOSUHfRmJOtM2KLazVgxk9YCq16jp4D1lqrNeNDPQSEOUx1+8qPd4K9+pdIdLuCzxsHQH5ji3bcMGj1jERt1+ltWU7KKtvoCz+MHWTCZHUnuVR/RAshxjCW24JbfW43qli1auAxqKec3uU+uENoMcfc4gYHehxfIpHM/+Cfq7KTkiC4vPe+aeEG7zk1sZ2EeqvBduwm3jRRhHVHwciHNXcXoK8AUc9tk9isTpuA+9rHK+DHk+AWN8JYrouA9ASkdLjzulhkgSAv5V2zj1M/dF1rj862df/WufzIEVbeNR4EPRfB50TgqHQliMMosydEYNVt0VpffDAkR0A+sv9d6WMRTJ/CPT4mBJfPPFX6zfevM2/arPrEFtml3CAfDg+9+Kve88f7Cty3H4D5jvl+mObqd/cBv7/WtD/r4Pr+w1Y/0OZy4vRuhLDbtAo7jZ3VrQD85ArqxMilqt3pEjOgpj+Fax2qE+4y1uzZqe/eusFEf7nvOieU5SnoLMN4jW7MukIYAQ0upI2Vqr3XkrPT08l09OZ/IP+zxwFw/iKWx+/g1D2AfjNFUjqoowRsWE3aEqFFebVTTsxnesBCkeBPemMCbRaOoBZCzIm97Ufu+fuzoE/xZK3r2PLtqxxR65VPYznf9Y5eN++9uO/Ve/t8FZNLDR/aRcEYjYbYluj7wNMyY9KBQWife5ajFwm8qQsmREyEAjFOhWQ3OZfs3qLN34LcP/NB6KTv1I9jPd81P/gqkHgIqVLqCw2gv3fDLS1mJIepEolhVh0vUjk8x+0XUrnItI3Lv3polv9tTsBlQDu//ih8JVD0P9EjeH59kxs1Q+J7LtFCRQdNDOAJrbNDK2wMyMl4SsrAZ5QZbcGVxw7vA0Tkg+xZcr3x9eysYYaK3Ef6ClRf1WAswoZHmKTZlaxIkJKcmu2bWEWVJBcdJN7e8fu//bInlu+0dz5/TkRvb6EBhOK4/eG/34oc0UOufhdaVkTNWR2SIW8fiXjZsrEOBUShwuAk4v+U7zJ5y78vvfi90KZvgURz1rV/677wg9O8bkZlFDA4WiZ8dXXVaVuVynLSirk1ovKQQuqHk/Gp18/HJ/dt9W7avVzyblz3QGjvfxzMphSDFHJqVy0rJJXlxWKeouqmH6rOfkl0PHPqne+4myRJ9OZR37aeWb/kAXGoUpItCK3pOUzUcKRvvhJJI63BxPXA+jPzYrolUej1+9WPfjyz3wqWLcxX490ZKEPLkk+yCrEoBUykrIk4W8D7xryawyiuI8rY3ZX+x8/3B8efwH6H6nxLu/q23LXKC+tzJQYzgXrKqq0FnK8qFKpg04LDFCut55UEWo2BmMWKvcFbkwlJvz17ti4GsPz3uB9mUsLK0kkpobtqDT0RsayCqJkAou3hWXAfXERePDH3rG/3TW6d+83m5PfbUHUtpTWrlFh3R96xx7LojEVt7tZOGq7Um1nhglgKzdbOS4t9WoTcJTol2mJKtVkH0h/2vpp0U5/2X3u5x2ZzIAPvxo2KTP3dI/8Ylq0ebbpUG+6JcYNZ2PxflzPyFhVuIzjwpL3TlAKOIuwrNtN9hqfvbCBraBfa2z99NHkrRMqMtvfe/kvuRH0HXd00luz7AZv/Dr4jL7GW+eLbBIhMkZbUn1fLkrEvRR4Caez9C8ZACes9hFWHyewhXy2v5NC15/DEydu9lZt2u6t2qVakbWFbev5B8KTxy9xD5Q13NrySeIG6/EeABFeF3uhiX0px6sYs0uAi6j+DOyPxwmLd/bBs1UTIu4c4XHrRbWXzif+TvuJ+1bTkQZsRftpqWvcJcvvCNbvfTR67SkVzaln03y+fUbMdxFi1w3GbqBe40YYKHuRitSf4nHtCMq9R5q9SRFoYfP3rIL74lpqJ0ab/1BKeiHtjd5P3PSoSg9DP0H9kUnq1TfyeO4ZEc+/kU+sQOXAzvDO/CeCdZNT8Zk3Qb87C2S6n3ZashvAjwzSUaAxUfNh6E/BsJXl3CODyHNN3I0cJ+hkI6mQR69pufTRrC3JG/XCTTTo3QJSsHSQQIhP87A1pfJolY5esNoK4PIuQr3Vg++7MyKu/1MkgRJ/lbSczfo2tPks997NCBFaCME1QlTScZ3rrqXRQZ689hIs8rQb9G4CImxTmVLWWLlGpL3jPJw5aEsxgx7XAPB2wuobB3l4EsNch3nUOJyBzFsVoMLg2qw6Li0+nKOkXVIAGlU4SAoLnoKFn6SqVsbi6yirX0+btfVZMvL4O8lIAoqskole8ya49/t5eOAufP8AuP9WBnRe63uomIiBm/y5MZSt4s4wxwk6kaAf/tHr3IkUNOK90UeEmzzv1jq3EsqvAt3dS7zGJhG1nlK1Mxos3UWIO5bp8TQAfjorH+W1s24GtoPuu0jHY0swIxZbO5NafUqgENGUknIsBf7c5YQApJt2xk5TP9zg+r29gzz5ijsv5tBoC7zDk0pCLnGVF8H3EFibmKcWbi86gMGHarilvqZ/R3d5Aa6Ri7h2EMRYWf/d1It3Z2L99ECsSaS5Slwbx82m26nBoouqfhxThxh2XrbEg+1Ug7+gxi0J4+HIgyJOn4CpBFjteSRRqXYaItb8NQZs021esFMrDGBIQczOK3gADMDXzsG8YwylYC3DiSf83cRAhEgb66eiivy3rCrqZaeITFEe3rl5lhSwq9kHoakJ1wqCieEwkC1MFZbDAYs2biaRlyVb19Rw0olZDu84Fba+qaE4mFbYjw9t3IjByDmWoxjCcmTLtaSBTefcpAYkdRaebjS5rEWDLks2ms6HCY1T1BDhudnimCHRbzqqpWdNMJjUUvwvE+3SRGRZllUHL1EURy1RHj59aDvAazumxS2ibzvyoR/1rpx9XWx62dFEXw90KOq5IcIrA65zXlrOtxSFo1f0vLopotNPFGHQNrBV/jVDGA74mJ6XuqwrBVwPbnQC6KcIhVbeIQWFAmkwdFXy54sGPCxwGwEcZ+GxKmJwh0VHMR3H/s84Rc+Gui73369kQeRHSiqwVQoZTkE157KuK/UPdzYJcCqAlxUIesUAX2ngwyxMXqF53hPA3zUgi73+K8AAo1sUzurcCE8AAAAASUVORK5CYII=',
                    '6':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI3MzY2MkU1QjBFRjExRTg5RUIzODk2RjI1MkU0NTEyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI3MzY2MkU2QjBFRjExRTg5RUIzODk2RjI1MkU0NTEyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjczNjYyRTNCMEVGMTFFODlFQjM4OTZGMjUyRTQ1MTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjczNjYyRTRCMEVGMTFFODlFQjM4OTZGMjUyRTQ1MTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5wMgqvAAAMe0lEQVR42uRb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',
                    '7':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJCRTE3MzE4QjBFRjExRTg5MUZFRjgzQzA4QUYyNjRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJCRTE3MzE5QjBFRjExRTg5MUZFRjgzQzA4QUYyNjRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkJFMTczMTZCMEVGMTFFODkxRkVGODNDMDhBRjI2NEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkJFMTczMTdCMEVGMTFFODkxRkVGODNDMDhBRjI2NEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz574CPZAAAKnUlEQVR42sxb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',
                    '8':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA/CAYAAAC4nXvhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJGOURBMjNGQjBFRjExRThBMTlGQTg2QTQ2RkQzRjEzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJGOURBMjQwQjBFRjExRThBMTlGQTg2QTQ2RkQzRjEzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkY5REEyM0RCMEVGMTFFOEExOUZBODZBNDZGRDNGMTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkY5REEyM0VCMEVGMTFFOEExOUZBODZBNDZGRDNGMTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7L1XK3AAAK0UlEQVR42sxbW2xcRxk+/8zszXYcJ7ZDEqiS8pCgllRtIpIWaFDbtBUPIKCtegFViLYqBfEAErzxxlPFEwiRCiFupQ9BUKBPXIqUhkaJm4SqaSgJIs2lIhfHyfoW79k9M8M/x2c34/Hc1uuEWhqdOWePZ+f775dZqP/r4eQG/kHgc3mjNsJuMLD3DWHYdQbbKyGkZz35/wIOEc+gC2LILgkBvRCALQNgCMwhUgKk5R6059IBdkkEYMsEWr/CEoGbm5eWqwxIgFxu4LGAYwgQEnUXYHCA19+N5j5bRsCuZxAB3gXWHGDcL5kAbImgexk+3ZQRQxiiLR02wSv+LAK0ObcNYlzBcQ8BUbeBNOegzZOAQXSCZ5Ggbdwmxpw45jYC2DhuA6xfweC4KQFJQPRlt8atvUHi4HRouDjv43YbMNfuhUYA0O6JhSBBC88C3HaBdoGkjmcuricObuug2nPukBrzXZfPX0CMbnTcB5pqgxhzG/dtoi4swLl2JcWVa3sTxtwEH6XjNiseEm0aMVycNzmui7cOXAet74UHXJk3yHEZNxuXwQOaOa6mFOTrlPrJ2vIQ+SrO0/SK+El2VVzSwHMDtBqZoSouQxbN9ZAfd7ksE7RtmEQhhEGtOkIfoRV4HO+r6ktqo/QenpKX5sazPZInTQ14ZnA889gHU2UgFMiwiLjaJ+ZtkCXHvAO8NkLvo33kKwDJqFqUc3lSPacUNiAhnur/YOnT2az4aWOC7yvA0khu26I+sFj3Bc9YBKdjuV3SRocA5UGyuTxInwGabMnZIeREsykOtlrinLovlcj6SoXcBQDrSwPku6xGjqaT/EetaXFSA20DLi2Rm9Tcm5frUJSeXNwFQ0d1LpYso9ye0yqMVFfTp0gJ7lPrSJk0EOwbacr/bRE9UqnQzUiErSgRSgW4aMk/Ifd/wVM5gfcty2gW10wbul0QlkCoQyQd+FI5XNZGCTnbVxthD6H4PoYr9KsvzTJxrNHgbyL4pjdSAqhUq2QbY2Rz/t0ymc0a8peNS9kfpEgaGtimNm8PHgG+Ixk24C7QLk4rwBV1rQ7Tu1k/+RpybV2hx2eRwwfwOtVN0o96P1St0h2EwIfynYrkDOr/7sZl/roG2gRv47wwwMsQcJfL0vW3w+lCj7+B3P5YvlEp62ma6/F7vdTFymWyoVym25GQg/m6XO5PJ8UPC/33gech8KwLV2YlBlrre5HL31P3SpQR7BHk8jtt0RKlW1aJ/s9vlWRoRSKnZujs78dI8+i4JnpElLeM8v7PbU9gcABEfZrMvnyEtP55BY3gaVzvLIK/FYlwB1D4ONqN7bQM30L936/tQ4/uiBHTO2N1CAQvXvC4GeWeKFrr83Nz/FW8NtqL8RVfvp1Xd24FPn4J+PkLkq5Zla385sMkfWM/m/qxcltJNvjc3aKy/RMdU01HhsXQtzfSxt7DdPrnyi4IJORRJMB/ajV6P4r/CErWaLF33e2RiMJIx7WxyLzbloLmwOX8Fd1UckUHrTitQLOZF/9C5v52XEVpSix53wMbeP9jT4jK4bfy9zTQ+h+vfmobNMZOK84XbvAqEmESpyO4/VA+EMr9OwmDjeOJJ1y9Bl7aF1firTiNoE/grSLInBr06p+Pgrh8CkX7HjV8Oq7W8Ow7lAonnjrgokwpiZAA2xctDqdQp4FfGC84vWBAdvFdCYOr1PCWXJVdiAPuE28rvlBaCp7qC3FkWsWup2Yk/cAqw+8WFli20GmTcPtgasaRjkCETvuyTkkiPUtMBXWhL559+bCko2t57f6NWnBRuBzCVTA3Pzz+HK27Iw2LqenBUsvLvhJyEjQezbfHSTp2gA88/qjoe+BOyMbfxS03FWjJ1m4OUZqkBw7gGhe7SJ3fN01DyaZ2vy4qR46iEdsp2E23JEBIm8vAJ07Mu6/hTviMIZoAOV1HX78XiaaivRVdlr+jCUCWAbjsskQds2QMCOmo2/XMcVdXI/aLIBt89pOismMHcvc0yc68M2/VQUi2bhNyelP+kkynITuH3Bfok6GMQc5GDGqeJunWMTb1wluRPTZ5I0RdBto48z64fOsaBZrOvLSHzv317cKXK3fWylZ+57OytHHbPHXOnWCTz/9Ri/2rvLZrCx944hFR/vs50jw2YRElFyOiu6YkUpxiWjoLI6/+L9wB/OIFBH1mcRqruKvEWQ01zwF33sH/OY3BzwW1hkOJpCX5cHVWrR1WEqEv0lP35k4Kq4SDX6jraeu1K5SVIcuHml/7rP1eGf93MoEVA4HCorknlxQERV0GmniLa99g57jKsiRdO1wUFdtr5hmd0mOQU/V5q75G+fmakdtXlQcAcemKS5OMiqxLGp12gAQMRojbHK793wK1UaklBjAjonbvhwtgfeqK+vtRNGwbMDjZp4aaq2f6O4o4rP7911j9+b0O1RSWXFt4iLAII+vCiAmj9q0P3ClsqtUYYAp5WGVSKquijdeOZANf2gW1B1VaOqFCWOTwGpIeHCPpoen5QOXgWG7Iarsuok2o4+erITt1HmOAsQ5aAn3VKubhFG4udFx4ig0usV/oLyMrMGatrV1UrNAyrKqO0GdICR4qPm82m+LNZpMfU7n04kLE7/5RWOpOboweYDg3ZJ1CxG8OkdaJSYCEVip0S6lEbiu+LxVNuWdugv8Mr/Veyk++mht1gC9ZCo2V0gC5uTJEnlNVkvnyUzKF4MdUFaWHstOdCD43cCKT+9O6+EE2K84WYNMuqq0yBnio7tYeZUuVtVxdTe9i/eRZzL1uKgoI7zUa/CDnOYfCgQWDYeSyKjSuKwqNJ1szYnd6hR+y1NlsoDOHDZCumpv0tG31nrStpdMJLxuX+X6o8yPVEfYZVoUnVaW0r4+tzzJxHAlwyFVixveqCHgrAv9I4amnsob81dx49koig+Ls5a7N0PkaCj59p0bF1TYYrcBwdZg+ifr/YFGMbBTFyOPtwAdFmahiIurx7ThXUpPxpnylMcF/jXo8qaWzrhFTWfU2FEIiTxzdUZMAixqIpRWo/yvp14Emt2nl57xKWqmQHQAwVJSPD6eT4oXWtDhlEd/MABsDWjg43gFuy3FJwNj5OqXM0jImyP2dqP9PI2fXL/AtMjmbzeQNg4OWTmkWGCZo7jg0tCCEZY5TQ672axJ5aqlNbVpsLicUiu+rqP/7aqPsUVSDL+bNllS+iHr826JFbIsR9NZQZsxd7aJgEmVy3KfvYDnnQh0HAVynIjpSxPrIMLKaZ3O5tXcdA+EBQnCLBbcZtyTEcRvXTWvPA/GzuXlqMZZJdlX81yJR5nEQ2+kIEdEbS0LJCnMAdh2bEtp5FJNY1BB1vcthsxmubEtYjoUIBzFiuNxVrO47K6aDN/WJaJ9To58FlmK/KYLCkma6YnER4bejKzCmmPvAg8ew6QTo9WSjcBBERAQqTnGP0XHzsDwxCGCeKgaDAL2eZfUVHGyVoK51PAY8GCGs2Yk03zHPrhBL5VV6qj4icR/qlSHL7avChPLx2IPvJnHAQSSexB3UD40kQrS7Kj35wLtEHyzSEftrBVeF1AUwieRy0q1x83HCx31piHy3P8vwESBUPe0K8FLq6rEESGwnEGJaTpENg54A99pQiPnhm+yynSQj5iGCX/emoY2TMvL9mPd6fX7du6UurspIaVkKiGX5fely/qhWRraQZY9rLsvf/wQYAJwqk5trGKtyAAAAAElFTkSuQmCC'
                };
                var array1 = ["花   园","卫生间","树   木","红绿灯","停车场","下水道","供   热","供   电","供   水"];
                var array = array1.reverse();

                var myChart = echarts.init(this.echartNode);
                var option = {
                    backgroundColor:"rgba(2,13,34,1)",
                    tooltip: {
                        show:true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    grid: {
                        top: '2%',
                        bottom: '1%',
                        left:'20%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                show: false,
                                interval: 1,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }

                        }
                    ],
                    yAxis:{
                        type: 'category',
                        data: ['0','1','2','3','4','5','6','7','8'],
                        axisLabel: {
                            color:"rgba(255,255,255,1)",
                            formatter: function (value) {
                                return '{' + value + '| }{value|'+array[value]+'}';
                            },
                            rich: {
                                value: {
                                    align: 'center',
                                    padding:[0,0,0,-5],
                                    fontSize:14
                                },
                                0: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['0']
                                    }
                                },
                                1: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['1']
                                    }
                                },
                                2: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['2']
                                    }
                                },
                                3: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['3']
                                    }
                                },
                                4: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['4']
                                    }
                                },
                                5: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['5']
                                    }
                                },
                                6: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['6']
                                    }
                                },
                                7: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['7']
                                    }
                                },
                                8: {
                                    height: 60,
                                    align: 'center',
                                    backgroundColor: {
                                        image: img['8']
                                    }
                                }
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        zlevel: 99
                    },
                    series: [{
                        type: 'bar',
                        barWidth: '20%',
                        barCategoryGap: '60%',
                        itemStyle: {
                            normal: {
                                barBorderRadius:[10, 10, 10, 10],
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 1, 0,
                                    [
                                        {offset: 0, color: '#048BFE'},
                                        {offset: 1, color: '#00EEF1'}
                                    ]
                                ),
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: '14'
                                    }
                                }
                            }
                        },
                        data: [99,85,74,63,63,61,56,35,23]
                    }]
                };
                option.series[0].data.reverse();

                myChart.setOption(option);

            }


        });
    });