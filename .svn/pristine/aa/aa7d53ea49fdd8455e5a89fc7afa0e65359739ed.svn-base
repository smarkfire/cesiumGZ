///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:无UI默认 去加载或者预处理一些逻辑
/////////////////////////////////////////////////////////////////////////// 
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget' 
    ],
    function (declare,
              lang,
              array,
              html,
              BaseWidget 
    ) {
        return declare([BaseWidget], {

            startup: function() {
                this.inherited(arguments);
                 //to do something
                console.log("默认搞事情");

                //比如无去掉版权
                this.map._cesiumWidget._creditContainer.style.display = "none";
            }
 
        });
    });