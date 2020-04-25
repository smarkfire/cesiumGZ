define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/html',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/on',
        'dojo/mouse',
        'dojo/query',
        'dojo/request/xhr',
        'dojo/topic',
        'dojo/json',
        "dojo/dom-construct",
        "libs/echarts/v4/echarts.min"
    ],
    function (declare, lang, html, _WidgetBase, _TemplatedMixin,
              on, mouse, query, xhr, topic, JSON,domConstruct,echarts) {
        return declare([_WidgetBase, _TemplatedMixin], {

            templateString: '<div style="width:100%;height:100%;"><div   style="width:100%;height:100%;" >' +
            '<div data-dojo-attach-point="boxNode" style="width:100%;height:285px;border-top:0px solid #caccdd" ></div>' +
            '<a data-dojo-attach-point="down" download="downlaod.csv"   style="position:absolute;right:10px;top:0;height:30px;border-top:0px solid #caccdd" >下载数据</a>' +
            '</div>' +
            '</div>',

            constructor: function (options, dom) {

            },
            Rad:function(d){
            	 return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
            },
            //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
            GetDistance:function(lat1,lng1,lat2,lng2){
            	 var radLat1 = this.Rad(lat1);
                 var radLat2 = this.Rad(lat2);
                 var a = radLat1 - radLat2;
                 var  b = this.Rad(lng1) - this.Rad(lng2);
                 var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
                 Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                 s = s *6378.137 ;// EARTH_RADIUS;
                 s = Math.round(s * 10000) / 10000; //输出为公里
                 return s;
            },
            modifyT:function(number,level){
            	level = level||1;
            	try{
            		//判断正数负数
                	number = number.toString().replace(/\$|\,/g, '');
                    if (isNaN(number)){
                        number = "0";
                    }
            	}catch(e){
            		return ''; 
            	}
                var sign = (number == (number = Math.abs(number)));
            	//返回的是K M G T
            	var valInfo = null;
                if (number != null && typeof(number) != "undefined") {
                    var numInput = parseFloat(number);
                    valInfo = numInput/level;
                    
                } else {
                    return ''; 
                } 
                
                if(valInfo>0&&valInfo<1){//小数
                	valInfo = valInfo.toPrecision(2);
                }else{//大于1
                	if(valInfo>=1&&valInfo<100){
                		valInfo = Number(valInfo.toPrecision(3));
                	}else if(valInfo>=100&&valInfo<=1000){
                		valInfo = Number(valInfo.toPrecision(3));
                	}else {
                		valInfo = (valInfo+"");
                		valInfo = valInfo.split(".")[0];
                	}
                }
                
            	return  (sign?"":"-")+valInfo+""; 
            	
            },
            isResize:true,
            postCreate: function () { 
            	this.inherited(arguments);
            	this.query();
            	
            	this.step = 0;
            	var lg = this.GetDistance(this.oList[0].lttd,this.oList[0].lgtd,this.oList[99].lttd,this.oList[99].lgtd);
            	this.step = lg/99;
            	this.step = Number(this.modifyT(this.step));
            	var str = "";
            	var sumDyp = 0;
           	    for(var k=0;k<this.oList.length;k++){
           		  var item =  this.oList[k];
           		  if(k==0){
           			 str+= "0,"+item.lgtd+","+item.lttd+","+item.height+"\n";
           		  }else{
           			 sumDyp+=this.step;
           			 str+= this.modifyT(sumDyp)+","+item.lgtd+","+item.lttd+","+item.height+"\n";
           		  }
           		
           	    }
           	   
               str =  encodeURIComponent(str); 
              
               this.down.href = "data:text/csv;charset=utf-8,\ufeff"+str;  
               
            },
          
            query: function () {  
                setTimeout(lang.hitch(this,function(){
                	this.createEChart(this.list);
                }),1000);
            },
            startup: function () {
            	this.inherited(arguments); 
            },
            createEChart: function (list) {
                domConstruct.empty(this.boxNode);//清空子节点

                if (list.length>0){
               
                }else{
                    domConstruct.empty(this.boxNode);
                    var content = "暂无相关站点数据";
                    var label2 = html.create('div', {
                        'class': 'paddCenter',
                        innerHTML: content
                    }, this.boxNode);

                    return;
                }

                var ids = [];
                var heights = []; 
                var sumDyp = 0;
                var index = 1;
                for (var i = 2; i < list.length; i++) {
                    var item = list[i];
                    heights.push(item.toFixed(2)); 
                    if(i==2){
                    	 ids.push(0);
                    }else{
                    	 sumDyp+=this.step;
                    	 ids.push(this.modifyT(sumDyp));
                    }
                    i++;
                    i++;
                    index++;
                }

                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(this.boxNode);

                var option = {
                    title: {
                        x:"center",
                        text: "剖面图(m)",
                        textStyle:{
                            fontSize: 14,
                            fontWeight: 'bolder',
                            color:'gray'
                        },
                        subtextStyle:{
                            fontSize: 10
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataZoom: {
                        show: false,
                        realtime: false,//true为拖动的时候就变化
                        start: 0,
                        end: 100//设置成整体样式的某个位置
                    },
                    grid:{
                        y2:25,y:25,x2:50,x:50
                    },

                    toolbox: {
                        show:false,
                        feature: {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: ids,
                            name: 'km' 
                        }
                    ],
                    yAxis : {
                        type: 'value',
                        scale:true,
                        boundaryGap: [0, '100%']
                    },

                    series: [
                        {
                        	name:'高程',
                            type:'line',
                            smooth:true,
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(255, 70, 131)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgb(255, 158, 68)'
                                    }, {
                                        offset: 1,
                                        color: 'rgb(255, 70, 131)'
                                    }])
                                }
                            },
                            data: heights
                        } 
                    ]
                };

                myChart.setOption(option);
            }
        });
    });

