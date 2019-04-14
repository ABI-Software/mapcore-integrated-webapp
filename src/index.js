var physiomeportal = require("physiomeportal");
var flatmapsDialog = require("./flatmapsDialog").FlatmapsDialog;
var flatmapsModule = require("./flatmapsDialog").FlatmapsModule;
var BFCSVExporterDialog = require("./BFCSVExporterDialog").BFCSVExporterDialog;
var BFCSVExporterModule = require("./BFCSVExporterDialog").BFCSVExporterModule;

main = function()  {
  var moduleManager = undefined;
  var UIIsReady = true;
  var managerSidebar = undefined;
  var _this = this;

  /**
   * Initialise all the panels required for PJP to function correctly.
   * Modules used incude - {@link PJP.ModelsLoader}, {@link PJP.BodyViewer},
   * {@link PJP.OrgansViewer}, {@link PJP.TissueViewer}, {@link PJP.CellPanel}
   * and {@link PJP.ModelPanel}.
   */
  var initialiseMain = function() {
    if (moduleManager.isReady()) {
      parent = document.getElementById("main");
      moduleManager.addConstructor("Flatmaps", flatmapsModule, flatmapsDialog ); 
      var module = new flatmapsModule();
      var flatmapDialog = new flatmapsDialog(module, parent);
      module.setName("Flatmaps");
      flatmapDialog.setTitle("Flatmaps");
      flatmapDialog.setWidth("44%");
      flatmapDialog.setHeight("100%");
      flatmapDialog.setPosition("12%", 0);
      flatmapDialog.destroyModuleOnClose = true;
      var bfmodule = new BFCSVExporterModule();
      var bfDialog = new BFCSVExporterDialog(bfmodule, parent);
      bfmodule.setName("Blackfynn CSV Exporter");
      bfDialog.setTitle("Blackfynn CSV Exporter");
      bfDialog.setWidth("44%");
      bfDialog.setHeight("100%");
      bfDialog.setPosition("56%", 0);
      bfDialog.destroyModuleOnClose = true;
      managerSidebar = new physiomeportal.ManagerSidebar(parent);
      moduleManager.manageDialog(flatmapDialog);
      moduleManager.manageDialog(bfDialog);
      
      managerSidebar.addManager(moduleManager);
      managerSidebar.open();
      managerSidebar.setWidth("12%");
      UIIsReady = true;
    } else {
      setTimeout(function(){initialiseMain()}, 1000);
    }
  }
    
  var initialise = function() {
    moduleManager = new physiomeportal.ModuleManager();
    initialiseMain();
  }

  initialise();
}


window.document.addEventListener('DOMContentLoaded', main);
