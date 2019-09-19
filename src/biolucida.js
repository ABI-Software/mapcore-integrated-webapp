let physiomePortal = require("physiomeportal");
let MAPCoreBiolucidaInterfacePackage = require("@abi-software/mapcore-biolucida-interface");

let BiolucidaModule = function () {
  (physiomePortal.BaseModule).call(this);
  this.typeName = "Simulation Interface";
  let _interfaceModule = undefined;
  let state = undefined;
  let _this = this;

  this.initialise = (target, options) => {
    _interfaceModule = new MAPCoreBiolucidaInterfacePackage.MAPCoreBiolucidaInterfaceModule(target, options);
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


BiolucidaModule.prototype = Object.create(physiomePortal.BaseModule.prototype);
exports.BiolucidaModule = BiolucidaModule;

let BiolucidaDialog = (moduleIn, parentIn, options) => {
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
    _myInstance.create();
    let target = _myInstance.container[0];
    if (target) {
      target.style.padding = "0";
    }
    _myInstance.module.initialise(target, options);
    _myInstance.resizeStopCallbacks.push(resizeCallback())
  };

  initialise(options)
};

BiolucidaDialog.prototype = Object.create(physiomePortal.BaseDialog.prototype);
exports.BiolucidaDialog = BiolucidaDialog;
