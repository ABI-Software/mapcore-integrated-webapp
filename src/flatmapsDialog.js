require('./styles/flatmapsDialog.css');
var flatmap = require("./flatmaps/src/flatmap");
var physiomeportal = require("physiomeportal");
var utils = require('./flatmaps/src/utils.js');
var BroadcastChannel = require('broadcast-channel');

var FlatmapsModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "Flatmap";
}

FlatmapsModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.FlatmapsModule = FlatmapsModule;

var FlatmapsDialog = function(moduleIn, parentIn, options) {
  var flatmapEntry = "NCBITaxon:9606";
  mapManager = new flatmap.MapManager();
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

  this.initaliseBroadcastCallback = function() {
	  channel = new BroadcastChannel.default('sparc-portal');
	  channel.addEventListener('message', broadcastCallback);
  }

  var initialiseFlatmapsDialog = function() {
	  var target = _myInstance.container[0].querySelector("#map1");
	  if (target.parentElement)
		  target.parentElement.style.padding = "0";
	  var promise1 = mapManager.loadMap(flatmapEntry, target,
			  { fullscreenControl: false, annotatable: false });
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
