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
  
  var selectedCallback = function(){
    return function(obj) {
      console.log(obj)
      if (obj && obj.__data && obj.__data.name) {
        var eventType = physiomeportal.EVENT_TYPE.SELECTED;
        for (var i = 0; i < eventNotifiers.length; i++) {
          eventNotifiers[i].publish(_myInstance, eventType, [obj.__data.name]);
        }
      }
    }
  }
  
  var highlightedCallback = function(){
    return function(obj) {
      console.log(obj)
      if (obj && obj.__data && obj.__data.name) {
        var eventType = physiomeportal.EVENT_TYPE.HIGHLIGHTED;
        for (var i = 0; i < eventNotifiers.length; i++) {
          eventNotifiers[i].publish(_myInstance, eventType, [obj.__data.name]);
        }
      }
    }
  }
  
  this.findLyphByName = function(name) {
    var found = component._graphData.lyphs.find(function(lyph) {
      return lyph.name === name;
    })
    
    return found;
  }
  
  this.getLyphLayerFromLyphName = function(name) {
    var lyph = _myInstance.findLyphByName(name);
    if (lyph)
      return lyph.layerInLyph;
    return lyph;
  }
  
  this.setSelectedByGroupName = function(name) {
    if (name) {
      var obj = _myInstance.findLyphByName(name);
      if (obj && obj.viewObjects) {
        if (component.selected != obj.viewObjects.main)
          component.selected = obj.viewObjects.main;
      } else
        component.selected = undefined;
    } else {
      component.selected = undefined;
    }
  }
  
  this.setHighlightedByGroupName = function(name) {
    if (name) {
      var obj = _myInstance.findLyphByName(name);
      if (obj && obj.viewObjects) {
        if (component.highlighted != obj.viewObjects.main)
          component.highlighted = obj.viewObjects.main;
      } else
        component.highlighted = undefined;
    } else {
      component.highlighted = undefined;
    }
  }
  
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
