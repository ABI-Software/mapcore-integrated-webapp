var physiomeportal = require("physiomeportal");
var BlackfynnManager = require('blackfynn-csv-exporter').BlackfynnManager;

var BFCSVExporterModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "BlackfynnCSVExporter";
	  var _this = this;
	  
	  this.initialise = function() {
		  _this.blackfynnManger = new BlackfynnManager();	  
	  }
	  
	  this.openCSV = function(url) {
		  _this.blackfynnManger.openCSV(url).then(() => {
			  _this.blackfynnManger.updateSize();
		  });
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
		  _myInstance.module.blackfynnManger.updateSize();
	  }
  }  
  
  var initialiseBlackfynnCSVExporterDialog = function() {
	  _myInstance.module.initialise();
	  _myInstance.module.blackfynnManger.initialiseBlackfynnPanel();
	  _myInstance.resizeStopCallbacks.push(resizeCallback());
	  //_myInstance.module.blackfynnManger.updateSize();
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
