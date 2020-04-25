


$(function() {

	$('.close').click(function() {
		window.parent.$('#infoWindow_pup').hide();
		window.parent.$('#infoWindow_pup').attr('src', '');
	});
	$('.input_in input').val('快速查询');

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

	var startTime = qzstr;
	var endTime = str;
	var rainstartTime = qzstr_zr;
	var rainendTime = str_zr;

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}

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

	setTimeout(function() {
		$('.load-box-list').show();
		reseShowPie(startTime, endTime);
	}, 200);

	$('.input_in input').click(function () {
		// $('#riverSel').show();
		$('#restSel').toggle();
		$('#restRiverSelBox').toggle();
	})

	//水位过程
	$('#reseBtnOne').click(function() {
		$('.load-box-list').show();
		$('#restSel').hide();
		$('#restRiverSelBox').hide();
		$('.input_in input').val('快速查询');
		reseShowPie(startTime, endTime);
		$('#restSel').hide();
		$('#restRiverSelBox').hide();
	});
	//八时水位
	$('#reseBtnTwo').click(function() {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		dailyReseShowPie(rainstartTime, rainendTime);
		$('#restSel').hide();
		$('#restRiverSelBox').hide();
	});

	function recharts_z(){
		var width = $(window).width()*0.53;
		var height =($(window).height()-50)-80;

		var chartPie = document.getElementById('rserWeaterPie');
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
		var chartPie = document.getElementById('resePei');
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
		var chartPie_1 = document.getElementById('resePei');
		var chartPie_2 = document.getElementById('rserWeaterPie');
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


	//基础信息
	$('#reseBtnThr').click(function() {
		$('.input_in input').val('快速查询');
		reseBasicShowInfo();
		$('#restSel').hide();
		$('#restRiverSelBox').hide();
	});

	$('#restSel ul li').click(function() {
		$('.load-box-list').show();
		$('#restSel').hide();
		var checkTime = $(this).attr('data');
		var curr = new Date();
		var currDataD = curr.getFullYear();
		var currDataM = curr.getMonth() + 1;
		var currDataR = curr.getDate();
		var currDataH = curr.getHours();
		var currDataDd = curr.getMinutes(); // 获取分钟数
		var currAllTime = currDataD + '-' + currDataM + '-' + currDataR + ' ' + (currDataH+1) + ':00:00';
		var data = '';
		var dataD = '';
		var dataM = '';
		var dataR = '';
		var dataH = '';
		var dataDd = '';
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
		dataDd = data.getMinutes();
		allDataTime = dataD + '-' + dataM + '-' + dataR + ' ' + (dataH+1) + ':00:00';
		$('#timestart').val(allDataTime);
		$('#timeend').val(currAllTime);
		reseShowPie(allDataTime, currAllTime);
	});

	//水位过程------时间查询
	$('#restRiverBtn').click(function() {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		startTime = $("#timestart").val();
		endTime = $("#timeend").val();
		reseShowPie(startTime, endTime);
	});

	function reseShowPie(startTime, endTime) {
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvrList",
			type: 'post',
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code,
				'dateBegin': startTime,
				'dateEnd': endTime
			},
			success: function(result) {
				var q = '';
				var dataName = [];
				var dataZ = [];
				var dataL = [];
				var dataX = [];
				var contant = '';
				for(var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 8);
					
					var wptn_val = result.data[i].rwptn;
					if(wptn_val == '4') {
						var wptn = '↓';
						var color1 = 0;
						var color2 = 128;
						var color3 = 0;
					} else if(wptn_val == '5') {
						var wptn = '↑';
						var color1 = 255;
						var color2 = 0;
						var color3 = 0;
					} else if(wptn_val == '6' || !wptn_val) {
						var wptn = '-';
						var color1 = 0;
						var color2 = 0;
						var color3 = 255; 
					}
					if (result.data[i].w == -1) {
						result.data[i].w = 0;
					}
					dataName.push(timesub);
					dataZ.push(result.data[i].rz);
					dataL.push(result.data[i].w);
					dataX.push(result.data[i].fsltdz);
					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timesub + '</div></td>' +
						'<td><div>' + result.data[i].rz + '</div></td>' +
						"<td><div style='text-align:center'><span style='color: rgb("+color1+", "+color2+", "+color3+")'>" + wptn + "</span></div></td>" +
						'<td><div>' + result.data[i].w + '</div></td>' +
						'</tr>';
				}
				$('#reseTable').html(contant);

				var option = {
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
						data: ['水位', '蓄水量', '汛限']
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
							name: '蓄水量',
							type: 'line',
							data: dataL
						},
						{
							name: '汛限',
							type: 'line',
							data: dataX
						}
					]
				};
				var chartPie = document.getElementById('resePei');
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option, true);
				$('.load-box-list').hide();
			}
		});
	}

	//八时水位------时间查询
	$('#restriverBtn_bs').click(function() {
		$('.load-box-list').show();
		$('.input_in input').val('快速查询');
		eightstartTime = $("#inpstart_zr").val();
		eightendTime = $("#inpend_zr").val();
		dailyReseShowPie(eightstartTime, eightendTime);
	});

	//八时水位------快速查询
	$('#restRiverSelBox ul li').click(function() {
		$('.load-box-list').show();
		$('#restRiverSelBox').hide();
		var checkTime = $(this).attr('data');
		var eightstartTime = '';
		var eightendTime = '';
		var Nowdate = new Date();
		var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
		if(checkTime == '本月') {
			$('.input_in input').val('本月');
			M = Number(MonthFirstDay.getMonth()) + 1
			eightstartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth()) + 1
			eightendTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		} else if(checkTime == '上月') {
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
		dailyReseShowPie(eightstartTime, eightendTime);
	});

	function dailyReseShowPie(reseStartTime, reseEndTime) {
		if (reseStartTime == '' && reseStartTime == '') {
			var Nowdate = new Date();
			var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
			M = Number(MonthFirstDay.getMonth()) + 1
			reseStartTime = MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
			var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
			var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
			M = Number(MonthLastDay.getMonth()) + 1
			reseEndTime = MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
		}
		$.ajax({
			url: "http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvrDayList",
			type: 'post',
			dataType: 'json',
			jsonp: 'callback',
			jsonpCallback: 'data',
			data: {
				'code': code,
				'dateBegin': reseStartTime+ " 00:00:00",
				'dateEnd': reseEndTime+ " 23:59:59"
			},
			success: function(result) {
				var q = '';
				var dataName = [];
				var dataZ = [];
				var dataL = [];
				var dataX = [];
				var contant = '';
				for(var i = 0; i < result.data.length; i++) {
					var time = result.data[i].tm;
					var timesub = time.substr(5, 11);
					dataName.push(timesub);
					dataZ.push(result.data[i].rz);
					dataL.push(result.data[i].w);
					dataX.push(result.data[i].fsltdz);
					contant += '<tr>' +
						'<td><div>' + (i + 1) + '</div></td>' +
						'<td><div>' + timesub + '</div></td>' +
						'<td><div>' + result.data[i].rz + '</div></td>' +
						'</tr>';
				}
				$('#reseTableBox').html(contant);
				var option = {
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
						data: ['水位', '蓄水量', '汛限']
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
							name: '蓄水量',
							type: 'line',
							data: dataL
						},
						{
							name: '汛限',
							type: 'line',
							data: dataX
						}
					]
				};
				var chartPie = document.getElementById('rserWeaterPie');
				var myChartPie = echarts.init(chartPie);
				myChartPie.setOption(option, true);
				$('.load-box-list').hide();
			}
		});
	}

	//基础信息---查询
	function reseBasicShowInfo() {
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
			success: function(result) {

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

				$('#reseInfo').html(html);
			}
		});
	}

	$('.reser-menu ul li').click(function() {
		$(this).addClass('on').siblings().removeClass('on');
		$('.reser-box .river-con').eq($(this).index()).show().siblings().hide();
	});
});
