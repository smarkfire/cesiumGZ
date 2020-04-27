///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述: 雨水情信息
///////////////////////////////////////////////////////////////////////////
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    "dojo/topic",
    'jimu/BaseWidget',
    'dojo/on',
    'dstore/Memory',
    'dstore/Trackable',
    'dgrid/Grid',
    'dgrid/Keyboard',
    'dgrid/Selection',
    'dstore/RequestMemory',
    'dgrid/test/data/createSyncStore',
    './CommonPointLayer3D',
    'libs/laydate/laydate.js',
     "libs/jquery.pagination"
],

function (declare,
    lang,
    array,
    html,
    topic,
    BaseWidget,
    on,
    Memory,
    Trackable,
    Grid,
    Keyboard,
    Selection,
    RequestMemory,
    createSyncStore,
    CommonPointLayer3D,
    laydate
) {

    return declare([BaseWidget], {
        baseClass: 'jimu-widget-YuShuiQing',
        name: 'YuShuiQing',
        layer: null,
        dataList:[],
        startup: function () {
            var self = this;
            var flag = true;
            // 降水开始与结束时间
            laydate.render({
                elem: '#inpstart', //指定元素
                type: "datetime",
                format: 'yyyy-MM-dd HH:mm',
                btns: ['confirm'],
                done: function (value) {
                    $($(this)[0].elem[0]).val(value)
                }
            });
            laydate.render({
                elem: '#inpend', //指定元素
                type: "datetime",
                format: 'yyyy-MM-dd HH:mm',
                btns: ['confirm'],
                done: function (value) {
                    $($(this)[0].elem[0]).val(value)
                }
            });

            this.inherited(arguments);
            /**
             * this 指向重新赋值
             */
            // 定义请求地址
            
            this.layer = new CommonPointLayer3D({
                id: 'sqLayer',
                map: this.map
            });

            $('.liclick').on('click', function () {
                if (flag == false) return;
                flag = false;
                $('.load-box-list').show();
                // 当前选中添加类名，兄弟移除类名
                $(this).addClass("on").siblings().removeClass("on").addClass("offs");
                // 获取当前选中的文本
                var txt = $(this).text();
                // 调方法，将文本传进去，做判断，是否显示或者隐藏
                self.tab(txt);
                // 做判断，定义请求地址，和请求参数
                if (txt == '河道站') {
                    url = "http://www.sw797.com:82/blade-ycreal/riverr/selectRiver";
                    data = {};
                } else if (txt == '降水站') {
                    // 获取年月日
                    var dateTime = new Date();
                    var moon = dateTime.getFullYear(); // 获取完整的年份 4位数
                    var currDataM = dateTime.getMonth() + 1; // 获取当前月份，0是1月，所以+1
                    var currDataR = dateTime.getDate(); // 获取当前日，1-31日
                    var currDataH = dateTime.getHours(); // 获取当前小时数0-23
                    var currDataDd = dateTime.getMinutes(); // 获取分钟数
                    // 获取开始时间
                    var startTime = moon + '-' + currDataM + '-' + currDataR + ' ' + '08:00';
                    // 当前时间，也就是结束时间
                    var endTime = moon + '-' + currDataM + '-' + currDataR + ' ' + currDataH + ':' + currDataDd;
                    url = "http://www.sw797.com:82/blade-ycreal/pptnr/selectPptnStation";
                    data = {
                        dateBegin: startTime,
                        dateEnd: endTime
                    };
                } else if (txt == '水库站') {
                    url = "http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvrAllList";
                    data = {};
                }
                // 调用方法，发送请求
                self.postUrl(url, data, self, txt);
                flag = true;
            });
            // 当为河道站的时候的查询点击事件
            $("#firstPage .zd_quy").click(function () {
                // 调方法
                self.hdAjaxQuery();
            });
            // 当为水库站的时候的查询点击事件
            $("#thirdPage .zd_quy").click(function () {
                // 调方法
                self.sdAjaxQuery();
            });
            // 当为降水站的时候的查询点击事件
            $("#daterquer").click(function () {
                // 获取开始时间
                var star = $('#inpstart').val();
                // 获取结束时间
                var end = $('#inpend').val();
                // 将表格内部清空
                $(".location-box-list").empty();

                // 发送请求
                self.postUrl("http://www.sw797.com:82/blade-ycreal/pptnr/selectPptnStation",{dateBegin: star,
                    dateEnd: end},self,"降水站");

            });
        },

        onMinimize: function () {
            this.resize();
        },

        onMaximize: function () {
            this.resize();
        },

        onOpen: function () {
            //面板打开的时候触发 （when open this panel trigger）
            this.layer ? this.layer.setVis(true) : '';
            var url = "http://www.sw797.com:82/blade-ycreal/riverr/selectRiver";
            var data = {};
            $('.load-box-list').show();
            this.postUrl(url, data, this, "河道站");
        },

        onClose: function () {
            //面板关闭的时候触发 （when this panel is closed trigger）
            this.layer ? this.layer.setVis(false) : '';
        },

        resize: function () {

        },

        destroy: function () {
            this.inherited(arguments);
        },

        //关键字过滤
        query: function () {
            var text = this.keyNode.value;
            if (text != "" && text.length > 0) {
                var list = array.filter(this.datas, function (g) {
                    if (g.name.indexOf(text) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }, this);
                this.grid.refresh();
                this.grid.renderArray(list);
                //同时显示到layer
                this.layer.getData(list);
            } else {
                this.grid.refresh();
                this.grid.renderArray(this.datas);
                //同时显示到layer
                this.layer.getData(this.datas);
            }
        },

        //http://dgrid.io/tutorials/1.0/hello_dgrid/    创建表格，给表格项添加点击事件，在地图上添加实体
        createList: function (dataList, txt) {
            $('#tablist .location-box-list').empty();
            var CustomGrid = declare([Grid, Keyboard, Selection]);
            var column, tab, moon, dauy;
            if (txt == "河道站") {
                column = {
                    xh:'序号',
                    STNM: '站点',
                    TM: '时间',
                    Z: '水位(m)',
                    Q: '流量(m³/s)'
                }
                tab = 'sq-tab1-grid'
            } else if (txt == "降水站") {
                column = {
                    xh:'序号',
                    STNM: '站点',
                    ADDVCD5: '所在县',
                    DRP: '雨量/mm'
                }
                tab = 'sq-tab2-grid'
            } else if (txt == "水库站") {
                column = {
                    xh:'序号',
                    STNM: '站点',
                    TM: '时间',
                    RZ: '水位(m)',
                    W: '蓄水量(m3)'
                }
                tab = 'sq-tab3-grid'
            }
            var grid = new CustomGrid({
                columns: column,
                selectionMode: 'single', // for Selection; only select a single row at a time
                cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
            }, tab);
            grid.startup();
            
            grid.on('dgrid-select', function (event) {
                topic.publish("gis/map/setCenter", {
                    'lgtd': event.rows[0].data.LGTD,
                    'lttd': event.rows[0].data.LTTD
                }); //进行地图定位
            });
            //同时显示到layer
            grid.renderArray(dataList);

            // this.layer.getData(dataList, txt, this);
            // this.grid = grid;
            $('.load-box-list').hide();
        },

        // 控制显示隐藏
        tab: function (pid) {
            if (pid == "河道站") {
                document.getElementById('secondPage').style.display = "none";
                document.getElementById('thirdPage').style.display = "none";
                document.getElementById('firstPage').style.display = "block";
            } else if (pid == "降水站") {
                document.getElementById('thirdPage').style.display = "none";
                document.getElementById('firstPage').style.display = "none";
                document.getElementById('secondPage').style.display = "block";
            } else if (pid == "水库站") {
                document.getElementById('firstPage').style.display = "none";
                document.getElementById('secondPage').style.display = "none";
                document.getElementById('thirdPage').style.display = "block";
            }
        },

        // 发送请求，获取数据
        postUrl: function (url, data, self, txt) {
            $.ajax({
                url: url,
                data: data,
                dataType: "json",
                type: "post",
                success: function (message) {
                    var megList = {
                        "data": []
                    };
                    var maxNum = [],
                        emtNum = [],
                        nulNum = [];
                    for (var i = 0; i < message.data.length; i++) {
                        if (message.data[i] != "" && message.data[i].LTTD && message.data[i].LGTD) {
                            if (message.data[i].Q && message.data[i].Q > 0 || message.data[i].DRP && message.data[i].DRP > 0 || message.data[i].W && message.data[i].W > 0) {
                                maxNum.push(message.data[i]);
                            } else if (message.data[i].Q == 0 || message.data[i].DRP == 0 || message.data[i].W == 0) {
                                emtNum.push(message.data[i]);
                            } else if (!message.data[i].Q || !message.data[i].DRP || !message.data[i].W) {
                                nulNum.push(message.data[i]);
                            }
                        }
                    }


                    megList.data = maxNum.concat(emtNum, nulNum);
                    self.datas = megList;
                    megList.data.forEach(function (item,index) {
                        item.xh = index + 1;
                    });

                    var dataList = megList.data;
                    for (var i = 0; i < dataList.length; i++) {
                        // this.map.entities.removeById(dataList[i].id);
                        if (dataList[i].TM && dataList[i].TM != null && txt == "河道站" || dataList[i].TM && dataList[i].TM != null && txt == "水库站") {

                            /**
                             * @moon  string，月,日
                             * @dauy  string, 时，分
                             *
                             */
                            moon = dataList[i].TM.substr(5, 5);
                            dauy = dataList[i].TM.substr(11, 5);
                            dataList[i].TM = moon + ' ' + dauy;
                        }
                        if (!dataList[i].Q) {
                            dataList[i].Q = '/'
                        };
                        if (!dataList[i].DRP) {
                            dataList[i].DRP = '/'
                        };
                        if (!dataList[i].W) {
                            dataList[i].W = '/'
                        };
                        if (!dataList[i].Z) {
                            dataList[i].Z = '/'
                        };
                        if (!dataList[i].RZ) {
                            dataList[i].RZ = '/'
                        };
                    }

                    self.dataList = megList.data;
                    self.pageColor(megList.data, txt);
                },
            });
        },


        pageColor: function(message,txt){
            var self = this;
            self.dataList = message;
            //地图生成实体点
            self.layer.getData(message, txt, this);

            var cont = Math.ceil(message.length/25);
            $('.Pagination').pagination({
                mode: 'fixed',
                jump: true,
                coping: false,
                pageCount: cont,
                callback: function (index) {
                    var listdata= [];
                    //显示页数
                    var index = (index.getCurrent()-1)*25;
                    for (var i =index;i<index+25;i++ ){
                        listdata.push(message[i]);
                        if (i == message.length-1){
                            break;
                        }
                    }
                    self.createList(listdata, txt);
                    self.layer.updateColor(listdata,txt);
                }
            });

            //首次加载前25条数据
            var data= [];
            if (message.length > 25){
                for (var i = 0;i<25;i++){
                    data.push(message[i]);
                }
            }else{
                for (var i = 0;i<message.length;i++){
                    data.push(message[i]);
                }
            }

            self.createList(data, txt);
            self.layer.updateColor(data,txt);
        },

        // 河道站的查询方法
        hdAjaxQuery: function () {
            // 将表格内容清空
            $(".location-box-list")[0].innerHTML = '';
            // 将地图上的实体清空
            var that = this;
            // 获取选择的区域的编码
            sel_text = $("#firstPage .select").find("option:selected").attr('value');
            // 定义访问地址
            var url_sq;
            // 获取文本框输入的字
            var inp_text = $(".zd_inp").val();
            if (sel_text == 360700) {
                url_sq = "http://www.sw797.com:82/blade-ycreal/riverr/selectRiverList?&name=" + inp_text + "&sttp=ZZ";
            } else {
                url_sq = "http://www.sw797.com:82/blade-ycreal/riverr/selectRiverList?addvcd=" + sel_text + "&name=" + inp_text + "&sttp=ZZ";
            }
            url_sq = encodeURI(url_sq);

            this.postUrl(url_sq,"",this,"河道站");

            },

        // 和上一个类似，水库站的查询方法
        sdAjaxQuery: function () {
            $("#sq-tab3-grid")[0].innerHTML = '';
            var sel_text = $("#thirdPage .select").find("option:selected").attr('value');
            var ind_text = $('#skName').val();
            var url_sq;
            if (sel_text == 360700) {
                url_sq = 'http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvr?name=' + ind_text + '&sttp=RR';
            } else {
                url_sq = "http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvr?addvcd=" + sel_text + "&name=" + ind_text + "&sttp=RR";
            }
            this.postUrl(url_sq,"",this,"水库站");
        }
    });
});