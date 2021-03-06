///////////////////////////////////////////////////////////////////////////
// Copyright © 2020 zhongsong. All Rights Reserved.
// 模块描述:河流水面线分析
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/html',
	'dojo/topic',
	'jimu/BaseWidget',
	'./Tooltip-div',
	'./DynamicDraw'
],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-DynamicRiver',
			name: 'DynamicRiver',
			riverWidth: 200,
			riverHeight: 10,
			speed: 10,
			positions: [],
			sideRes: null,
			riverPrimitive: null,
			material: null,
			drawingPolyline: null,
			// 增加waterData 用来存放列表数据
			waterData: null,
			startup: function () {
				this.inherited(arguments);
				var self = this;

				this.map.scene.globe.depthTestAgainstTerrain = true;
				//取消双击事件
				this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


				// 点击地图上绘制水面线，并且显示水面线详细数据
				$('.water-analysis-content').on('click', '.content-right', function (e) {

					var dataIndex = $(e.target).parent().index();
					var cartesians = [];

					self.map.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(Number(self.waterData[dataIndex].zb[0].jd), Number(self.waterData[dataIndex].zb[0].wd), 5000),
						easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
					});

					$('.dynamicriver-result-sname').text(self.waterData[dataIndex].sname);
					$('.dynamicriver-result-ctime').text(self.waterData[dataIndex].ctime.substring(0, 10));
					$('.dynamicriver-result-ltime').text(self.waterData[dataIndex].ltime.substring(0, 10));

					if (e.target.nodeName == 'SPAN') {
						$('.dynamicriver-result').stop().show();
						$('.dynamicriver-main').stop().hide();
					}


					// $('.jimu-widget-DynamicRiver .dynamicriver-result').fadeIn();
					self.waterData[dataIndex].zb.forEach(function (item, index) {
						cartesians.push(Cesium.Cartesian3.fromDegrees(item.jd, item.wd, item.elevation))
					})
					// self.drawLines(cartesians);
					// DrawDynamicClampGround.startDrawingPolyline(self.map, function (cartesians) {
					if (self.drawingPolyline != undefined)
						self.map.entities.remove(self.drawingPolyline);
					var lineOpts = {
						polyline: {
							positions: cartesians,
							clampToGround: true,
							width: 3,
							color: "#279a9a"
						}
					};
					self.drawingPolyline = self.map.entities.add(lineOpts);
					cartesians.splice(cartesians.length - 1, cartesians.length);
					self.drawLines(cartesians);
					// });

				})


				$('.close-dynamicriver').click(function () {
					$('.jimu-widget-DynamicRiver').stop().hide();
				})

				// 关闭详细信息事件
				$('.close-dynamicriver-result').click(function () {
					$('.dynamicriver-result').stop().hide();
					$('.dynamicriver-main').stop().show();

					self.map.entities.remove(self.drawingPolyline);
					self.map.scene.primitives.remove(self.riverPrimitive);

					self.map.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(115.257787, 25.885506, 549263.35),
						easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
					});
				})




				/*for(var e = [
						[115.907543, 30.441563, 541.47],
						[115.904337, 30.439412, 491.79],
						[115.900612, 30.438483, 449.11],
						[115.896375, 30.439377, 388.29],
						[115.890586, 30.442215, 345.94],
						[115.876946, 30.444641, 292.73]
					], r = [], i = 0; i < e.length; i++) r.push(Cesium.Cartesian3.fromDegrees(e[i][0], e[i][1], e[i][2]));
					
				this.positions = r;	
				
				this.init();*/

			},
			init: function () {
				this.prepareVertex();
				if (this.sideRes) {
					this.material = this.prepareMaterial();
					this.riverPrimitive && this.map.scene.primitives.remove(this.riverPrimitive);
					this.riverPrimitive = this.createPrimitive();
					this.map.scene.primitives.add(this.riverPrimitive);
				}
			},
			prepareVertex: function () {
				if (this.positions.length > 0) {
					this.sideRes = this._lines2Plane(this.positions, this.riverWidth, this.riverHeight);
				}
			},
			setPositions: function (e) {
				this.positions = e;
				this.init();
			},
			resetPos: function () {
				this.sideRes = this._lines2Plane(this.positions, this.riverWidth, this.riverHeight);
				if (this.sideRes) {
					this.material = this.prepareMaterial();
					this.riverPrimitive && this.map.scene.primitives.remove(this.riverPrimitive);
					this.riverPrimitive = this.createPrimitive();
					this.map.scene.primitives.add(this.riverPrimitive);
				}
			},
			drawLines: function (r) {
				this.setPositions(r);
			},
			prepareMaterial: function () {
				var e = new Cesium.Material({
					fabric: {
						uniforms: {
							image: "widgets/DynamicRiver/images/movingRiver.png",
							alpha: 0.5,
							moveVar: new Cesium.Cartesian3(50, 1, 100),
							reflux: -1,
							speed: this.speed,
							move: true,
							flipY: false
						},
						source: "czm_material czm_getMaterial(czm_materialInput materialInput) { \n                        czm_material material = czm_getDefaultMaterial(materialInput); \n                        vec2 st = materialInput.st;\n                        if(move){\n                            float r = sqrt((st.x-0.8)*(st.x-0.8) + (st.y-0.8)*(st.y-0.8));\n                            float r2 = sqrt((st.x-0.2)*(st.x-0.2) + (st.y-0.2)*(st.y-0.2));\n                            float z = cos(moveVar.x*r + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            float z2 = cos(moveVar.x*r2 + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            st += sqrt(z*z+z2*z2);\n                            st.s += reflux * czm_frameNumber/1000.0 * speed;\n                            st.s = mod(st.s,1.0);\n                        }\n                        if(flipY){\n                            st = vec2(st.t,st.s);\n                        }\n                        vec4 colorImage = texture2D(image, st);\n                        material.alpha = alpha;\n                        material.diffuse = colorImage.rgb; \n                        return material; \n                    }"
					}
				});
				return e
			},
			createPrimitive: function () {
				var t = new Float64Array(this.sideRes.vertexs),
					i = new Cesium.GeometryAttributes;
				i.position = new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: 3,
					values: t
				}),
					i.st = new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: this.sideRes.uvs
					});
				var r = new Cesium.Geometry({
					attributes: i,
					indices: this.sideRes.indexs,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: Cesium.BoundingSphere.fromVertices(t)
				}),
					n = new Cesium.GeometryInstance({
						geometry: r
					}),
					o = new Cesium.RenderState;
				return o.depthTest.enabled = !0, new Cesium.Primitive({
					geometryInstances: n,
					appearance: new Cesium.Appearance({
						material: this.material,
						renderState: o,
						vertexShaderSource: "attribute vec3 position3DHigh;\n                attribute vec3 position3DLow;\n                attribute vec2 st;\n                attribute float batchId;\n                \n                varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    vec4 p = czm_computePosition();\n                \n                    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n                    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n                    v_st = st;\n                \n                    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n                }\n                ",
						fragmentShaderSource: "varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    czm_materialInput materialInput;\n                \n                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n                #ifdef FACE_FORWARD\n                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n                #endif\n                \n                    materialInput.s = v_st.s;\n                    materialInput.st = v_st;\n                    materialInput.str = vec3(v_st, 0.0);\n                \n                    // Convert tangent space material normal to eye space\n                    materialInput.normalEC = normalEC;\n                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n                \n                    // Convert view vector to world space\n                    vec3 positionToEyeEC = -v_positionEC;\n                    materialInput.positionToEyeEC = positionToEyeEC;\n                \n                    czm_material material = czm_getMaterial(materialInput);\n                \n                #ifdef FLAT\n                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n                #else\n                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material,czm_lightDirectionEC);\n                #endif\n                }\n                "
					})
				})
			},
			offsetHeight: function (height, time) {
				this.startDH(height, time)
			},
			startDH: function (height, time) {
				if (height && time && this.riverPrimitive) {
					for (var i = this, r = 0, n = height / (20 * time), o = this.sideRes.self, s = new Cesium.Cartesian3, l = 0, u = o.length; l < u; l++) {
						var c = Cesium.Cartesian3.normalize(o[l], new Cesium.Cartesian3);
						Cesium.Cartesian3.add(s, c, s)
					}
					Cesium.Cartesian3.normalize(s, s);
					var h = Cesium.clone(this.riverPrimitive.modelMatrix);
					this.dhEvent = function () {
						if (Math.abs(r) <= Math.abs(height)) {
							var t = Cesium.Cartesian3.multiplyByScalar(s, r, new Cesium.Cartesian3);
							i.riverPrimitive.modelMatrix = Cesium.Matrix4.multiplyByTranslation(h, t, new Cesium.Matrix4)
						} else i.map.clock.onTick.removeEventListener(i.dhEvent);
						r += n
					}, this.map.clock.onTick.addEventListener(this.dhEvent)
				}
			},
			//水面线转成水面
			_lines2Plane: function (positions, width, height) {
				function n(point, height) {
					if (!(point instanceof Cesium.Cartesian3)) return void console.log("请确认点是Cartesian3类型！");
					if (!height || 0 == height) return void console.log("请确认高度是非零数值！");
					var i = Cesium.Cartesian3.normalize(point, new Cesium.Cartesian3),
						r = new Cesium.Ray(point, i);//射线
					return Cesium.Ray.getPoint(r, height)
				}

				function o(point, point1, height) {
					var r = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(point1, point, new Cesium.Cartesian3), new Cesium.Cartesian3),
						n = Cesium.Cartesian3.normalize(point, new Cesium.Cartesian3),
						o = Cesium.Cartesian3.cross(n, r, new Cesium.Cartesian3),
						a = Cesium.Cartesian3.cross(r, n, new Cesium.Cartesian3),
						l = new Cesium.Ray(point, o),
						u = new Cesium.Ray(point, a);
					return {
						left: Cesium.Ray.getPoint(l, height),
						right: Cesium.Ray.getPoint(u, height)
					}
				}

				if (!positions || positions.length <= 1 || !width || 0 == width) return void console.log("请确认参数符合规则：数组长度大于1，宽高不能为0！");
				for (var r = positions.length, a = [], l = [], u = width / 2, c = 0; c < r; c++) {
					var h = void 0,
						d = void 0,
						f = void 0,
						p = void 0,
						m = void 0;
					if (0 == c ? (h = positions[c], d = positions[c], f = positions[c + 1]) : c == r - 1 ? (h = positions[c - 1], d = positions[c], f = positions[c - 1]) : (h = positions[c - 1], d = positions[c], f = positions[c + 1]), 0 != height && (h = n(h, height), d = n(d, height), f = n(f, height)), h && d && f) {
						var g = o(d, f, u);
						if (p = g.left, m = g.right, 0 == c) {
							a.push(p), l.push(m), a.push(p), l.push(m);
							continue
						}
						if (!(c < r - 1)) {
							a.push(m), l.push(p), a.push(m), l.push(p);
							continue
						}
						a.push(p), l.push(m), g = o(d, h, u), p = g.left, m = g.right, a.push(m), l.push(p)
					}
				}

				var v = [],
					y = [];
				if (a.length != 2 * r) return void console.log("计算左右侧点出问题！");
				for (var _ = 0; _ < r; _++) {
					var w = positions[_],
						b = a[2 * _ + 0],
						C = a[2 * _ + 1],
						x = Cesium.Cartesian3.subtract(b, w, new Cesium.Cartesian3),
						P = Cesium.Cartesian3.subtract(C, w, new Cesium.Cartesian3),
						M = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3),
						E = Cesium.Cartesian3.add(w, M, new Cesium.Cartesian3);
					v.push(Cesium.clone(E));
					var T = l[2 * _ + 0],
						S = l[2 * _ + 1];
					x = Cesium.Cartesian3.subtract(T, w, new Cesium.Cartesian3), P = Cesium.Cartesian3.subtract(S, w, new Cesium.Cartesian3), M = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3), E = Cesium.Cartesian3.add(w, M, new Cesium.Cartesian3), y.push(Cesium.clone(E))
				}

				for (var O = [], D = [], k = [], A = [], R = [], F = 0; F < r; F++) {
					var L = Cesium.EncodedCartesian3.fromCartesian(y[F]);
					D.push(y[F].x), D.push(y[F].y), D.push(y[F].z), k.push(L.high.x), k.push(L.high.y), k.push(L.high.z), A.push(L.low.x), A.push(L.low.y), A.push(L.low.z), O.push(1, 1), F < r - 1 && (R.push(F + 2 * r), R.push(F + 1), R.push(F + 1 + r), R.push(F + 2 * r), R.push(F + 1 + r), R.push(r + F + 2 * r))
				}

				for (var I = 0; I < r; I++) {
					var N = Cesium.EncodedCartesian3.fromCartesian(v[I]);
					D.push(v[I].x), D.push(v[I].y), D.push(v[I].z), k.push(N.high.x), k.push(N.high.y), k.push(N.high.z), A.push(N.low.x), A.push(N.low.y), A.push(N.low.z), O.push(1, 0)
				}

				for (var V = 0; V < r; V++) {
					var z = Cesium.EncodedCartesian3.fromCartesian(y[V]);
					D.push(y[V].x), D.push(y[V].y), D.push(y[V].z), k.push(z.high.x), k.push(z.high.y), k.push(z.high.z), A.push(z.low.x), A.push(z.low.y), A.push(z.low.z), O.push(0, 1)
				}

				for (var H = 0; H < r; H++) {
					var B = Cesium.EncodedCartesian3.fromCartesian(v[H]);
					D.push(v[H].x), D.push(v[H].y), D.push(v[H].z), k.push(B.high.x), k.push(B.high.y), k.push(B.high.z), A.push(B.low.x), A.push(B.low.y), A.push(B.low.z), O.push(0, 0)
				}

				return {
					left: v,
					right: y,
					self: positions,
					vertexs: new Float32Array(D),
					vertexsH: new Float32Array(k),
					vertexsL: new Float32Array(A),
					indexs: new Uint16Array(R),
					uvs: new Float32Array(O)
				}
			},
			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）

				// 发送请求获得到水面线列表基本数据
				var self = this;
				$.ajax({
					url: 'http://www.sw797.com:82/blade-ycreal/waterline/querylist',
					dataType: 'json',
					type: 'get',
					success: function (data) {
						self.waterData = data.data;
						var lidom = null;
						var contentLeft = null;
						var contentRight = null;
						for (var i = 0; i < data.data.length; i++) {
							lidom = $('<li> </li>');
							contentLeft = $("<span class='content-left'></span>").text(data.data[i].sname);
							contentRight = $("<span class='content-right'></span>");
							lidom.prepend(contentLeft);
							lidom.append(contentRight);
							$('.water-analysis-content').append(lidom);
						}
					}
				})
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