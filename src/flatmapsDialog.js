require('./styles/flatmapsDialog.css');
var flatmap = require("./flatmaps/src/flatmap");
var physiomeportal = require("physiomeportal");
var utils = require('./flatmaps/src/utils.js');
var BroadcastChannel = require('broadcast-channel');

var FlatmapsModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "Flatmaps";
}

FlatmapsModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.FlatmapsModule = FlatmapsModule;

var FlatmapsDialog = function(moduleIn, parentIn, options) {
  var bodyId = "demo";
  var saucemanId = "static/saucerman";
  var functionalId = "static/functional";
  if (options) {
	  if (options.bodyId)
		  bodyId = options.bodyId;
	  if (options.saucemanId)
		  saucemanId = options.saucemanId;
	  if (options.functionalId)
		  functionalId = options.functionId;
  }  
  (physiomeportal.BaseDialog).call(this, parentIn, options);
  this.module = moduleIn;
  var eventNotifiers = [];
  var channel= undefined;
  var flatmapsList = [];
  var _myInstance = this;
  
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
  
  var resizeCallback = function() {
	  return function() {
		  for (var i = 0; i < flatmapsList.length; i++) {
			  flatmapsList[i].updateSize();
		  }
	  }
  }

  var loadMap = function(mapId, htmlElementId) {
	  console.log(utils.absoluteUrl(`${mapId}/`+ "index.json"));
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
    	  json.id = mapId;
    	  var myFlatmap = new flatmap.FlatMap(htmlElementId, json);
    	  if (myFlatmap) 
    		  flatmapsList.push(myFlatmap);
          return myFlatmap;
      });
  }
  
  var broadcastCallback = function(message) {
      var eventType = physiomeportal.EVENT_TYPE.SELECTED;
	  var annotation = [{}];
	  annotation[0].data = {};
      if (message.type == "FMA:7195") {
	    annotation[0].data.part = "Lungs";
	    for (var i = 0; i < eventNotifiers.length; i++) {
	      eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      } else if (message.type == "FMA:7197") {
	    annotation[0].data.part = "Liver";
	    for (var i = 0; i < eventNotifiers.length; i++) {
		  eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      }  else if (message.type == "FMA:6469") {
	    annotation[0].data.part = "Stellate Ganglia";
	    for (var i = 0; i < eventNotifiers.length; i++) {
		  eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      }
  }
  
  this.initaliseBroadcastCallback = function() {
	  channel = new BroadcastChannel.default('sparc-portal');
      channel.addEventListener('message', broadcastCallback);
  }
  
  var initialiseFlatmapsDialog = function() {
	  flatmap.loadMap(bodyId, 'map1');
 //     loadMap(saucemanId, 'map2');
 //     loadMap(functionalId, 'map3');
      _myInstance.resizeStopCallbacks.push(resizeCallback());
  }
  
  
  var flatmapsChangedCallback = function() {
    return function(module, change) {
      if (change === physiomeportal.MODULE_CHANGE.NAME_CHANGED) {
        _myInstance.setTitle(module.getName());
      }
    }
  }

  var initialise = function() {
    _myInstance.create(require("./snippets/flatmaps.html"));
    _myInstance.module.addChangedCallback(flatmapsChangedCallback());
    initialiseFlatmapsDialog();
  }
  
  initialise();
}

FlatmapsDialog.prototype = Object.create(physiomeportal.BaseDialog.prototype);
exports.FlatmapsDialog = FlatmapsDialog;
