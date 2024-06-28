sap.ui.define(["sap/ui/core/UIComponent"], (UIComponent) => {
	"use strict";
	return UIComponent.extend("ui5.crud.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json",
		},
		init() {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},
	});
});
