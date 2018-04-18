PackageName.controller('viewCampaign', viewCampaign);

viewCampaign.$inject = [ '$http', '$rootScope', '$state', '$stateParams',
'Alertify', '$uibModal', 'DTOptionsBuilder', '$scope', 'Upload',
'$timeout', 'campaign','companyBranch',  'CampaignsService', 'DateConverter',
'$uibModalInstance' ];

function viewCampaign($http, $rootScope, $state, $stateParams, Alertify,
	$uibModal, DTOptionsBuilder, $scope, Upload, $timeout, campaign,companyBranch, 
	CampaignsService, DateConverter, $uibModalInstance) {
	var vm = this;
	vm.campaign = angular.copy(campaign);
	vm.nextQst = nextQst;
	vm.previousQst = previousQst;
	vm.updateBrief = updateBrief;
	vm.showAssets = showAssets;
	vm.updateCampaignKredits = updateCampaignKredits;
	vm.updateAssets = updateAssets;
	vm.addInfo = addInfo;
	vm.subtractQty = subtractQty;
	vm.addQty = addQty;
	vm.selectAll = selectAll;
	vm.selectAllUserPerms = selectAllUserPerms;
	vm.removeAsset = removeAsset;
	vm.clearCampaignUser = clearCampaignUser;
	vm.addCampaignUser = addCampaignUser;
	vm.updateUserCampaignPerms = updateUserCampaignPerms;
	vm.dismiss = dismiss;
	vm.curQst = 0;
	vm.removeMembers = removeMembers;
	vm.addAsset = addAsset;
	vm.add = add;
	vm.assetcreditchage = assetcreditchage;

	vm.uibModalInstance = $uibModalInstance;
	onLoading();

	vm.prev = false;
	vm.next = false;

	// calculate total  
	function calculatetotal(){
		vm.totalasset =0;
		if(vm.campaign.campaignAssets != undefined) {
			angular.forEach(vm.campaign.campaignAssets , function(key, value) {
				vm.totalasset += parseFloat(key.eachAssetKredits)
			});
		}
		

	}
	function dismiss() {
		vm.uibModalInstance.dismiss();
	}

	function onLoading() {
		vm.branchAddress = angular.copy(companyBranch.address);
		vm.company = angular.copy(companyBranch.company);
		console.log(companyBranch.company);

		$http.get('json/currency-list.json').success(function (data) {				
			vm.currencyList = data.currency;
		});

		var reqObj = {
			"campaign" : {
				"campaignId" : campaign.campaignId
			}

		}

		CampaignsService
		.getCampaign(reqObj)
		.then(
			function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					angular.copy(response.campaign, vm.campaign);
					DateConverter
					.convertArray(vm.campaign.campaignAssets);
					DateConverter.convertArray(vm.campaign.company);
					DateConverter
					.convertArray(vm.campaign.userCampaigns);
					DateConverter
					.convertArray(vm.campaign.documents);
					for ( var i = 0; i < vm.campaign.campaignAssets.length; i++) {
						DateConverter
						.convertElement(vm.campaign.campaignAssets[i].asset);
					}
					if (vm.campaign.campaignBriefs != undefined
						&& vm.campaign.campaignBriefs.length > 0) {
						vm.campaign.campaignBriefs[0].show = true;
				}

				if (campaign.permissionList != undefined
					|| campaign.permissionList != null) {
					vm.campaign.permissionList = angular
				.copy(campaign.permissionList);
			}
			calculatetotal();

		} else if (response.responseStatus.actionStatus == "WARNING") {
			Alertify.warning(response.responseStatus.message);
		} else {
			Alertify.error(response.responseStatus.message);
		}

	});

		CampaignsService
		.getAssetGroups(reqObj)
		.then(
			function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					vm.assetGroups = response.assetGroups;
					DateConverter.convertArray(vm.assetGroups);
					for ( var i = 0; i < vm.assetGroups.length; i++) {
						DateConverter
						.convertArray(vm.assetGroups[i].assetSubGroups);
					}
				} else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

			});
		if (campaign.permissionList == undefined
			|| campaign.permissionList == null
			|| campaign.permissionList.length == 0) {
			CampaignsService.getCampaignPerms(reqObj).then(function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					campaign.permissionList = response.campaignPermissions;
					vm.campaign.permissionList = response.campaignPermissions;
					DateConverter.convertArray(vm.campaign.permissionList);
				} else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

			});
	}

}

vm.dtOptions = {
	'searching' : false,
	'info' : false,
	'dom' : '<"top"i>rt<"bottom"flp><"clear">',
	"aoColumnDefs" : [ {
		"Sort" : false,
		"aTargets" : [ 0 ]
	} ]
};

