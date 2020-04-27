/***
* amd loader plugin which is used to load modules by sequence.
* mainly, this plugin is used to load js files which is not a amd module.
***/
define([
  "dojo/Deferred",
  "dojo/promise/all"
], function(Deferred, all) {
  var require;
  function doLoad(modules){
    var currentIndex = 0, allDefs = [], i, def;
    for(i = 0; i < modules.length; i++){
      def = new Deferred();
      def.module = modules[i];
      allDefs.push(def);
    }

    loadModule(allDefs, currentIndex);

    return allDefs;
  }

  function loadModule(allDefs, currentIndex){
    if(currentIndex + 1 > allDefs.length){
      return;
    }
    require([allDefs[currentIndex].module], function(){
      allDefs[currentIndex].resolve();
      currentIndex ++;
      loadModule(allDefs, currentIndex);
    });
  }
  return {
    load: function(id, _require, callback) {
      var parts = id.split(",");
      require = _require;
      if (parts.length === 0) {
        callback(null);
      } else {
        all(doLoad(parts)).then(function(){
          callback();
        });
      }
    }
  };
});