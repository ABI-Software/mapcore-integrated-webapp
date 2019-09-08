let physiomePortal = require("physiomeportal");
let MAPCoreOSparcRemoteInterfacePackage = require("@abi-software/mapcore-osparc-remote-interface");

let SimulationModule = function () {
  (physiomePortal.BaseModule).call(this);
  this.typeName = "Simulation Interface";
  let _interfaceModule = undefined;
  let state = undefined;
  let _this = this;

  this.initialise = function (options) {
    console.log("initialise simulation module");
    console.log(options);
    _interfaceModule = new MAPCoreOSparcRemoteInterfacePackage.MAPCoreOSparcRemoteInterfaceModule(options);
  };

  this.createUi = function() {
    console.log("Create UI.");
    console.log(_interfaceModule);
    return _interfaceModule.createUi()
  };

  this.loadFromState = function (stateIn) {
    if (stateIn) {
      state = stateIn;
    }
  };

  this.loadFromString = function (string) {
    if (string) {
      state = undefined;
    }
  };

  this.exportSettings = function () {
    let settingsString = undefined;
    if (typeof settingsString === 'string' || settingsString instanceof String) {
      let json = JSON.parse(settingsString);
      json.dialog = _this.typeName;
      json.name = _this.instanceName;
      return json;
    }
    return {dialog: _this.typeName, name: _this.instanceName};
  };

  this.importSettings = function (settings) {
    console.log("import settings");
    console.log(settings)
  };

  this.destroy = function () {
    physiomePortal.BaseModule.prototype.destroy.call(_this)
  };
};


SimulationModule.prototype = Object.create(physiomePortal.BaseModule.prototype);
exports.SimulationModule = SimulationModule;

let SimulationDialog = function (moduleIn, parentIn, options) {
  (physiomePortal.BaseDialog).call(this, parentIn);
  this.module = moduleIn;
  let _myInstance = this;

  this.addNotifier = function (eventNotifier) {
  };

  let resizeCallback = function () {
    return function () {
      // _myInstance.module.updateSize();
    }
  };

  let initialise = function (options) {
    _myInstance.module.initialise(options);
    _myInstance.create(_myInstance.module.createUi());
    let target = _myInstance.container[0];
    if (target) {
      target.style.padding = "0";
    }
    _myInstance.resizeStopCallbacks.push(resizeCallback())
  };

  initialise(options)
};

SimulationDialog.prototype = Object.create(physiomePortal.BaseDialog.prototype);
exports.SimulationDialog = SimulationDialog;