function nextQst() {
	if (vm.curQst < vm.campaign.campaignBriefs.length - 1) {
		for ( var i = 0; i < vm.campaign.campaignBriefs.length; i++) {
			vm.campaign.campaignBriefs[i].show = false;
		}
		vm.curQst++;
		vm.campaign.campaignBriefs[vm.curQst].show = true;
	}
}

function previousQst() {
	if (vm.curQst > 0) {
		for ( var i = 0; i < vm.campaign.campaignBriefs.length; i++) {
			vm.campaign.campaignBriefs[i].show = false;
		}
		vm.curQst--;
		vm.campaign.campaignBriefs[vm.curQst].show = true;
	}
}

function updateBrief(curQst) {
	
}

function showAssets() {
	if (vm.selectedAssetSubGroup.assets == null
		|| vm.selectedAssetSubGroup.assets == undefined
		|| vm.selectedAssetSubGroup.assets.length == 0) {

		var reqObj = {

			"campaign" : {
				"campaignId" : campaign.campaignId
			},

			"assetSubGroup" : vm.selectedAssetSubGroup

		}
		CampaignsService
		.getAssets(reqObj)
		.then(
			function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					vm.selectedAssetSubGroup.assets = response.assetSubGroup.assets;
					DateConverter
					.convertArray(vm.selectedAssetSubGroup.assets);
				} else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}
			});
	}
}

function addAsset(asset) {

	if (vm.campaign != null && vm.campaign != undefined) {
		if (vm.campaign.campaignAssets == null
			|| vm.campaign.campaignAssets == undefined
			|| vm.campaign.campaignAssets.length == 0) {
			vm.campaign.campaignAssets = [];
	}

	var temp = vm.campaign.campaignAssets.filter(function(tr) {
		return tr.asset.id == asset.id;
	});

	if (temp == null || temp == undefined || temp.length == 0) {
		var campAsst = {
			"additionalInfo" : "",
			"assetQuantity" : 1,
			"eachAssetKredits" : asset.kredits,
			"totalKredits" : asset.kredits,
			"asset" : asset
				// "campaign" : vm.campaign
			}

			vm.campaign.campaignAssets.push(campAsst);
			vm.updateCampaignKredits();

			vm.haveAssets = true;
		} else {
			Alertify.warning("The asset already added!");
		}

	}

}

function addQty(campaignAsset) {
	if (campaignAsset.assetQuantity == null
		|| campaignAsset.assetQuantity == undefined
		|| campaignAsset.totalKredits == null
		|| campaignAsset.totalKredits == undefined) {
		campaignAsset.assetQuantity = 1;
	campaignAsset.totalKredits = campaignAsset.asset.kredits;
}

campaignAsset.assetQuantity += 1;
campaignAsset.totalKredits = campaignAsset.assetQuantity
* campaignAsset.asset.kredits;

vm.updateCampaignKredits();
}

	// Substract Quantity

	function subtractQty(campaignAsset) {
		if (campaignAsset.assetQuantity == null
			|| campaignAsset.assetQuantity == undefined
			|| campaignAsset.totalKredits == null
			|| campaignAsset.totalKredits == undefined) {
			campaignAsset.assetQuantity = 1;
		campaignAsset.totalKredits = campaignAsset.asset.kredits;
	}
	if (campaignAsset.assetQuantity >= 2) {
		campaignAsset.assetQuantity -= 1;
		campaignAsset.totalKredits = campaignAsset.assetQuantity
		* campaignAsset.asset.kredits;
	}
	vm.updateCampaignKredits();
}

function updateCampaignKredits() {
	vm.campaign.totalKredits = 0;
	for ( var i = 0; i < vm.campaign.campaignAssets.length; i++) {
		vm.campaign.totalKredits += vm.campaign.campaignAssets[i].totalKredits;
	}
}

function updateAssets() {
	var temp = angular.copy(vm.campaign);
	delete temp.companyBranch;
	delete temp.campaignBriefs;
	delete temp.supportingMaterials;
	delete temp.createdDate;
	delete temp.modifiedDate;

	var reqObj = {
		"campaign" : temp
	}

	CampaignsService.updateAssets(reqObj).then(function(response) {
		if (response.responseStatus.actionStatus == "SUCCESS") {
			campaign.camaignAssets = response.campaign.campaignAssets;
			Alertify.success(response.responseStatus.message);
			vm.dismiss();

		} else if (response.responseStatus.actionStatus == "WARNING") {
			Alertify.warning(response.responseStatus.message);
		} else {
			Alertify.error(response.responseStatus.message);
		}
	});
}

