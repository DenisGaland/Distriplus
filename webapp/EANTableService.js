sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "tableperso-EANTable-n1",
					order: 0,
					text: "n1",
					visible: true
				}, {
					id: "tableperso-EANTable-n2",
					order: 0,
					text: "n2",
					visible: true
				}, {
					id: "tableperso-EANTable-n3",
					order: 0,
					text: "n3",
					visible: true
				}, {
					id: "tableperso-EANTable-n4",
					order: 0,
					text: "n4",
					visible: true
				}, {
					id: "tableperso-EANTable-n5",
					order: 0,
					text: "n5",
					visible: true
				}]
			},

			getPersData: function() {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function(oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			delPersData: function() {
				var oDeferred = new jQuery.Deferred();
				oDeferred.resolve();
				return oDeferred.promise();
			}
		};

		return DemoPersoService;

	}, /* bExport= */ true);