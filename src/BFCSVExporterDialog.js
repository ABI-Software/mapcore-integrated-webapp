var physiomeportal = require("physiomeportal");

var BFCSVExporterModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "BlackfynnCSVExporter";
}

BFCSVExporterModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.BFCSVExporterModule = BFCSVExporterModule;

var BFCSVExporterDialog = function(moduleIn, parentIn) {
  (physiomeportal.BaseDialog).call(this);
  this.parent = parentIn;
  this.module = moduleIn;
  var eventNotifiers = [];
  var _myInstance = this;
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }
  
  var initialiseBlackfynnCSVExporterDialog = function() {
	    var bfCSVExporter = require('blackfynn-csv-exporter');
  }
  
  var bfCSVExporterChangedCallback = function() {
    return function(module, change) {
      if (change === physiomeportal.MODULE_CHANGE.NAME_CHANGED) {
        _myInstance.setTitle(module.getName());
      }
    }
  }

  var initialise = function() {
    _myInstance.create(require("blackfynn-csv-exporter/index.html"));
    _myInstance.module.addChangedCallback(bfCSVExporterChangedCallback());
    initialiseBlackfynnCSVExporterDialog();
  }
  
  initialise();
}

BFCSVExporterDialog.prototype = Object.create(physiomeportal.BaseDialog.prototype);
exports.BFCSVExporterDialog = BFCSVExporterDialog;
