sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
	"use strict";

	const controller = {
		onInit: function() {
            var oModel = this.getOwnerComponent().getModel("ides");
            oModel.read("/Zet_test_Set", {
                success: function(oData) {
                    console.log("Dati ricevuti:", oData);
                },
                error: function(oError) {
                    console.error("Errore nella lettura dei dati:", oError);
                }
            });
        },
		navigate: function (route) {
			this.getOwnerComponent().getRouter().navTo(route);
		},

		toogleExpanded: function () {
			const toolPage = this.getView().byId("toolPage");
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		}
	};

	return Controller.extend("ui5.crud.controller.App", controller);
});
