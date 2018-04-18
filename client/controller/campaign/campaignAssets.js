(function() {
	'use strict';

	angular.module('PackageName').controller('CampaignAssetsCtrl', CampaignAssetsCtrl);

	CampaignAssetsCtrl.$inject = ['$http', '$rootScope', '$state', '$stateParams', 'DateConverter', 'Alertify', 'growlService', '$scope', '$uibModal','CampaignsService'];

	function CampaignAssetsCtrl($http, $rootScope, $state, $stateParams, DateConverter, Alertify, growlService, $scope, $uibModal, CampaignsService) {

		var vm = this;
		$scope.campaignId = $stateParams.campaignId;
		$scope.onLoad = onLoad;
		$scope.showAssets = showAssets;
		$scope.assetGroups = [];
		$scope.addAsset = addAsset;
		$scope.campaignAssets = [];
		$scope.removeAsset = removeAsset;
		$scope.addInfo = addInfo;
		$scope.addQty = addQty;
		$scope.subtractQty = subtractQty;
		$scope.updateCampaignKredits = updateCampaignKredits;
		$scope.updateAssets = updateAssets;
		$scope.checkCampaignPerms = checkCampaignPerms;
		$scope.oneCheckboxSelected = oneCheckboxSelected;
		$scope.deptSelectAll = deptSelectAll;
		$scope.showSubAssets = showSubAssets;
		$scope.selectedCateogry = null;        
		clearAssetView();
		$scope.subcatflag = true;
		onLoad();
		//$scope.editAssets = false;
		$scope.editAssets = true;
		// return this;
		$scope.disabled = disabled;
		$scope.deptIsAllSelected = false;
		$scope.totalKredits = 0;
		$scope.campaignId;
		 $scope.selectedAssetGroupetemplate =[];
		if ($stateParams.campaign != null)
			$scope.campaignId = $stateParams.campaign.campaignId;

		function disabled() {
			$scope.isDisabled = true;
		}
		$scope.$on('campaign-asset', function(event, _campaign) {
			$scope.campaignId = _campaign;
			clearAssetView();
			onLoad();
		});


		function onLoad() {


				var reqObj = {
					campaign: {
						id: $scope.campaignId,
					},
					userKey: $rootScope.globals.userKey

				}

				var reqObj2 = {

					userKey: $rootScope.globals.userKey

				};

			CampaignsService.getAssets(reqObj)
				.then(
					function(response) {
						// var response = response.data;
						if (response.responseStatus.actionStatus == "SUCCESS") {
							$scope.campaignAssets = response.campaignAssets;
							$scope.updateCampaignKredits();

						} else if (response.responseStatus.actionStatus == "WARNING") {
							Alertify.warning(response.responseStatus.message);
						} else {
							Alertify.error(response.responseStatus.message);
						}
					})


		   
			CampaignsService.getAssetGroups(reqObj2)
				.then(
					function(response) {
						// var response = response.data;
						$scope.assetGroups = [];
						if (response.responseStatus.actionStatus == "SUCCESS") {
							  $scope.selectedCateogry = {};
							  $scope.selectedAssetSubGroup ={}
							//$scope.groupedBykey = _.groupBy(response.assetGroups, 'name');
								$scope.assetGroups = response.assetGroups;

							// for (var menulistkey in $scope.groupedBykey) {
							//     var menuname = {};
							//     menuname.category = menulistkey;
							//     menuname.data = $scope.groupedBykey[menulistkey][0].assetSubGroups;
							//     $scope.assetGroups.push(menuname);

							// }

							$scope.checkingflag = false;                          

						} else if (response.responseStatus.actionStatus == "WARNING") {
							Alertify.warning(response.responseStatus.message);
						} else {
							Alertify.error(response.responseStatus.message);
						}
					})




		}     
	 
		function clearAssetView() {          
			$scope.assetGroups = [];
			$scope.selectedAssetGroupetemplate =[];
		}

		function showSubAssets(_asset) {
			$scope.selectedAssetSubGroup ={}
			if (_asset.selected == 0) {
				var obj2 = {};
				obj2.name = "No Data";
				obj2.value = 0;
				$scope.selectedAssetSubGroup.selected = obj2;
				$scope.selectedsub = [];
				$scope.subcatflag = true;
			} else {

				$scope.selectedsub = _asset.selected.assetSubGroups;               
				$scope.subcatflag = false;
			}
		}

		function showAssets(selectedAssetSubGroup) {
			$scope.selectedAssetSubGroup = selectedAssetSubGroup;           
			if ($scope.selectedAssetSubGroup.selected != null) {

				var reqObj = {
					assetSubGroup: {
						id: $scope.selectedAssetSubGroup.selected.id
					},

					userKey: $rootScope.globals.userKey

				};


				CampaignsService.getAssets(reqObj)
					.then(
						function(response) {
							// var response = response.data;
							if (response.responseStatus.actionStatus == "SUCCESS") {
								$scope.selectedAssetSubGroup.assets = response.assetSubGroup.assets;
								DateConverter.convertArray($scope.selectedAssetSubGroup.assets);
								$scope.selectedAssetGroupetemplate = $scope.selectedAssetSubGroup.assets;
							} else if (response.responseStatus.actionStatus == "WARNING") {
								Alertify.warning(response.responseStatus.message);
							} else {
								Alertify.error(response.responseStatus.message);
							}
						});
			}
		}

		function addAsset(asset) {



			$scope.assetadd = [];

			if ($scope.campaignAssets.length == 0) {
				$scope.campaignAssets = [];
			}

			var temp = $scope.campaignAssets.filter(function(tr) {
				return tr.asset.id == asset.id;
			});


			if (temp == null || temp == undefined || temp.length == 0) {
				var campAsst = {
					"additionalInfo": "",
					"assetQuantity": 1,
					"eachAssetKredits": asset.kredits,
					"totalKredits": asset.kredits,
					"name": asset.name,
					"asset": {
						id: asset.id
					}
					// "campaign" : $scope.campaign
				}
				var arr = [];
				arr.push(campAsst);

				var reqObj = {
					campaign: {
						id: $scope.campaignId,
						campaignAssets: arr
					},
					userKey: $rootScope.globals.userKey

				};

				CampaignsService.updateAssets(reqObj).then(function(response) {
					if (response.responseStatus.actionStatus == "SUCCESS") {
						$scope.campaignAssets.push(response.campaign.campaignAssets[0]);
						$scope.updateCampaignKredits();
						$scope.assetadd = $scope.campaign;
						$scope.checkingflag = true;

						$scope.haveAssets = true;
					} else if (response.responseStatus.actionStatus == "WARNING") {
						Alertify.warning(response.responseStatus.message);
					} else {
						Alertify.error(response.responseStatus.message);
					}
				})

			} else {
				Alertify.warning(response.responseStatus.message);
			}

		}

		function deptSelectAll(_deptIsAllSelected) {
			for (var i = 0; i < $scope.campaign.campaignAssets.length; i++) {
				$scope.campaign.campaignAssets[i].selected = _deptIsAllSelected;
			}
		}

		function oneCheckboxSelected(record) {
			if (record.selected == false) {
				$scope.deptIsAllSelected = false;
			} else {
				// var temp = true;				
				// if (temp == true) {
				// 	$scope.deptIsAllSelected = true;
				// }
			}
		}

		function updateCampaignKredits() {
			$scope.totalKredits = 0;
			for (var i = 0; i < $scope.campaignAssets.length; i++) {
				$scope.totalKredits += $scope.campaignAssets[i].assetQuantity * $scope.campaignAssets[i].eachAssetKredits;;
			}
		}

		function addInfo(campaignAsset) {
			$scope.Addinfo = [];

			for (var i = 0; i < campaignAsset.assetQuantity; i++) {
				$scope.Addinfo.push(campaignAsset);
			}
			console.log($scope.Addinfo)

			var modalInstance = $uibModal.open({
				templateUrl: 'views/klient/campaign/asset-add-info.html',
				controller: 'AssetAditionalInfo',
				controllerAs: 'vm',
				resolve: {
					editAssets: function() {
						return $scope.editAssets;
					},
					addInfo: function() {
						return campaignAsset.additionalInfo;
					},
					campaignAsset: function() {
						return campaignAsset;
					},
					totalassets: function() {
						return $scope.Addinfo;
					}
				}
			}).result.then(function(result) {
				campaignAsset.additionalInfo = result;
			});
		}

		function addQty(campaignAsset) {
			if (campaignAsset.assetQuantity == null ||
				campaignAsset.assetQuantity == undefined ||
				campaignAsset.totalKredits == null ||
				campaignAsset.totalKredits == undefined) {
				campaignAsset.assetQuantity = 1;
				$scope.totalKredits = campaignAsset.eachAssetKredits;
			}
			campaignAsset.assetQuantity += 1;
			$scope.totalKredits = campaignAsset.assetQuantity * campaignAsset.eachAssetKredits;
			campaignAsset.totalKredits = campaignAsset.assetQuantity * campaignAsset.eachAssetKredits;


			$scope.updateCampaignKredits();
		}

		function subtractQty(campaignAsset) {
			if (campaignAsset.assetQuantity == null ||
				campaignAsset.assetQuantity == undefined ||
				campaignAsset.totalKredits == null ||
				campaignAsset.totalKredits == undefined) {
				campaignAsset.assetQuantity = 1;
				$scope.totalKredits = campaignAsset.eachAssetKredits;
			}
			if (campaignAsset.assetQuantity >= 2) {
				campaignAsset.assetQuantity -= 1;
				$scope.totalKredits = campaignAsset.assetQuantity * campaignAsset.eachAssetKredits;
			}
			campaignAsset.totalKredits = campaignAsset.assetQuantity * campaignAsset.eachAssetKredits;
			$scope.updateCampaignKredits();
		}

		function updateAssets() {
			DateConverter.convertArray($scope.campaignAssets);
			for (var i = 0; i < $scope.campaignAssets.length; i++) {
				DateConverter.convertElement($scope.campaignAssets[i].asset);

			}

			var reqObj = {
				campaign: {
					id: $scope.campaignId,
					campaignAssets: $scope.campaignAssets
				},

				userKey: $rootScope.globals.userKey

			};

		   CampaignsService.updateAssets(reqObj).then(function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					// response.assetSubGroup.assets;
					$scope.isDisabled = false;
					Alertify.success(response.responseStatus.message);


				}  else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
					$scope.isDisabled = false;
				}
			});
		}

		function removeAsset() {
			$scope.campaignAssets = _.reject($scope.campaignAssets, function(_obj) {
				return _obj.selected == true;
			});
			$scope.updateCampaignKredits();
		}

		function checkCampaignPerms(campPerm) {
			if ($scope.userCampaign.campaign.status == 'CAMPAIGN_IN_BUCKET' || $scope.userCampaign.campaign.status == 'CAMPAIGN_SUBMITTED') {
				$scope.editAsset = true;
				growlService.growl('You cannot add any Asset to this campaign!', 'inverse');

			}
			if ($scope.userCampaign != null && $scope.userCampaign != undefined) {
				var temp = $scope.userCampaign.userCampaignPermissions
					.filter(function(test) {
						return test.campaignPermission.permissionName == campPerm;
					});
				if (temp != null && temp != undefined && temp.length > 0) {
					return true;
				}
			} else {
				false;
			}

		}

	}

})();