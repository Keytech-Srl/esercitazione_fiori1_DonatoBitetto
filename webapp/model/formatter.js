sap.ui.define([], () => {
	"use strict";

	const formatter = {
		currency(value) {
			return Number(value).toFixed(2) + " €";
		}
	};

	return formatter;
});
