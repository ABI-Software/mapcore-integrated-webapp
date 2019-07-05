var physiomeportal = require("physiomeportal");
var flatmapsDialog = require("./flatmapsDialog").FlatmapsDialog;
var flatmapsModule = require("./flatmapsDialog").FlatmapsModule;
var BFCSVExporterDialog = require("./BFCSVExporterDialog").BFCSVExporterDialog;
var BFCSVExporterModule = require("./BFCSVExporterDialog").BFCSVExporterModule;
var FDIKBQueryDialog = require("./fdikbqueryDialog").FDIKBQueryDialog;
var FDIKBQueryModule = require("./fdikbqueryDialog").FDIKBQueryModule;

main = function()  {
  var moduleManager = undefined;
  var UIIsReady = true;
  var managerSidebar = undefined;
  var eventNotifier =  new physiomeportal.EventNotifier();
  var queryDialog = undefined;
  var bodyViewer = undefined;
  var _this = this;
  var BroadcastChannel = require('broadcast-channel');
  var bodyViewer = undefined;
  channel = new BroadcastChannel.default('sparc-portal');
  var lastSearchTerm = undefined;
  
  var selectionCallback = function() {
    return function(event) {
      if (event.eventType === physiomeportal.EVENT_TYPE.SELECTED) {
        if (event.identifiers.length > 0) {
          var annotation = event.identifiers[0];
    	  if (annotation.data.part) {
    		  console.log(queryDialog)
	          if (queryDialog && queryDialog.kbQuery && lastSearchTerm != annotation.data.part) {
	        	  lastSearchTerm = annotation.data.part;
	        	  queryDialog.kbQuery.query("nlx_152175-1", {q:annotation.data.part, count:10});
	          }
    		  var fma = undefined;
    		  if (annotation.data.part == "Lungs") {
    			  fma = "FMA:7195";
    		  } else if (annotation.data.part == "Liver"){
    			  fma = "FMA:7197";
    		  }
    		  if (fma) {
	    	      channel.postMessage({
	    	            "sender": "External",
	    	            "resource": undefined,
	    	            "type": fma,
	    	            "action": "select",
	    	            "data": undefined
	    	      });
    		  }
    		  bodyViewer.setSelectedByGroupName(annotation.data.part, false);
    	  }
        }
      }
    }
  }
  
  var feedbackCallback = function() {
	  return function() {
		  window.open("https://docs.google.com/forms/d/e/1FAIpQLSdogFAA7c1IRKAB5JYfbS1c_8iDdZE6zRPjIg36JAi0MLd1IA/viewform?usp=sf_link", "_blank");  
	  } 
  }

  /**
   * Initialise all the panels required for PJP to function correctly.
   * Modules used incude - {@link PJP.ModelsLoader}, {@link PJP.BodyViewer},
   * {@link PJP.OrgansViewer}, {@link PJP.TissueViewer}, {@link PJP.CellPanel}
   * and {@link PJP.ModelPanel}.
   */
  var initialiseMain = function() {
    if (moduleManager.isReady()) {
      parent = document.getElementById("MAPcorePortalArea");
      moduleManager.addConstructor("Flatmaps", flatmapsModule, flatmapsDialog ); 
      moduleManager.addConstructor("BlackfynnCSVExporter", BFCSVExporterModule, BFCSVExporterDialog ); 
      bodyViewer = moduleManager.createModule("Body Viewer");
      bodyViewer.setName("Body Viewer");
      bodyViewer.readSystemMeta();
      var bodyViewerDialog = new physiomeportal.BodyViewerDialog(bodyViewer, parent);
      bodyViewerDialog.destroyModuleOnClose = true;
      var queryModule = new FDIKBQueryModule();
      queryDialog = new FDIKBQueryDialog(queryModule, parent);
      queryModule.setName("FDI KB Query");
      queryDialog.setTitle("FDI KB Query");
      queryDialog.destroyModuleOnClose = true;
      var module = new flatmapsModule();
      var flatmapDialog = new flatmapsDialog(module, parent);
      module.setName("Flatmaps");
      flatmapDialog.setTitle("Flatmaps");
      flatmapDialog.destroyModuleOnClose = true;
      flatmapDialog.addNotifier(eventNotifier);
      bodyViewer.addNotifier(eventNotifier);
      queryDialog.addNotifier(eventNotifier);
      eventNotifier.subscribe(this, selectionCallback());
      flatmapDialog.initaliseBroadcastCallback(channel);
      managerSidebar = new physiomeportal.ManagerSidebar(parent);
      moduleManager.manageDialog(flatmapDialog);
      moduleManager.manageDialog(queryDialog);
      moduleManager.manageDialog(bodyViewerDialog);
      managerSidebar.addManager(moduleManager);
      managerSidebar.showProfileSelect();
      managerSidebar.open();
      managerSidebar.setFeedbackClickedCallback(feedbackCallback());
      managerSidebar.setWidth("12%");
      UIIsReady = true;
      bodyViewerDialog.setWidth("44%");
      bodyViewerDialog.setHeight("60%");
      queryDialog.setWidth("88%");
      queryDialog.setHeight("40%");
      flatmapDialog.setWidth("44%");
      flatmapDialog.setHeight("60%");
      queryDialog.setPosition("12%", "60%");
      bodyViewerDialog.setPosition("56%", 0);  
      flatmapDialog.setPosition("12%", 0);
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
