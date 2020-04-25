$(function () {
	// div 下面的快速查询
	$('.input_in input').val('快速查询');

	//	var code = '62304700';


	// 截取 url 地址参数code的值
	var code = GetQueryString("id");

	var d = new Date();
	var str = d.getFullYear()+"-"+(d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1)+"-"+(d.getDate() < 10 ? '0'+d.getDate() : d.getDate())+" "
			+(d.getHours()+1 <10 ? '0'+(d.getHours()+1):(d.getHours()+1))+":00:00";
	var str_zr = d.getFullYear()+"-"+(d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1)+"-"+d.getDate();
	var qz =new Date(getDate(Date.parse(new Date()) - 86400000 *5));
	var qzstr = qz.getFullYear()+"-"+(qz.getMonth()+1 < 10 ? '0'+(qz.getMonth()+1) : qz.getMonth()+1)+"-"+(qz.getDate() < 10 ? '0'+qz.getDate() : qz.getDate())+" 00:00:00";
	var qzstr_zr = qz.getFullYear()+"-"+(qz.getMonth()+1 < 10 ? '0'+(qz.getMonth()+1) : qz.getMonth()+1)+"-"+qz.getDate();

	// 4个控制时间
	$('#inpstart_zr').val(qzstr_zr);
	$('#inpend_zr').val(str_zr);
	$('#timestart').val(qzstr);
	$('#timeend').val(str);

	//  开始时间
	var startTime = qzstr;
	// 结束时间
	var endTime = str;

	// 八时开始
	var eightstartTime = qzstr_zr;
	var eightendTime = str_zr;

	var option_sw = {};
	var option_bs = {};

	//水位过程
	$('#riverBtnOne').click(function () {
		recharts();
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		showPie(startTime, endTime);
		$('#riverSel').hide();
		$('#eightRiverSel').hide();

	});

	function recharts(){
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;
		
		// 获取ID
		var chartPie = document.getElementById('riverPei');
		var myChartPie = echarts.init(chartPie);
		var resize = {
			width:width,
			height:height
		}
		myChartPie.resize(resize);
	}
	//八时水位
	$('#riverBtnTwo').click(function () {
		recharts_z();
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		eightShowPie(eightstartTime, eightendTime);
		$('#riverSel').hide();
		$('#eightRiverSel').hide();


	});

	function recharts_z(){
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;
		
		$("#eigthRiverWeater").empty();
		$("#eigthRiverWeater").removeAttr("_echarts_instance_").empty();
		var chartPie = document.getElementById('eigthRiverWeater');
		var myChartPie = echarts.init(chartPie);
		var resize = {
			width:width,
			height:height
		}
		myChartPie.resize(resize);
	}

	window.onresize = function () {
		
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;

		$(".river-tab").height(height);
		// 获取ID
		var chartPie_1 = document.getElementById('riverPei');
		var chartPie_2 = document.getElementById('eigthRiverWeater');
		// echarts初始化
		var myChartPie_1 = echarts.init(chartPie_1);
		var myChartPie_2 = echarts.init(chartPie_2);
		var resize = {
			width:width,
			height:height
		}
		myChartPie_1.resize(resize);
		myChartPie_2.resize(resize);
	};
	//预报水情信息
	$('#riverBtnOne').click(function () {
		$('.input_in input').val('快速查询');
	});
	//基础信息
	$('#riverBtnFou').click(function () {
		$('.input_in input').val('快速查询');
		$('#riverSel').hide();
		$('#eightRiverSel').hide();
		basicShowInfo();
	});

	function getDate(timestamp) {
		let d = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let yyyy = d.getFullYear() + '-';
		let MM = (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '-';
		let dd = (d.getDate() < 10 ? '0'+d.getDate() : d.getDate()) + ' ';
		let HH = d.getHours() + ':';
		let mm = d.getMinutes() + ':';
		let ss = d.getSeconds();
		return yyyy + MM + dd + HH + mm + ss;
	}

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	setTimeout(function () {
		$('.load-box-list').show();
		showPie(startTime, endTime);
	}, 200);

	$('.input_in input').click(function () {
		$('#riverSel').toggle();
		$('#eightRiverSel').toggle();
	})

	//水位过程-----快速查询
	$('#riverSel ul li').click(function () {
		$('.load-box-list').show();
		$('#riverSel').hide();
		var checkTime = $(this).attr('data');
		var curr = new Date();
		var currDataD = curr.getFullYear(); // 获取完整的年份 4位数
		var currDataM = curr.getMonth() + 1; // 获取当前月份，0是1月，所以+1
		var currDataR = curr.getDate(); // 获取当前日，1-31日
		var currDataH = curr.getHours(); // 获取当前小时数0-23
		// 结束时间
		var currAllTime = currDataD + '-' + currDataM + '-' + currDataR + ' ' + (currDataH+1) + ':00:00';
		var data = '';
		var dataD = '';
		var dataM = '';
		var dataR = '';
		var dataH = '';
		var allDataTime = '';
		if (checkTime == '12') {
			data = new Date(new Date() - 12 * 60 * 60 * 1000);
			$('.input_in input').val('最近12小时');
		} else if (checkTime == '24') {
			data = new Date(new Date() - 24 * 60 * 60 * 1000);
			$('.input_in input').val('最近24小时');
		} else if (checkTime == '36') {
			data = new Date(new Date() - 36 * 60 * 60 * 1000);
			$('.input_in input').val('最近36小时');
		} else if (checkTime == '72') {
			data = new Date(new Date() - 72 * 60 * 60 * 1000);
			$('.input_in input').val('最近72小时');
		}
		dataD = data.getFullYear();
		dataM = data.getMonth() + 1;
		dataR = data.getDate();
		dataH = data.getHours();
		// 开始时间
		allDataTime = dataD + '-' + dataM + '-' + dataR + ' ' + (dataH+1) + ':00:00';
		$('#timestart').val(allDataTime);
		$('#timeend').val(currAllTime);
		showPie(allDataTime, currAllTime);
	});


	//水位过程------时间查询
	$('#riverBtn').click(function () {

		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		// 开始时间获取
		startTime = $("#timestart").val();
		// 结束时间获取
		endTime = $("#timeend").val();
		// 调用方法，传参数， 开始 于 结束
		showPie(startTime, endTime);
	});
	// 时间查询方法
	function showPie(startTime, endTime) {
		// 接受参数，发送ajax请求
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/riverr/selectStation",
			type: 'post',
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code,
				'dateBegin': startTime,
				'dateEnd': endTime
			},
			success: function (result) {
				// 回调函数，接受数据
				var q = '';
				var dataName = [];
				var dataL = [];
				var dataZ = [];
				var contant = '';
				for (var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 11);
					var timetab = time.substr(5, 11);
					var wptn_val = result.data[i].wptn;

					if (wptn_val == '4') {
						var wptn = '↓';
						var color1 = 0;
						var color2 = 128;
						var color3 = 0;
					} else if (wptn_val == '5') {
						var wptn = '↑';
						var color1 = 255;
						var color2 = 0;
						var color3 = 0;
					} else if (wptn_val == '6') {
						var wptn = '-';
						var color1 = 0;
						var color2 = 0;
						var color3 = 255;
					}

					dataName.push(timesub);

					dataZ.push(result.data[i].z);
					if (result.data[i].q == null || result.data[i].q == -1 ) {
						q = '/';
					} else {
						q = result.data[i].q;
					}

					dataL.push(q);
					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timetab + '</div></td>' +
						'<td><div>' + result.data[i].z + '</div></td>' +
						"<td><div style='text-align:center'><span style='color: rgb(" + color1 + ", " + color2 + ", " + color3 + ")'>" + wptn + "</span></div></td>" +
						'<td><div>' + q + '</div></td>' +
						'</tr>';
				}
				$('#riverTable').html(contant);


				// echarts 需要
				option_sw = {
					title: {
						text: '实时水情',
						left: 'center',
						top: '15px'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						bottom: '0px',
						left: 'center',
						data: ['水位', '流量']
					},
					xAxis: [{
						type: 'category',
						splitLine: {
							show: false
						},
						data: dataName,
						inverse:true,
						boundaryGap: false,
						axisLine: {
							onZero: false,
							lineStyle: {
								color: "#000"
							}
						},
					}],
					grid: {
						left: '3%',
						right: '4%',
						bottom: '8%',
						containLabel: true
					},
					yAxis: [{
						type: 'value',
						name: '水位（m）',
						axisLine: {
							lineStyle: {
								color: '#000',
							}
						},
						splitLine: {
							show: true
						},
					}],
					series: [{
							name: '水位',
							type: 'line',
							data: dataZ
						},
						{
							name: '流量',
							type: 'line',
							data: dataL
						}
					]
				};
				// 获取ID
				var chartPie = document.getElementById('riverPei');
				// echarts初始化
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option_sw, true);
				$('.load-box-list').hide();
			}
		});
	}

	//八时水位------时间查询
	$('#eigthRiverBtn').click(function () {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		eightstartTime = $("#inpstart_zr").val();
		eightendTime = $("#inpend_zr").val();
		eightShowPie(eightstartTime, eightendTime);
	});

	//八时水位------快速查询
	$('#eightRiverSel ul li').click(function () {
		$('.load-box-list').show();
		$('#eightRiverSel').hide();
		var checkTime = $(this).attr('data');
		var eightstartTime = '';
		var eightendTime = '';
		var Nowdate = new Date();
		var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
		if (checkTime == '本月') {
			$('.input_in input').val('本月');
			M = Number(MonthFirstDay.getMonth()) + 1
			eightstartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth()) + 1
			eightendTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		} else if (checkTime == '上月') {
			$('.input_in input').val('上月');
			M = Number(MonthFirstDay.getMonth())
			eightstartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth() + 1)
			eightendTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		}

		// 时间回填
		$('#inpstart_zr').val(eightstartTime);
		$('#inpend_zr').val(eightendTime);


		eightShowPie(eightstartTime, eightendTime);
	});

	function eightShowPie(eightstartTime, eightendTime) {
		if (eightstartTime == '' && eightendTime == '') {
			var Nowdate = new Date();
			var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
			M = Number(MonthFirstDay.getMonth()) + 1
			eightstartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth()) + 1
			eightendTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		}
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/riverr/selectDayList",
			type: 'post',
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code,
				'dateBegin': eightstartTime + " 00:00:00",
				'dateEnd': eightendTime + " 23:59:59"
			},
			success: function (result) {
				var q = '';
				var dataName = [];
				var dataZ = [];
				var dataL = [];
				var contant = '';
				for (var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 11);
					var timetab = time.substr(5, 11);
					dataName.push(timesub);

					var wptn_val = result.data[i].wptn;

					if (wptn_val == '4') {
						var wptn = '↓';
						var color1 = 0;
						var color2 = 128;
						var color3 = 0;
					} else if (wptn_val == '5') {
						var wptn = '↑';
						var color1 = 255;
						var color2 = 0;
						var color3 = 0;
					} else if (wptn_val == '6') {
						var wptn = '-';
						var color1 = 0;
						var color2 = 0;
						var color3 = 255;
					}

					dataZ.push(result.data[i].z);

					if (result.data[i].q == null || result.data[i].q == -1) {
						q = '/';
					} else {
						q = result.data[i].q;
					}
					dataL.push(q);

					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timetab + '</div></td>' +
						'<td><div>' + result.data[i].z + '</div></td>' +
						"<td><div style='text-align:center'><span style='color: rgb(" + color1 + ", " + color2 + ", " + color3 + ")'>" + wptn + "</span></div></td>" +
						'<td><div>' + q + '</div></td>' +
						'</tr>';
				}

				$('#eigthRiverTable').html(contant);



				// echarts 数据需要
				option_bs = {
					title: {
						text: '逐日八时',
						left: 'center',
						top: '15px'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						bottom: '0px',
						left: 'center',
						data: ['水位', '流量']
					},
					xAxis: [{
						type: 'category',
						splitLine: {
							show: false
						},
						data: dataName,
						boundaryGap: false,
						inverse:true,
						axisLine: {
							onZero: false,
							lineStyle: {
								color: "#000"
							}
						},
					}],
					grid: {
						left: '3%',
						right: '4%',
						bottom: '8%',
						containLabel: true
					},
					yAxis: [{
						type: 'value',
						name: '水位（m）',
						axisLine: {
							lineStyle: {
								color: '#000',
							}
						},
						splitLine: {
							show: true
						},
					}],
					series: [{
							name: '水位',
							type: 'line',
							data: dataZ
						},
						{
							name: '流量',
							type: 'line',
							data: dataL
						}
					]
				};
				var chartPie = document.getElementById('eigthRiverWeater');
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option_bs, true);
				$('.load-box-list').hide();
			}
		});
	}

	//基础信息---查询
	function basicShowInfo() {
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/stbprpb/selectInfo",
			type: 'post',
			async: false,
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code
			},
			success: function (result) {
				var html = '<li>' +
					'<span>测站编码：</span>' +
					'<div>' + code + '</div>' +
					'</li>' +
					'<li>' +
					'<span>测站名称：</span>' +
					'<div>' + result.data[0].stnm + '</div>' +
					'</li>' +
					'<li>' +
					'<span>测站类别：</span>' +
					'<div>' + result.data[0].sttp + '</div>' +
					'</li>' +
					'<li>' +
					'<span>报讯等级：</span>' +
					'<div>' + result.data[0].frgrd + '</div>' +
					'</li>' +
					'<li>' +
					'<span>基面名称：</span>' +
					'<div>' + result.data[0].atcunit + '</div>' +
					'</li>' +
					'<li>' +
					'<span>管理单位：</span>' +
					'<div>' + result.data[0].locality + '</div>' +
					'</li>' +
					'<li>' +
					'<span>所在县：</span>' +
					'<div>' + result.data[0].addvcd5 + '</div>' +
					'</li>' +
					'<li>' +
					'<span>流域名称：</span>' +
					'<div>' + result.data[0].bsnm + '</div>' +
					'</li>' +
					'<li>' +
					'<span>水系：</span>' +
					'<div>' + result.data[0].hnnm + '</div>' +
					'</li>' +
					'<li>' +
					'<span>河名：</span>' +
					'<div>' + result.data[0].rvnm + '</div>' +
					'</li>';

				$('#riverInfo').html(html);
			}
		});
	}

	$('.river-menu ul li').click(function () {
		$(this).addClass('on').siblings().removeClass('on');
		$('.river-box .river-con').eq($(this).index()).show().siblings().hide();
	});

	$("#loc_smx").click(function(){
		//注意：parent 是 JS 自带的全局对象，可用于操作父页面
		var index = parent.layer.getFrameIndex("Location"); //获取窗口索引
		window.parent.$('#loc_openWin').click();
		parent.layer.close(index);
});

});
