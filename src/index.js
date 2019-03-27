var physiomeportal = require("physiomeportal");
var flatmapsDialog = require("./flatmapsDialog").FlatmapsDialog;

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
      var flatmapDialog = new flatmapsDialog(parent);
      flatmapDialog.setTitle("Flatmaps");
      flatmapDialog.setWidth("44%");
      flatmapDialog.setHeight("100%");
      flatmapDialog.setPosition("12%", 0);
      managerSidebar = new physiomeportal.ManagerSidebar(parent);
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
