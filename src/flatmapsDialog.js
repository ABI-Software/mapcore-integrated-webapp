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

  var blankMap = {
      "id": "blank",
      "size": [10000, 10000],
      "editable": true,
      "layerSwitcher": true
  };

  function loadMap(mapId, htmlElementId)
  {
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
  
  var initialiseFlatmapsDialog = function() {

      loadMap('body', 'map1');

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
