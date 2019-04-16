var FDI_KB_Query = require("fdikbquery").FDI_KB_Query;
var physiomeportal = require("physiomeportal");

var FDIKBQueryModule = function() {
	  (physiomeportal.BaseModule).call(this);
	  this.typeName = "FDI KB Query";
}

FDIKBQueryModule.prototype = Object.create(physiomeportal.BaseModule.prototype);
exports.FDIKBQueryModule = FDIKBQueryModule;

var FDIKBQueryDialog = function(moduleIn, parentIn) {
  (physiomeportal.BaseDialog).call(this);
  this.parent = parentIn;
  this.module = moduleIn;
  var eventNotifiers = [];
  this.kbQuery = undefined;
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
  
  
  this.addNotifier = function(eventNotifier) {
    eventNotifiers.push(eventNotifier);
  }
  
  var initialiseFDIKBQueryDialog = function() {
		var drawingDiv = _myInstance.container[0].querySelectorAll("#kb_query_div")[0];
		_myInstance.kbQuery = new FDI_KB_Query(drawingDiv);
  }
  
  var FDIKBQueryChangedCallback = function() {
    return function(module, change) {
      if (change === physiomeportal.MODULE_CHANGE.NAME_CHANGED) {
        _myInstance.setTitle(module.getName());
      }
    }
  }

  var initialise = function() {
    _myInstance.create(require("fdikbquery/static/index.html"));
    _myInstance.module.addChangedCallback(FDIKBQueryChangedCallback());
    initialiseFDIKBQueryDialog();
  }
  
  initialise();
}

FDIKBQueryDialog.prototype = Object.create(physiomeportal.BaseDialog.prototype);
exports.FDIKBQueryDialog = FDIKBQueryDialog;
