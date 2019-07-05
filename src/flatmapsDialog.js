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
  var flatmapEntry = "demo";
  if (options) {
	  if (options.flatmapEntry)
		  flatmapEntry = options.flatmapEntry;
  }  
  (physiomeportal.BaseDialog).call(this, parentIn, options);
  this.module = moduleIn;
  var eventNotifiers = [];
  var channel= undefined;
  var mapImp = undefined;
  var _myInstance = this;
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }
  
  var resizeCallback = function() {
	  return function() {
		  if (mapImp)
			  mapImp.resize();
	  }
  }

  var broadcastCallback = function(message) {
      var eventType = physiomeportal.EVENT_TYPE.SELECTED;
	  var annotation = [{}];
	  annotation[0].data = {};
      if (message.data.models == "UBERON:0002167" || message.data.models == "UBERON:0002168") {
	    annotation[0].data.part = "Lungs";
	    for (var i = 0; i < eventNotifiers.length; i++) {
	      eventNotifiers[i].publish(_myInstance, eventType, annotation);
	    }
      }  else if (message.data.models == "UBERON:0002298") {
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
	  var promise1 = flatmap.loadMap(flatmapEntry, 'map1',  { fullscreenControl: false, annotatable: false });
	  promise1.then(function(returnedObject){
		  mapImp = returnedObject;
	  });
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
