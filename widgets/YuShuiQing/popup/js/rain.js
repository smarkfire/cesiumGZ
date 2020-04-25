$(function () {

	$('.close').click(function () {
		window.parent.$('#infoWindow_pup').hide();
		window.parent.$('#infoWindow_pup').attr('src', '');
	});
	$('.input_in input').val('快速查询');

	var d = new Date();
	var str = d.getFullYear()+"-"+(d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1)+"-"+(d.getDate() < 10 ? '0'+d.getDate() : d.getDate())+" "
			+(d.getHours()+1 <10 ? '0'+(d.getHours()+1):(d.getHours()+1))+":00:00";
	var str_zr = d.getFullYear()+"-"+(d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1)+"-"+d.getDate();
	var qz =new Date(getDate(Date.parse(new Date()) - 86400000 *5));
	var qzstr = qz.getFullYear()+"-"+(qz.getMonth()+1 < 10 ? '0'+(qz.getMonth()+1) : qz.getMonth()+1)+"-"+(qz.getDate() < 10 ? '0'+qz.getDate() : qz.getDate())+" 00:00:00";
	var qzstr_zr = qz.getFullYear()+"-"+(qz.getMonth()+1 < 10 ? '0'+(qz.getMonth()+1) : qz.getMonth()+1)+"-"+qz.getDate();

	var startTime = qzstr;
	var endTime = str;
	var rainstartTime = qzstr_zr;
	var rainendTime = str_zr;
	var code = GetQueryString("id");

	$('#inpstart_zr').val(qzstr_zr);
	$('#inpend_zr').val(str_zr);
	$('#timestart').val(qzstr);
	$('#timeend').val(str);


	$('.input_in input').click(function () {
		// $('#riverSel').show();
		$('#RainSel').toggle();
		$('#dailyRiverSel').toggle();
	})

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	setTimeout(function () {
		$('.load-box-list').show();
		rainShowPie(startTime, endTime);
	}, 200);
	//时段雨量
	$('#rainBtnOne').click(function () {
		recharts();
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		rainShowPie(startTime, endTime);
		$('#RainSel').hide();
		$('#dailyRiverSel').hide();
	});
	//逐日雨量
	$('#rainBtnTwo').click(function () {
		recharts_z();
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		dailyRainShowPie(rainstartTime, rainendTime);
		$('#RainSel').hide();
		$('#dailyRiverSel').hide();
	});

	//特征雨量
	$('#rainBtnThr').click(function () {
		$('.input_in input').val('快速查询');
		featuresShowInfo();
		$('#RainSel').hide();
		$('#dailyRiverSel').hide();



	});

	//基础信息
	$('#rainBtnFou').click(function () {
		$('.input_in input').val('快速查询');
		rainBasicShowInfo();
		$('#RainSel').hide();
		$('#dailyRiverSel').hide();
	});

	function recharts_z(){
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;

		var chartPie = document.getElementById('dailyPei');
		var myChartPie = echarts.init(chartPie);
		var resize = {
			width:width,
			height:height
		}
		myChartPie.resize(resize);
	}

	function recharts(){
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;

		// 获取ID
		var chartPie = document.getElementById('rainPei');
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

		$(".rain-tab").height(height);
		// 获取ID
		var chartPie_1 = document.getElementById('rainPei');
		var chartPie_2 = document.getElementById('dailyPei');
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

	//时段雨量------时间查询
	$('#riverBtn').click(function () {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		startTime = $("#timestart").val();
		endTime = $("#timeend").val();
		rainShowPie(startTime, endTime);
	});
	//时段雨量-----快速查询
	$('#RainSel ul li').click(function () {
		$('.load-box-list').show();
		$('#RainSel').hide();
		var checkTime = $(this).attr('data');
		var curr = new Date();
		var currDataD = curr.getFullYear();
		var currDataM = curr.getMonth() + 1;
		var currDataR = curr.getDate();
		var currDataH = curr.getHours();
		// 结束时间
		var currAllTime = currDataD + '-' + currDataM + '-' + currDataR + ' ' +  (currDataH+1) + ':00:00';
		var data = '';
		var dataD = '';
		var dataM = '';
		var dataR = '';
		var dataH = '';
		var dataDd = '';
		var allDataTime = '';
		if (checkTime == '2') {
			data = new Date(new Date() - 2 * 60 * 60 * 1000);
			$('.input_in input').val('最近2小时');
		} else if (checkTime == '12') {
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
		dataDd = data.getMinutes();
		// 开始时间
		allDataTime = dataD + '-' + dataM + '-' + dataR + ' ' + (dataH+1) + ':00:00';

		$('#timestart').val(allDataTime);
		$('#timeend').val(currAllTime);
		rainShowPie(allDataTime, currAllTime);
	});

	function getDate(timestamp) {
		let d = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let yyyy = d.getFullYear() + '-';
		let MM = (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '-';
		let dd = d.getDate() + ' ';
		let HH = d.getHours() + ':';
		let mm = d.getMinutes() + ':';
		let ss = d.getSeconds();
		return yyyy + MM + dd + HH + mm + ss;
	}

	function rainShowPie(startTime, endTime) {

		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/pptnr/selectDayStation",
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
				var q = '';
				var w = '';
				var dataName = [];
				var dataZ = [];
				var contant = '';
				for (var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 11);
					dataName.push(timesub);
					dataZ.push(result.data[i].drp);

					if (result.data[i].drp == null) {
						q = '';
					} else {
						q = result.data[i].drp;
					}
					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timesub + '</div></td>' +
						'<td><div>' + q + '</div></td>' +
						'</tr>';
				}
				$('#rainTable').html(contant);

				var option = {
					title: {
						text: '时段降雨过程',
						left: 'center'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						bottom: '0px',
						left: 'center',
						data: ['雨量']
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
						left: '7%',
						right: '4%',
						bottom: '8%',
						containLabel: true
					},
					yAxis: [{
						type: 'value',
						name: '降雨量（mm）',
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
						name: '雨量',
						type: 'line',
						data: dataZ
					}]
				};
				var chartPie = document.getElementById('rainPei');
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option, true);
				$('.load-box-list').hide();
			}
		});
	}

	//逐日雨量------时间查询
	$('#dailyRainBtn').click(function () {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		rainstartTime = $("#inpstart_zr").val();
		rainendTime = $("#inpend_zr").val();
		dailyRainShowPie(rainstartTime, rainendTime);
	});

	$('#dailyRiverSel ul li').click(function () {
		$('.load-box-list').show();
		$('#dailyRiverSel').hide();
		var checkTime = $(this).attr('data');
		var curr = new Date();
		var currDataD = curr.getFullYear(); // 获取完整的年份 4位数
		var currDataM = curr.getMonth() + 1; // 获取当前月份，0是1月，所以+1
		var currDataR = curr.getDate(); // 获取当前日，1-31日
		var currDataH = curr.getHours(); // 获取当前小时数0-23
		// 结束时间
		var currAllTime = currDataD + '-' + currDataM + '-' + currDataR;
		var data = '';
		var dataD = '';
		var dataM = '';
		var dataR = '';
		var dataH = '';
		var allDataTime = '';
		if (checkTime == '3') {
			data = new Date(new Date() - 24 * 60 * 60 * 1000 * 3);
			$('.input_in input').val('近3天');
		} else if (checkTime == '7') {
			data = new Date(new Date() - 24 * 60 * 60 * 1000 * 7);
			$('.input_in input').val('近7天');
		}else if (checkTime == '15') {
			data = new Date(new Date() - 24 * 60 * 60 * 1000 * 15);
			$('.input_in input').val('近15天');
		}
		dataD = data.getFullYear();
		dataM = data.getMonth() + 1;
		dataR = data.getDate();
		dataH = data.getHours();
		// 开始时间
		allDataTime = dataD + '-' + dataM + '-' + dataR;

		$('#inpstart_zr').val(allDataTime);
		$('#inpend_zr').val(currAllTime);

		dailyRainShowPie(allDataTime, currAllTime);
	});

	function dailyRainShowPie(rainstartTime, rainendTime) {
		if (rainstartTime == '' && rainendTime == '') {
			var Nowdate = new Date();
			var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
			M = Number(MonthFirstDay.getMonth()) + 1
			rainstartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth()) + 1
			rainendTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		}

		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/pptnr/selectStation",
			type: 'post',
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code,
				'dateBegin': rainstartTime,
				'dateEnd': rainendTime
			},
			success: function (result) {
				var q = '';
				var w = '';
				var dataName = [];
				var dataZ = [];
				var contant = '';
				for (var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 11);
					dataName.push(timesub);

					if (result.data[i].DRP == -1) {
						q = 0;
					} else {
						q = result.data[i].DRP;
					}
					dataZ.push(q);
					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timesub + '</div></td>' +
						'<td><div>' + q + '</div></td>' +
						'</tr>';
				}
				$('#dailyRainTable').html(contant);

				var option = {
					title: {
						text: '逐日雨量',
						left: 'center'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						bottom: '0px',
						left: 'center',
						data: ['雨量']
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
						left: '7%',
						right: '4%',
						bottom: '8%',
						containLabel: true
					},
					yAxis: [{
						type: 'value',
						name: '降雨量（mm）',
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
						name: '雨量',
						type: 'line',
						data: dataZ
					}]
				};

				var chartPie = document.getElementById('dailyPei');
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option, true);
				$('.load-box-list').hide();
			}
		});
	}


	//特征雨量---查询
	function featuresShowInfo() {
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/pptnr/selectPptnTz",
			type: 'post',
			async: false,
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code
			},
			success: function (result) {
				var contant = '';

				var time = result.data[0].time;
				var timesub = time.substr(5, 11);
				contant = '<tr>' +
					'<td><div>1</div></td>' +
					'<td><div>' + timesub + '</div></td>' +
					'<td><div>' + result.data[0].drp1 + '</div></td>' +
					'<td><div>' + result.data[0].drp2 + '</div></td>' +
					'<td><div>' + result.data[0].drp3 + '</div></td>' +
					'<td><div>' + result.data[0].drp6 + '</div></td>' +
					'<td><div>' + result.data[0].drp12 + '</div></td>' +
					'<td><div>' + result.data[0].drp24 + '</div></td>' +
					'<td><div>' + result.data[0].drp48 + '</div></td>' +
					'<td><div>' + result.data[0].drp72 + '</div></td>' +
					'</tr>';

				$('#rainTbodyBox').html(contant);
			}
		});
	}


	//基础信息---查询
	function rainBasicShowInfo() {
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

				$('#rainInfo').html(html);
			}
		});
	}



	$('.rain-menu ul li').click(function () {
		$(this).addClass('on').siblings().removeClass('on');
		$('.rain-box .river-con').eq($(this).index()).show().siblings().hide();
	});

});