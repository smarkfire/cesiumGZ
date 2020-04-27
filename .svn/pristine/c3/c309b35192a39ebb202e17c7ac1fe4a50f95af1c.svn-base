///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:水位淹没分析
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/html',
	'dojo/topic',
	'jimu/BaseWidget'
],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-SubmergenceAnalysis',
			name: 'SubmergenceAnalysis',
			_waterPrimitive: null,
			_rowData: null,
			_netWorkEntity: null,
			_netWorkEntityId: null,
			startup: function () {
				this.inherited(arguments);
				this.init();
				topic.subscribe("loadWater", lang.hitch(this, this.loadWater));

			},
			init: function (evt) {
				var self = this;

				$('.roaming-tool li').click(function () {
					//流域漫游1-赣江
					if ($(this).index() == 0) {
						topic.publish("autoRoam", "赣江");
					}
					//流域漫游2-章水
					else if ($(this).index() == 1) {
						topic.publish("autoRoam", "章水");
					}
					//手动漫游
					else if ($(this).index() == 2) {
						$('#tz').trigger("click");
					}
					//自动漫游
					else if ($(this).index() == 3) {
						if (self._rowData != null) {
							topic.publish("autoRoam", self._rowData.name);
						}

					}
				});

				//水位文本框回车事件
				$("#mnsw").keypress(function (e) {
					if (e.which == 13) {
						if (self._waterPrimitive) {
							self.map.scene.primitives.remove(self._waterPrimitive);
						}
						if (self._netWorkEntity) {
							self.map.entities.removeById(self._netWorkEntityId);
						}
						self.drawWater(self._rowData.surfaceWater, Number($("#mnsw").val()) + self._rowData.offsetwaterHeight);
						self.netWorkEntity(Number($("#mnsw").val()) + self._rowData.offsetwaterHeight, self._rowData.longitude, self._rowData.latitude, self._netWorkEntityId);
					}
				});
			},
			loadWater: function (evt) {
				if (this._waterPrimitive) {
					this.map.scene.primitives.remove(this._waterPrimitive);
				}
				if (this._netWorkEntity) {
					this.map.entities.removeById(this._netWorkEntityId);
				}
				var self = this;
				self._rowData = evt;
				if (evt != null) {
					if (evt.sitecode == "") {
						$("#mnsw").val(self._rowData.defaultWaterLevel);
						setTimeout(function () {
							self.drawWater(self._rowData.surfaceWater, self._rowData.defaultWaterLevel + self._rowData.offsetwaterHeight);
							self.netWorkEntity(self._rowData.defaultWaterLevel + self._rowData.offsetwaterHeight, self._rowData.longitude, self._rowData.latitude, evt.longitude + 'SWZW');
							self._netWorkEntityId = evt.longitude + 'SWZW';
						}, 2000);
					}
					else {
						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/riverr/rthyinfo?parttype=sw`,
							type: 'post',
							dataType: "json",
							success: function (json) {
								var waterLevel = null;
								json.data.forEach((item, index) => {
									if (item.list && evt.sitecode == item.list.STCD) {
										waterLevel = item.list.Z;
										self.netWorkEntity(item.list.Z + self._rowData.offsetwaterHeight, self._rowData.longitude, self._rowData.latitude, item.list.STCD + 'SWZW');
										self._netWorkEntityId = item.list.STCD + 'SWZW';
									}
								})
								if (waterLevel == "" || waterLevel == null || waterLevel == 0) {
									waterLevel = self._rowData.defaultWaterLevel;
									self.netWorkEntity(waterLevel + self._rowData.offsetwaterHeight, self._rowData.longitude, self._rowData.latitude, self._rowData.sitecode + 'SWZW');
									self._netWorkEntityId = self._rowData.sitecode + 'SWZW';
								}
								$("#mnsw").val(waterLevel);
								self.drawWater(self._rowData.surfaceWater, Number(waterLevel) + self._rowData.offsetwaterHeight);
							},
							error: function (msg) {

							}
						});
					}
				}
			},

			netWorkEntity: function (height, lgt, ltt, id) {
				this._netWorkEntity = this.map.entities.add({
					id: id,
					position: Cesium.Cartesian3.fromDegrees(Number(lgt), Number(ltt), Number(height)),
					label: {
						show: true,
						text: (height - this._rowData.offsetwaterHeight).toFixed(2) + "M", // text 与实体相关的文字
						font: "700 16px '黑体'",
						fillColor: Cesium.Color.fromBytes(255, 255, 255),
						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						outlineWidth: 2,
						outlineColor: Cesium.Color.fromBytes(46, 202, 255), // 文字轮廓的颜色
						verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
						horizontalOrigin: Cesium.HorizontalOrigin.center,//水平位置
						pixelOffset: new Cesium.Cartesian2(0, -12), // 文字位置
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					},
					point: {
						show: true,
						pixelSize: 4,
						color: Cesium.Color.fromBytes(255, 255, 255),
						outlineColor: Cesium.Color.fromBytes(46, 202, 255),
						outlineWidth: 1,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					},
				})
			},

			//绘制水面波浪效果
			drawWater: function (surfaceWater, waterLevel) {

				var importantPoints = [];
				for (var i = 0; i < surfaceWater.length; i++) {
					var longitude = surfaceWater[i][0];
					var latitude = surfaceWater[i][1];
					importantPoints.push(new Cesium.Cartesian3.fromDegrees(longitude, latitude, waterLevel));
				}

				this._waterPrimitive = new Cesium.Primitive({
					show: true, // 默认隐藏
					allowPicking: false,
					geometryInstances: new Cesium.GeometryInstance({
						geometry: new Cesium.PolygonGeometry({
							polygonHierarchy: new Cesium.PolygonHierarchy(importantPoints),
							//extrudedHeight: 0,//注释掉此属性可以只显示水面
							perPositionHeight: true//注释掉此属性水面就贴地了
						})
					}),
					// 可以设置内置的水面shader
					appearance: new Cesium.EllipsoidSurfaceAppearance({
						material: new Cesium.Material({
							fabric: {
								type: 'Water',
								uniforms: {
									//baseWaterColor:new Cesium.Color(0.0, 0.0, 1.0, 0.5),
									//blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
									//specularMap: 'gray.jpg',
									//normalMap: '../assets/waterNormals.jpg',
									normalMap: 'widgets/SubmergenceAnalysis/images/water.jpg',
									frequency: 1000.0,
									animationSpeed: 0.01,
									amplitude: 10.0
								}
							}
						}),
						fragmentShaderSource: 'varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s = v_st.s;\nmaterialInput.st = v_st;\nmaterialInput.str = vec3(v_st, 0.0);\nmaterialInput.normalEC = normalEC;\nmaterialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nczm_material material = czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#else\ngl_FragColor = czm_phong(normalize(positionToEyeEC), material,czm_lightDirectionEC);\gl_FragColor.a=0.7;\n#endif\n}\n' //重写shader，修改水面的透明度
					})
				});

				this.map.scene.primitives.add(this._waterPrimitive);

			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
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