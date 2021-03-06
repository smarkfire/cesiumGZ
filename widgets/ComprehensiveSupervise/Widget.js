///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述：综合监管
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/html',
	'dojo/topic',
	'jimu/BaseWidget',
	'libs/laydate/laydate.js',
	'libs/layer/layer.js'
],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget,
		laydate,
		layer
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-ComprehensiveSupervise',
			name: 'ComprehensiveSupervise',
			ind: null,
			surveillanceEntityId: [],
			surveillanceEntityData: [],
			infor: null,
			cartesian: null,
			handler: null,

			startup: function () {
				this.inherited(arguments);
				var that = this;
				var scene = that.map.scene;
				// 保存左侧菜单栏的点击下标
				var cont = $('.jimu-widget-ComprehensiveSupervise .supervise-content');
				$('.jimu-widget-ComprehensiveSupervise .supervise-meau ul li').click(function () {
					if ($(this).index() == that.ind) return;
					$(this).addClass('on').siblings().removeClass('on');
					// 监测
					if (!$('.jimu-widget-Hydrology').is(':hidden')) {
						topic.publish("closehydrology", 'Hydrology');
					}
					// 预警
					if (!$('.jimu-widget-MountainFloodWarning').is(':hidden')) {
						topic.publish("closeMountain", 'MountainFloodWarning');
					}
					// 视频
					if (!$('.video').is(':hidden')) {
						$('.video').stop().hide();
						that.removeSuperEntity();
						if (that.infor) {
							$('#superTrackPopup').stop().hide();
							that.cartesian = null;
						}
					}
					// 值班
					if (!$('.supervise-patrol-duty').is(':hidden')) {
						$('.supervise-patrol-duty').stop().hide();
					}

					if ($(this).index() == 0) {
						cont.append($('.jimu-widget-Hydrology').stop().show());
						$('.jimu-widget-Hydrology .hydro-list-mean a:eq(0)').trigger('click');
					} else if ($(this).index() == 1) {
						cont.append($('.jimu-widget-MountainFloodWarning').stop().show());
						topic.publish("openMountain", 'MountainFloodWarning');
					} else if ($(this).index() == 2) {
						$('.supervise-content .video-list ul').empty();
						$.ajax({
							url: './widgets/ComprehensiveSupervise/data.json',
							type: 'get',
							dataType: 'json',
							success: function (data) {
								// 将data的值赋值给全局变量
								data.data.forEach((item, index) => {
									$('.supervise-content .video-list ul').append(
										$(`<li>
											<img src='${item.localurl}' alt='${item.name}' title='${item.name}' lng='${item.longitude}' httpurl='${item.monitor}' ltt='${item.latitude}'> 
											<span>${item.name}</span> 
											<div>
												<i>
													<img src="./images/video-playback.png" alt="">
												</i>
											</div>
										</li>`)
									)
									if (item.longitude != "" && item.latitude != "") {
										that.map.entities.add({
											id: 'super' + item.localurl,
											name: item.name,
											position: Cesium.Cartesian3.fromDegrees(Number(item.longitude), Number(item.latitude)),
											billboard: {
												image: './images/surveillance-entity.png', // img 与实体相关的图片
												show: true,
												width: 26,
												height: 26,
												heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
												disableDepthTestDistance: Number.POSITIVE_INFINITY
											}
										})
										that.surveillanceEntityId.push('super' + item.localurl);
										that.surveillanceEntityData.push(item);
									}
								})
								that.onClickEntitys()
							}
						})
						$('.video').stop().show();
					} else if ($(this).index() == 3) {
						that.onclickTime();
						$('.supervise-patrol-duty').stop().show();
					}
					that.ind = $(this).index();
				})

				$('.video ul').on('click', 'li', function () {

					if ($(this).children('img').attr('lng') == "" && $(this).children('img').attr('ltt') == "") {
						that.openLayerSuper($(this).children('span').attr('sitename'), $(this).children('img').attr('httpurl'));
						return
					}
					if (that.infor) {
						$('#superTrackPopup').remove('');
					}
					that.map.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(Number($(this).children('img').attr('lng')), Number($(this).children('img').attr('ltt')), 10000),
						easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
					});
					that.cartesian = Cesium.Cartesian3.fromDegrees(Number($(this).children('img').attr('lng')), Number($(this).children('img').attr('ltt')), 200);

					var firstPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, that.cartesian);
					that.infor = that.createTrackPopup($(this).children('img').attr('httpurl'), $(this).children('span').text());
					$('.jimu-widget-ComprehensiveSupervise').append(
						that.infor
					)
					$('#superTrackPopupContent').css({
						"top": firstPosition.x - ($("#superTrackPopupContent")[0].offsetWidth / 2) + 'px',
						"left": firstPosition.y - ($("#superTrackPopupContent")[0].offsetHeight + 20) + 'px'
					})
					that.map.scene.postRender.addEventListener(function () {
						if (that.cartesian) {
							that.updataPopup(that.cartesian);
						}
					})



				})

				$('#link_tips').mouseover(function () {
					$('.jimu-widget-ComprehensiveSupervise .link-enlarge-address').stop().show();

				})

				$('#link_tips').mouseout(function () {
					$('.jimu-widget-ComprehensiveSupervise .link-enlarge-address').stop().hide();

				})

				// 监控放大 
				$('.jimu-widget-ComprehensiveSupervise').on('click', '#superTrackPopupContent img', function () {
					that.openLayerSuper($(this).attr('sitename'), $(this).attr('src'));
				})

				$('.jimu-widget-ComprehensiveSupervise').on('click', '#superTrackPopupContent .superTrackClose', function () {
					if (that.infor) {
						$('#superTrackPopup').stop().hide();
						that.cartesian = null;
					}
				})


				// 日期查询事件
				// $('.supervise-patrol-duty date input:eq(1)').click(function () {
				// 	var date = $(this).prev().val();
				// })

			},
			// 窗体移动
			updataPopup: function (cartesian) {
				if (!cartesian) return;
				console.log(cartesian)
				var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.map.scene, cartesian);
				var trackPopUpContent = window.document.getElementById("superTrackPopupContent");
				var popw = document.getElementById("superTrackPopupContent").offsetWidth;
				var poph = document.getElementById("superTrackPopupContent").offsetHeight;
				trackPopUpContent.style.left = px_position.x - (popw / 2) + "px";
				trackPopUpContent.style.top = px_position.y - (poph + 20) + "px";
			},
			// 创建窗体
			createTrackPopup: function (src, name) {
				var tarckpopup = $(`<div id='superTrackPopup'>
									<div id='superTrackPopupContent'>
										<i	class='superTrackClose'>
											×
										</i>
										<img src='${src}' sitename='${name}'>
									
										<i class="superTrackBtm">
											<span>
											</span>
										</i>
								
									</div>
								</div>`)
				return tarckpopup
			},
			// 打开layer弹框
			openLayerSuper: function (name, url) {
				var wid = $(window).width() + 'px';
				var hei = $(window).height() + 'px';
				layer.open({
					title: name,
					type: 1,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: [wid, hei],
					content: `<img src='${url}' width='100%' height='100%' style='vertical-align: middle;'>`,
					id: "ComprehensiveSupervise",
					closeBtn: 1,
					success: function (layero, index) {
					}
				});
			},
			// 删除实体
			removeSuperEntity: function () {
				if (this.surveillanceEntityId.length > 0) {
					this.surveillanceEntityId.forEach((item, index) => {
						this.map.entities.removeById(item);
					})
					this.surveillanceEntityId = [];
				}
			},
			// 点击实体
			onClickEntitys: function () {
				var that = this;
				that.handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);

				that.handler.setInputAction(function (movement) {
					that.cartesian = null;
					if (that.infor) {
						$('#superTrackPopup').stop().hide();
					}
					var pick = that.map.scene.pick(movement.position);
					var ray = that.map.camera.getPickRay(movement.position);
					cartesian = that.cartesian;
					
					if (pick && pick.id) {
						if (that.surveillanceEntityId.indexOf(pick.id.id) != -1) {
							// that.cartesian = that.map.scene.globe.pick(ray, that.map.scene);
							var cartographic = Cesium.Cartographic.fromCartesian(pick.id.position._value)
							var lat = Cesium.Math.toDegrees(cartographic.latitude);
							var lng = Cesium.Math.toDegrees(cartographic.longitude);
							that.cartesian = Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), 200);
							if (that.infor) {
								$('#superTrackPopup').remove('');
							}
							that.infor = that.createTrackPopup(that.surveillanceEntityData[that.surveillanceEntityId.indexOf(pick.id.id)].monitor, that.surveillanceEntityData[that.surveillanceEntityId.indexOf(pick.id.id)].name);

							$('.jimu-widget-ComprehensiveSupervise').append(
								that.infor
							)

							that.map.scene.postRender.addEventListener(function () {
								if (that.cartesian) {
									that.updataPopup(that.cartesian)
								}
							})

						} else {
							$('#superTrackPopup').stop().hide();
						}
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},

			onOpen: function () {
				this.ind = null;
				this.surveillanceEntityId = [];
				this.surveillanceEntityData = [];
				this.infor = null;
				this.cartesian = null;
				this.handler = null;
				//面板打开的时候触发 （when open this panel trigger）
				this.map.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(115.257787, 25.885506, 549263.35),
					easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
				});

				$('.jimu-widget-ComprehensiveSupervise .supervise-meau ul li:eq(0)').trigger('click');

				laydate.render({
					elem: '#supervisePatrolDutyData', //指定元素
					type: "date",
					format: 'yyyy-MM-dd HH:mm',
					btns: ['confirm'],
					done: function (value) {
						$($(this)[0].elem[0]).val(value)
					}
				});


				
			},

			onClose: function () {
				//面板关闭的时候触发 （when this panel is closed trigger）
				topic.publish("closehydrology", 'Hydrology');
				topic.publish("closeMountain", 'MountainFloodWarning');
				this.removeSuperEntity();
				if ($('#superTrackPopup')) $('#superTrackPopup').remove('');
				if (this.handler) this.handler.destroy();
				this.cartesian = null;
			},

			onMinimize: function () {
				this.resize();
			},

			onMaximize: function () {
				this.resize();
			},

			resize: function () { },

			destroy: function () {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			},

			onclickTime: function () {

				// 当前时间
				var timestamp = Date.parse(new Date());

				var serverDate = new Date(timestamp);
				//本周周日的的时间


				// 年
				var currentYear = serverDate.getFullYear();

				//月

				var currentMonth = (serverDate.getMonth() + 1 < 10 ? '0' + (serverDate.getMonth() + 1) : serverDate.getMonth() + 1);

				//日

				var currentDay = serverDate.getDate() < 10 ? '0' + serverDate.getDate() : serverDate.getDate();

				$('#supervisePatrolDutyData').val(currentYear + '-' + currentMonth + '-' + currentDay + ' 00:00');


				for (var i = 1; i <= 7; i++) {
					var sundayTiem = timestamp + ((i - serverDate.getDay()) * 24 * 60 * 60 * 1000)

					var SundayData = new Date(sundayTiem);

					// 年
					var tomorrowY = SundayData.getFullYear();

					//月

					var tomorrowM = (SundayData.getMonth() + 1 < 10 ? '0' + (SundayData.getMonth() + 1) : SundayData.getMonth() + 1);

					//日

					var tomorrowD = SundayData.getDate() < 10 ? '0' + SundayData.getDate() : SundayData.getDate();

					// console.log(tomorrowY + '-' + tomorrowM + '-' + tomorrowD);

					$(`.supervise-patrol-duty-list .tbody tr:eq(${i - 1}) td:eq(1)`).text(tomorrowY + '-' + tomorrowM + '-' + tomorrowD);

					if (tomorrowY + '-' + tomorrowM + '-' + tomorrowD == currentYear + '-' + currentMonth + '-' + currentDay) {
						$(`.supervise-patrol-duty-list .tbody tr:eq(${i - 1})`).addClass('on').siblings().removeClass('on');
					}
				}

			}


		});
	});