require('./styles/flatmapsDialog.css');
var flatmap = require("./flatmaps/src/flatmap");
var physiomeportal = require("physiomeportal");
var utils = require('./flatmaps/src/utils.js');
var BroadcastChannel = require('broadcast-channel');

var FlatmapsModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "Flatmap";
	  this.mapImp = undefined;
	  var state = undefined;
	  var channel = undefined;
	  var _this = this;
	  
	  var processMessage = function(message) {
		  switch(message.action) {
			case "flatmap-activate-layer":
			case "flatmap-deactivate-layer":
				  _this.settingsChanged();
				break;
			default:
				break;
		  }
	  }
	  
	  this.initialiseBroadcastCallback = function() {
		  channel = new BroadcastChannel.default('sparc-mapcore-channel');
		  channel.onmessage = processMessage;
	  }
	  

	  this.initialise = function(flatmapEntry, target) {
		  var promise1 = mapManager.loadMap(flatmapEntry, target,
				  { fullscreenControl: false, annotatable: false });
		  promise1.then(function(returnedObject){
			  _this.mapImp = returnedObject;
			  _this.initialiseBroadcastCallback();
			  if (state) {
				  _this.mapImp.setState(state);
				  state = undefined;
			  }
			  _this.settingsChanged();
		  });
	  }
	  
	  this.exportSettings = function() {
		  if (_this.mapImp) {
			  var settings = _this.mapImp.getState();
			  settings.dialog = _this.typeName;
			  settings.name = _this.instanceName;
			  return settings;
		  }
		  return {};
	  }
	  
	  this.importSettings = function(settings) {
		  if (_this.mapImp)
			  _this.loadFromState(settings);
		  else
			  state = settings;
		  _this.setName(settings.name);
	  }
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
  var channel= undefined;
  var mapImp = undefined;
  var _myInstance = this;
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }
  
  var resizeCallback = function() {
	  return function() {
		  if (_myInstance.module.mapImp)
			  _myInstance.module.mapImp.resize();
	  }
  }


  var initialiseFlatmapsDialog = function() {
	  var target = _myInstance.container[0].querySelector("#map1");
	  if (target.parentElement)
		  target.parentElement.style.padding = "0";
	  _myInstance.module.initialise(flatmapEntry, target);
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
