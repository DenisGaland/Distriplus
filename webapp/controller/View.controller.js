sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Image"
], function(Controller, ODataModel, MessageBox, Filter, FilterOperator, Image) {
	"use strict";
	return Controller.extend("zdislabelmanZDISLABELMAN.controller.View", {

		onInit: function() {
			var oView = this.getView();
			jQuery.sap.delayedCall(500, this, function() {
				oView.byId("eanSearch").focus();
			});
		},

		press: function(evt) {
			var oController = this;
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "zdislabelmanZDISLABELMAN.i18n.i18n" //,
			});
			this.getView().setModel(i18nModel, "i18n");
			var ean = evt.getSource().getValue();
			var oView = this.getView();
			var config = this.getOwnerComponent().getManifest();
			var sServiceUrl = config["sap.app"].dataSources.ZDISLABELMAN_SRV.uri;
			var oData = new ODataModel(sServiceUrl, true);
			var query = "/EanCheckSet(Ean='" + ean + "')";
			oData.read(query, null, null, true, function(response) {
				var path = "";
				if (response.Type === "") {
					oView.byId("eanSearch").setValue("");
					path = $.sap.getModulePath("zdislabelmanZDISLABELMAN", "/audio");
					var aud = new Audio(path + "/MOREINFO.png");
					aud.play();
					MessageBox.error(response.Message, {
						onClose: jQuery.sap.delayedCall(500, this, function() {
							oView.byId("eanSearch").focus();
						})
					});
				} else {
					//oView.byId("imgID").setSrc("http://www.planetparfum.com/dw/image/v2/AATN_PRD/on/demandware.static/-/Sites-master-catalog-pp/default/dwecc8efac/zoom/20034670_M.jpg");
					var oImage = new Image({
						src: response.ImgUrl,
						/*press:function(){
							Message.show();
						},*/
						densityAware: false,
						width: "40%",
						error: function(oEvent) {
							path = $.sap.getModulePath("zdislabelmanZDISLABELMAN", "/photo");
							oEvent.getSource().setSrc(path + "/notfound.jpg");
						}
					});
					oController.imgUrl = oImage.getSrc();
					oView.byId("imgBox").removeAllItems();
					oView.byId("imgBox").addItem(oImage);
					oView.byId("matnr").setValue(response.Matnr);
					oView.byId("makt").setValue(response.Makt);
					oView.byId("mstae").setValue(response.Mstsb);
					oView.byId("pos").setValue(parseInt(response.StockPos));
					oView.byId("eanSearch").setEnabled(false);
					//oView.byId("message").setValue(response.Message);
					oView.byId("message").setText(response.Message);
					oView.byId("message").setVisible(true);
					/*if (response.InvZeroCheck === true) {
						oView.byId("invzero").setVisible(true);
					}*/
					oView.byId("reseButton").setVisible(true);
					oView.byId("formButton").setVisible(true);
					oView.byId("message").setVisible(true);
					oView.byId("message").setType(response.Type);
					oView.byId("price").setValue(response.Price);
				}
			}, function(error) {
				MessageBox.error(JSON.parse(error.response.body).error.message.value, {
					title: "Error"
				});
			});
		},

		printlabel: function(evt) {
			var oController = this;
			var oView = this.getView();
			var config = this.getOwnerComponent().getManifest();
			var sServiceUrl = config["sap.app"].dataSources.ZONLINE_SCAN_SRV.uri;
			var oDataModel = new ODataModel(sServiceUrl, true);
			var query = "/ItemsSet";
			var oFilter = new Filter("ZembArt", FilterOperator.EQ, "C" + "/" + this.getView().byId("eanSearch").getValue());
			oDataModel.read(query, {
				filters: [oFilter],
				success: function(oData, response) {
					var infoMsg = oView.getModel("i18n").getResourceBundle().getText("printlabelsuccess");
					MessageBox.show(infoMsg, {
						onClose: function(oAction) {
							oController.reload();
							//window.location.reload();
						}
					});
				}
			});
		},

		invzero: function(evt) {
			var oController = this;
			var oView = this.getView();
			var infoMsg = oView.getModel("i18n").getResourceBundle().getText("confirmMessage");
			var Yes = oView.getModel("i18n").getResourceBundle().getText("yes");
			var No = oView.getModel("i18n").getResourceBundle().getText("no");
			MessageBox.show(
				infoMsg, {
					actions: [Yes, No],
					onClose: function(oAction) {
						if (oAction === Yes) {
							var config = oController.getOwnerComponent().getManifest();
							var sServiceUrl = config["sap.app"].dataSources.ZPREPARE_FLUX_SRV.uri;
							var oDataModel = new ODataModel(sServiceUrl, true);
							var query = "/ItemsSet";
							var oFilter = new Filter("Zfilter", FilterOperator.EQ, "C" + "/" + oView.byId("matnr").getValue());
							oDataModel.read(query, {
								filters: [oFilter],
								success: function(oData, response) {
									infoMsg = oView.getModel("i18n").getResourceBundle().getText("InvZeroMsg");
									MessageBox.show(infoMsg, {
										onClose: function() {
											oController.reload();
											//window.location.reload();
										}
									});
								}
							});
						}
					}
				});
		},

		reload: function() {
			var oView = this.getView();
			oView.byId("eanSearch").setValue("");
			oView.byId("imgBox").removeAllItems();
			oView.byId("matnr").setValue("");
			oView.byId("makt").setValue("");
			oView.byId("mstae").setValue("");
			oView.byId("pos").setValue("");
			oView.byId("eanSearch").setEnabled(true);
			/*if (response.InvZeroCheck === true) {
				oView.byId("invzero").setVisible(true);
			}*/
			oView.byId("reseButton").setVisible(false);
			oView.byId("formButton").setVisible(false);
			oView.byId("message").setVisible(false);
			oView.byId("price").setValue("");
			oView.byId("message").setText("");
			oView.byId("message").setVisible(false);
			jQuery.sap.delayedCall(500, this, function() {
				oView.byId("eanSearch").focus();
			});
		}
	});
});