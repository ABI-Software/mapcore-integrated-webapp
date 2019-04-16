require('./styles/flatmapsDialog.css');
var flatmap = require("./flatmaps/src/flatmap");
var physiomeportal = require("physiomeportal");
var utils = require('./flatmaps/src/utils.js');

var FlatmapsModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "Flatmaps";
}

FlatmapsModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.FlatmapsModule = FlatmapsModule;

var FlatmapsDialog = function(moduleIn, parentIn) {
  (physiomeportal.BaseDialog).call(this);
  this.parent = parentIn;
  this.module = moduleIn;
  var eventNotifiers = [];
  var _myInstance = this;
  var channel = undefined;
  
  this.getLyphLayerFromLyphName = function(name) {
    var lyph = _myInstance.findLyphByName(name);
    if (lyph)
      return lyph.layerInLyph;
    return lyph;
  }
  
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }

  var blankMap = {
      "id": "blank",
      "size": [10000, 10000],
      "editable": true,
      "layerSwitcher": true
  };

  var loadMap = function(mapId, htmlElementId) {
      fetch(utils.absoluteUrl(`${mapId}/`+ "index.json"), {
          headers: { "Accept": "application/json; charset=utf-8" },
          method: 'GET'
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(`Couldn't fetch '${mapId}' map`);
      })
      .then(json => {
          return new flatmap.FlatMap(htmlElementId, json);
      });
  }
  
  var broadcastCallback = function(message) {
	  console.log(message);
      var eventType = physiomeportal.EVENT_TYPE.SELECTED;
	  var annotation = [{}];
	  annotation[0].data = {};
      if (message.type == "FMA:7195") {
	    annotation[0].data.part = "Lung";
	    for (var i = 0; i < eventNotifiers.length; i++) {
	      eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      } else if (message.type == "FMA:7197") {
	    annotation[0].data.part = "Liver";
	    for (var i = 0; i < eventNotifiers.length; i++) {
		  eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      }
  } 
  
  var initialiseFlatmapsDialog = function() {
      loadMap('body', 'map1');
      loadMap('functional', 'map2');
      loadMap('saucerman', 'map3');
      var BroadcastChannel = require('broadcast-channel');
      channel = new BroadcastChannel.default('sparc-portal');
      channel.addEventListener('message', broadcastCallback);
  }
  
  
  var flatmapsChangedCallback = function() {
    return function(module, change) {
      if (change === physiomeportal.MODULE_CHANGE.NAME_CHANGED) {
        _myInstance.setTitle(module.getName());
      }
    }
  }

  var initialise = function() {
    _myInstance.create(require("./flatmaps/index.html"));
    _myInstance.module.addChangedCallback(flatmapsChangedCallback());
    initialiseFlatmapsDialog();
  }
  
  initialise();
}

FlatmapsDialog.prototype = Object.create(physiomeportal.BaseDialog.prototype);
exports.FlatmapsDialog = FlatmapsDialog;
