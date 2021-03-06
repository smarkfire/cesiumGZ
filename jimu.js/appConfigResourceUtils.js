define([
    'dojo/Deferred',
    'dojo/promise/all',
    'jimu/portalUtils',
    'jimu/utils'

  ],
  function(Deferred, all, portalUtils, jimuUtils) {
    return {
      AddResourcesToItemForAppSave: function(portalUrl, resourcesUrls, originItemId, newItemId) {
        //Add resources to item, based on the existing virtual resources url to determine the path and file name
        //resourcesUrls:[{resUrl:required,b64}]
        resourcesUrls = resourcesUrls || [];
        if (resourcesUrls.length === 0) {
          var deferred = new Deferred();
          deferred.resolve(resourcesUrls);
          return deferred;
        }
        var getBlobDefs = resourcesUrls.map(function(item) {
          var prefix_FileName = item.resUrl.split('resources/')[1];
          var getBlobDef = new Deferred();
          if (item.b64) {
            var blobFile = jimuUtils.b64toBlob(item.b64);
            getBlobDef.resolve({
              blob: blobFile,
              fileName: prefix_FileName.split('/')[1],
              prefixName: prefix_FileName.split('/')[0]
            });
          } else {
            var retUrl = item.resUrl;
            if (retUrl.indexOf('${itemId}') > 0) {
              retUrl = retUrl.replace('${itemId}', originItemId);
            }
            jimuUtils.resourcesUrlToBlob(retUrl).then(function(result) {
              getBlobDef.resolve({
                blob: result,
                fileName: prefix_FileName.split('/')[1],
                prefixName: prefix_FileName.split('/')[0]
              }, function(err) {
                console.error(err.message || err);
                getBlobDef.reject(err);
              });
            });
          }
          return getBlobDef;
        });
        return all(getBlobDefs).then(function(result) {
          if (result instanceof Array && result.length > 0) {
            var uploadDefs = result.map(function(e) {
              var itemId = originItemId;
              if (newItemId) {
                itemId = newItemId;
              }
              return portalUtils.addResource(portalUrl, itemId, e.blob, e.fileName, e.prefixName);
            }.bind(this));
            return all(uploadDefs).then(function(results) {
              return results;
            });
          }
        }.bind(this));
      }
    };
  });