function selectAll() {
	for ( var i = 0; i < vm.campaign.campaignAssets.length; i++) {
		vm.campaign.campaignAssets[i].selected = vm.campaign.allSelected;
	}

}

function selectAllUserPerms() {
	for ( var i = 0; i < vm.campaign.userCampaigns.length; i++) {
		vm.campaign.userCampaigns[i].selected = vm.campaign.userPemAllSelected;
	}

}

function removeAsset() {
	vm.campaign.campaignAssets = vm.campaign.campaignAssets
	.filter(function(ast) {
		return ast.selected != true;
	});
	vm.campaign.allSelected = false;
}

function uploadFileFromPool(file) {
		// var file = $scope.myFile;
		file.showSpinner = true;
		var reqObj = {
			"campaign" : {
				"campaignId" : vm.campaign.campaignId
			}
		};

		CampaignService.addSupportingMaterials(file, reqObj).then(
			function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					removeFileFromPool(file);
					DateConverter.convertElement(response.document);
					vm.uploadedFiles.push(response.document);
					Alertify.success(response.responseStatus.message);
					file.showSpinner = false;
				} else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

			});
	}

	$scope.items = [];

	function add() {
		$scope.items.push({
			inlineChecked : false,
			question : "",
			questionPlaceholder : "foo",
			text : ""
		});
	}
	;

	$scope.upload = function(files) {
		if (files && files.length) {
			for ( var i = 0; i < files.length; i++) {
				var file = files[i];
				if (!file.$error) {
					Upload
					.upload(
					{
						url : 'https://angular-file-upload-cors-srv.appspot.com/upload',
						data : {
							username : $scope.username,
							file : file
						}
					})
					.then(
						function(resp) {
							$timeout(function() {
								$scope.log = 'file: '
								+ resp.config.data.file.name
								+ ', Response: '
								+ JSON.stringify(resp.data)
								+ '\n' + $scope.log;
							});
						},
						null,
						function(evt) {
							var progressPercentage = parseInt(100.0
								* evt.loaded / evt.total);
							$scope.log = 'progress: '
							+ progressPercentage + '% '
							+ evt.config.data.file.name
							+ '\n' + $scope.log;
						});
				}
			}
		}
	}

	// add info ==> asset page

	function addInfo(campaignAsset) {
		var uibModalInstance = $uibModal.open({
			templateUrl : 'views/klient/asset-add-info.html',
			controller : 'AssetAditionalInfo',
			controllerAs : 'vm',
			resolve : {
				campaignAsset : function() {
					return campaignAsset;
				}
			}
		});
	}

	function clearCampaignUser() {
		vm.campaignUser = undefined;
		for ( var i = 0; i < vm.campaign.permissionList.length; i++) {
			vm.campaign.permissionList[i].selected = false;
		}

	}

	function addCampaignUser() {

		DateConverter.convertElement(vm.campaignUser);
		var temp = vm.campaign.permissionList.filter(function(item) {
			return item.selected;
		});
		var reqObj = {
			"campaign" : {
				"campaignId" : campaign.campaignId
			},
			"user" : vm.campaignUser,
			"campaignPermissions" : temp
		}

		CampaignsService.addCampaignUser(reqObj).then(function(response) {
			if (response.responseStatus.actionStatus == "SUCCESS") {
				vm.campaign.userCampaigns.push(response.userCampaign);
				vm.clearCampaignUser();
				Alertify.success(response.responseStatus.message);
			} else if (response.responseStatus.actionStatus == "WARNING") {
				Alertify.warning(response.responseStatus.message);
			} else {
				Alertify.error(response.responseStatus.message);
			}
		});
	}

	function updateUserCampaignPerms() {

	}

	// remove memeber

	function removeMembers() {
		var temp = vm.campaign.userCampaigns.filter(function(item) {
			return item.selected;
		});
		for ( var i = 0; i < temp.length; i++) {
			delete temp[i].userCampaignPermissions;
			delete temp[i].user;
		}

		Alertify.confirm('Are you sure you want to remove the selected members?').then(
			function onOk() {
				var reqObj = {
					"campaign" : {
						"campaignId" : vm.campaign.campaignId
					},
					"userCampaigns" : temp
				}

				CampaignsService
				.removeCampaignUsers(reqObj)
				.then(
					function(response) {
						if (response.responseStatus.actionStatus == "SUCCESS") {
							Alertify
							.success(response.responseStatus.message);
						} else if (response.responseStatus.actionStatus == "WARNING") {
							Alertify.warning(response.responseStatus.message);
						} else {
							Alertify.error(response.responseStatus.message);
						}

					});
			}, function onCancel() {
							// err callback

						});
	}

	function assetcreditchage(_assetamount){
		calculatetotal();
	}

}
