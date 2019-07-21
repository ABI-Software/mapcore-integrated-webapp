var BlackfynnManager = require('blackfynn-csv-exporter').BlackfynnManager;
var BroadcastChannel = require('broadcast-channel');
var physiomeportal = require("physiomeportal");

var BFCSVExporterModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "Data Viewer";
	  var bc = undefined;
	  this.plotManager = undefined;
	  var state = undefined;
	  var _this = this;
	  var onMessage = function(message) {
		  _this.settingsChanged();
	  }
	  
	  this.initialise = function(parent) {
		  _this.plotManager = new BlackfynnManager(parent);
		  _this.loadFromState(state);
		  bc = _this.plotManager.openBroadcastChannel("dataviewer");
		  bc = new BroadcastChannel.default('sparc-portal');
		  bc.addEventListener('message', onMessage);
	  }
	  
	  this.loadFromState = function(stateIn) {
		  if (stateIn) {
			  if (_this.plotManager) {
				  var string = JSON.stringify(stateIn);
				  _this.plotManager.loadState(string);
				  state = undefined;
			  } else {
				  state = stateIn;
			  }
		  }
	  }
	  
	  this.loadFromString = function(string) {
		  if (string) {
			  if (_this.plotManager) {
				  _this.plotManager.loadState(string);
				  state = undefined;
			  }
		  }
	  }
	  
	  this.openCSV = function(url) {
		  _this.plotManager.openCSV(url).then(() => {
			  _this.plotManager.clearChart(); 
			  _this.plotManager.plotAll();
			  _this.settingsChanged();
		  });
	  }
	  
	  this.exportSettings = function() {
		  var settingsString = _this.plotManager.exportStateAsString();
		  if (typeof settingsString === 'string' || settingsString instanceof String) {
			  var json = JSON.parse(settingsString);
			  json.dialog = _this.typeName;
			  return json;
		  }
		  return {dialog: _this.typeName};
	  }
	  
	  this.importSettings = function(settings) {
		  _this.loadFromState(settings);
	  }

	  this.destroy = function() {
		  if (bc)
			  bc.close();
	  }
}

BFCSVExporterModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.BFCSVExporterModule = BFCSVExporterModule;

var BFCSVExporterDialog = function(moduleIn, parentIn, options) {
  (physiomeportal.BaseDialog).call(this, parentIn, options);
  this.module = moduleIn;
  var eventNotifiers = [];
  var _myInstance = this;
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }
  
  var resizeCallback = function() {
	  return function() {
		  _myInstance.module.plotManager.updateSize();
	  }
  }  
  
  var initialiseBlackfynnCSVExporterDialog = function() {
	  var target = _myInstance.container[0].querySelector("#blackfynn-panel");
	  if (target.parentElement)
		  target.parentElement.style.padding = "0";
	  _myInstance.module.initialise(target);
	  _myInstance.resizeStopCallbacks.push(resizeCallback());
  }

  var bfCSVExporterChangedCallback = function() {
    return function(module, change) {
      if (change === physiomeportal.MODULE_CHANGE.NAME_CHANGED) {
        _myInstance.setTitle(module.getName());
      }
    }
  }

  var initialise = function() {
    _myInstance.create(require("./snippets/bf.html"));
    _myInstance.module.addChangedCallback(bfCSVExporterChangedCallback());
    initialiseBlackfynnCSVExporterDialog();
  }
  
  initialise();
}

BFCSVExporterDialog.prototype = Object.create(physiomeportal.BaseDialog.prototype);
exports.BFCSVExporterDialog = BFCSVExporterDialog;
