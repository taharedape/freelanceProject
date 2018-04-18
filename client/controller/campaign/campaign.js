(function() {
    'use strict';

    angular.module('PackageName').controller('campaign', campaign);

    campaign.$inject = ['$http', '$rootScope', '$state', '$stateParams',
        'Alertify', '$uibModal', 'DTOptionsBuilder', '$scope', 'CampaignsService', 'DateConverter', 'campaign', 'fromKlient', 'companyBranch'
    ];

    function campaign($http, $rootScope, $state, $stateParams, Alertify,
        $uibModal, DTOptionsBuilder, $scope, CampaignsService, DateConverter, campaign, fromKlient, companyBranch) {
        var vm = this;
        vm.nextQst = nextQst;
        vm.previousQst = previousQst;
        vm.updateCampaignBrief = updateCampaignBrief;
        vm.addCampaignAsset = addCampaignAsset;
        vm.addQty = addQty;
        vm.subtractQty = subtractQty;
        vm.uploadFileFromPool = uploadFileFromPool;
        vm.showAssets = showAssets;
        vm.updateAssets = updateAssets;
        vm.updateCampaignKredits = updateCampaignKredits;
        vm.viewCampaignTimeline = viewCampaignTimeline;
        vm.viewTaskTimeline = viewTaskTimeline;
        vm.clearCampaignUser = clearCampaignUser;
        vm.selectAll = selectAll;
        vm.selectAllUserPerms = selectAllUserPerms;
        vm.removeAsset = removeAsset;
        vm.addInfo = addInfo;
        vm.addCampaignUser = addCampaignUser;
        vm.showTimeline = showTimeline;
        vm.removeMembers = removeMembers;
        vm.removeFileFromPool = removeFileFromPool;
        vm.removeDocument = removeDocument;
        vm.assetcreditchage = assetcreditchage;
        vm.calculatetotal = calculatetotal;
        vm.sendQuotation = sendQuotation;
        vm.sendInvoice = sendInvoice;
        vm.hrclick = hrclick;
        vm.removeSupportingMaterial = removeSupportingMaterial;
        vm.getAssetGroups = getAssetGroups;
        vm.getCampaignDetails = getCampaignDetails;
        vm.createCustomTask = createCustomTask;
        vm.submitComment = submitComment;
        vm.addCampaignDeliverable = addCampaignDeliverable;
        vm.closeCampaign = closeCampaign;
        vm.currencyChekcer = currencyChekcer;
        vm.removeCustomAsset = removeCustomAsset;
        vm.addCustomAsset = addCustomAsset;  
        // $scope.dynamic = 0;
        vm.newDate = new Date();
        $scope.asset_index = 0;
        vm.hideflag = false;
        vm.GST = false;

        if ($rootScope.globals.userRole != undefined) {

            if ($rootScope.globals.userRole == 'COFOUNDER') {
                vm.manager = true;
            } else {
                vm.manager = false;
            }
        } else {
            //nothing
        }


        vm.dtOptions = {
            'searching': true,
            'info': false,
            'dom': '<"top"i>rt<"bottom"flp><"clear">',
            "aoColumnDefs": [{
                "Sort": false,
                "aTargets": [0]
            }]
        };
        onLoading();

        function addCustomAsset() {
            var obj = {};
            if (vm.campaign.campaignCustomAssets == undefined) {
                vm.campaign.campaignCustomAssets = []
            }
            vm.campaign.campaignCustomAssets.push(obj);
        };

        function removeCustomAsset(index) {
            vm.campaign.campaignCustomAssets.splice(index, 1);
            calculatetotal();
        }

        function onLoading() {
            vm.campaign = angular.copy(campaign);
            vm.companyBranch = angular.copy(companyBranch);

            $http.get('json/datetypes.json').success(function(data) {
                vm.dateTypeList = data[0].campaign;
            });
            $http.get('json/status-list.json').success(function(data) {
                vm.campaignStatusList = data[0].campaign;
            });
            $http.get('json/status-list.json').success(function(data) {
                vm.statusList = data[0].campaignStatus;
            });
            $http.get('json/user-types.json').success(function(data) {
                vm.klientTypeList = data[0].campaign;
            });
            $http.get('json/currency-list.json').success(function(data) {
                vm.currencyList = data.currency;
            });


            if (fromKlient != null && fromKlient != undefined && fromKlient == true) {
                vm.klient = true;
                getCampaignDetails(campaign);
                vm.branchAddress = angular.copy(companyBranch.address);
                vm.company = angular.copy(companyBranch.company);
            } else {
                $scope.$on('campaign-selected', function(event, _campaign) {
                    vm.campaign = _campaign;
                    getCampaignDetails(vm.campaign);
                });
                vm.klient = false;
            }
            getAssetGroups();
        }

        function closeCampaign() {

            var reqObj = {
                'campaign': {
                    'id': vm.campaign.id,
                    'campaignId': vm.campaign.campaignId
                }
            };

            Alertify.confirm('You are about to close the campaign\n press Okay to continue').then(
                function onOk() {
                    CampaignsService.closeCampaign(reqObj).then(function(response) {
                        if (response.responseStatus.actionStatus == "SUCCESS") {
                            Alertify.success(campaign, ' is successfully closed');
                        } else if (response.responseStatus.actionStatus == "WARNING") {
        					Alertify.warning(response.responseStatus.message);
        				} else {
        					Alertify.error(response.responseStatus.message);
        				}
                    });
                },
                function onCancel() {

                }
            )

        }

        function submitComment() {
            if (vm.comment != null && vm.comment != undefined && vm.comment.length > 0) {
                var reqObj = {
                    'campaign': {
                        'id': vm.campaign.id
                    },
                    'campaignComment': {
                        'comment': vm.comment
                    }
                };
                CampaignsService.submitComment(reqObj).then(function(response) {
                    if (response.responseStatus.actionStatus == "SUCCESS") {
                        response.campaignComment.createdDate = new Date();
                        DateConverter.convertElement(response.campaignComment);
                        if (response.campaignComment.user) {
                            DateConverter.convertElement(response.campaignComment.user);
                        }

                        if (vm.campaign.campaignComments) {
                            vm.campaign.campaignComments.push(response.campaignComment);
                        } else {
                            vm.campaign.campaignComments = [];
                            vm.campaign.campaignComments.push(response.campaignComment);
                        }
                        delete vm.comment;
                        Alertify.success(response.responseStatus.message);
                    } else if (response.responseStatus.actionStatus == "WARNING") {
    					Alertify.warning(response.responseStatus.message);
    				} else {
    					Alertify.error(response.responseStatus.message);
    				}
                });
            } else {
                Alertify.error('Please fill comment section');
            }
        }

        function addCampaignDeliverable(file) {
            var reqObj = {
                'campaign': {
                    'id': vm.campaign.id,
                    'campaignId': vm.campaign.campaignId
                }
            };
            CampaignsService.addCampaignDeliverable(file, reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    response.campaignDeliverable.createdDate = new Date();
                    DateConverter.convertElement(response.campaignDeliverable);
                    if (response.campaignDeliverable.campaignDeliverables) {
                        angular.forEach(response.campaignDeliverable.campaignDeliverables, function(item) {
                            item.createdDate = new Date();
                            DateConverter.convertElement(item);
                        });
                    }

                    if (vm.campaign.campaignDeliverables) {
                        vm.campaign.campaignDeliverables.push(response.campaignDeliverable);
                    } else {
                        vm.campaign.campaignDeliverables = [];
                        vm.campaign.campaignDeliverables.push(response.campaignDeliverable);
                    }
                    vm.deliverDocs = vm.deliverDocs.filter(function(item) {
                        return item.name != file.name;
                    });
                    Alertify.success(response.responseStatus.message);
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}
            });
        }

        function getAssetGroups() {
            var reqObj = {}
            CampaignsService.getAssetGroups(reqObj).then(
                function(response) {
                    if (response.responseStatus.actionStatus == "SUCCESS") {
                        vm.assetGroups = response.assetGroups;
                        DateConverter.convertArray(vm.assetGroups);
                        for (var i = 0; i < vm.assetGroups.length; i++) {
                            DateConverter.convertArray(vm.assetGroups[i].assetSubGroups);
                        }
                    } else if (response.responseStatus.actionStatus == "WARNING") {
    					Alertify.warning(response.responseStatus.message);
    				} else {
    					Alertify.error(response.responseStatus.message);
    				}

                });
        }

        function getCampaignDetails(campaign) {
            var reqObj = {
                "campaign": {
                    "id": campaign.id,
                    "campaignId": campaign.campaignId
                }
            }
            CampaignsService.getCampaignDetails(reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    if (response.campaign.campaignBriefs) {
                        angular.forEach(response.campaign.campaignBriefs, function(item) {
                            DateConverter.convertElement(item);
                            if (item.campaignBriefQuestion) {
                                DateConverter.convertElement(item.campaignBriefQuestion);
                            }
                        });
                        vm.campaignDeliverables = response.campaign.campaignDeliverables;

                    }

                    var temp = angular.copy(campaign.permissionList);
                    DateConverter.convertElement(response.campaign);
                    angular.copy(response.campaign, campaign);

                    campaign.permissionList = temp;
                    campaign.show = true;

                    DateConverter.convertArray(campaign.campaignAssets);
                    DateConverter.convertArray(campaign.companyBranch);
                    DateConverter.convertArray(campaign.userCampaigns);
                    $scope.Campaigns = {};

                    if (campaign.campaignAssets) {

                        for (var i = 0; i < campaign.campaignAssets.length; i++) {
                            DateConverter.convertElement(campaign.campaignAssets[i].asset);
                        }
                    }
                    if (campaign.campaignBriefs != undefined && campaign.campaignBriefs.length > 0) {
                        // campaign.campaignBriefs[0].show = true;
                        $scope.Campaigns = campaign;
                        $scope.Campaigns.briefQuestions = campaign.campaignBriefs;
                        $scope.Campaigns.prev = true;
                        $scope.Campaigns.next = false;

                        $scope.Campaigns.currentQuestion = $scope.Campaigns.briefQuestions[0];
                        $scope.max = $scope.Campaigns.briefQuestions.length;

                    }
                    campaign.curQst = 0;
                    if (campaign.quotation) {
                        DateConverter.convertElement(campaign.quotation);
                        if (campaign.quotation.documents) {
                            DateConverter.convertArray(campaign.quotation.documents);
                        }
                    }

                    vm.campaign = campaign;
                    if(response.users){
                    	vm.users=DateConverter.convertArray(response.users);
                    }

                    calculatetotal();
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

            });

            if (campaign.permissionList == undefined || campaign.permissionList == null || campaign.permissionList.length == 0) {
                CampaignsService.getCampaignPerms(reqObj).then(
                    function(response) {
                        if (response.responseStatus.actionStatus == "SUCCESS") {
                            campaign.permissionList = response.campaignPermissions;
                            DateConverter.convertArray(campaign.permissionList);
                        } else if (response.responseStatus.actionStatus == "WARNING") {
        					Alertify.warning(response.responseStatus.message);
        				} else {
        					Alertify.error(response.responseStatus.message);
        				}
                    });

            }
        }


        function assetcreditchage() {
            calculatetotal();
        }
	
	        function currencyChekcer() {
            if (vm.campaign.quotation.currency == 'MYR') {
                vm.campaign.quotation.GST = (vm.totalAmount * (6 / 100));
                vm.GST = true;
                calculatetotal();

            } else {
                vm.GST = false;
                calculatetotal();

            }
        }

        function assetcreditchage() {
            currencyChekcer();
        }

        // calculate total  

        function calculatetotal() {
            vm.totalAmount = 0;
            if (vm.campaign.campaignAssets != undefined) {
                angular.forEach(vm.campaign.campaignAssets, function(key, value) {
                    if (parseInt(key.assetQuantity) != undefined && parseInt(key.eachAssetKredits) != undefined) {
                        key.subTotal = 0;
                        vm.totalAmount += parseInt(key.eachAssetKredits) * parseInt(key.assetQuantity)
                        key.subTotal += parseInt(key.eachAssetKredits) * parseInt(key.assetQuantity)
                    }
                });
                if (vm.GST) {
                    vm.totalAmount = vm.totalAmount + vm.campaign.quotation.GST;
                } else {

                }
            }
            if (vm.campaign.campaignCustomAssets != undefined) {
                angular.forEach(vm.campaign.campaignCustomAssets, function(key, value) {
                    if (parseInt(key.eachAssetKredits) != undefined && parseInt(key.assetQuantity) != undefined) {
                        key.totalKredits = 0;
                        vm.totalAmount += parseInt(key.eachAssetKredits) * parseInt(key.assetQuantity)
                        key.totalKredits += parseInt(key.eachAssetKredits) * parseInt(key.assetQuantity)

                    }
                });
            }
        }


        function showTimeline() {
            var uibModalInstance = $uibModal.open({
                templateUrl: 'views/klient/timeline.html',
                controller: 'timeline',
                controllerAs: 'vm',
                size: true,
                backdrop: true,
                keyboard: true,
                windowClass: 'app-modal-window'

            }).result.then(function(result) {
                // vm.user = result;
            });

        }

        function viewCampaignTimeline(campaign) {
            // $state.go('klient.campaign-timeline', { 'campaign': campaign.campaignId });
            var uibModalInstance = $uibModal.open({
                templateUrl: 'views/klient/campaign-timeline.html',
                controller: 'campaignTimeline',
                controllerAs: 'vm',
                size: true,
                backdrop: true,
                keyboard: true,
                windowClass: 'app-modal-window',
                resolve: {
                    campaign: function() {
                        return campaign;
                    }
                }
            });
        }

        function viewTaskTimeline(campaignTask) {
            var uibModalInstance = $uibModal.open({
                templateUrl: 'views/klient/task-timeline.html',
                controller: 'taskTimeline',
                controllerAs: 'vm',
                size: true,
                backdrop: true,
                keyboard: true,
                windowClass: 'app-modal-window',
                resolve: {
                    campaignTask: function() {
                        return campaignTask;
                    }
                }
            });
        }

        // remove campaign

        function removeDocument($index) {

            Alertify.confirm('Are you sure want to remove the selected file?\n press Okay to continue').then(
                function onOk() {


                    Alertify.success('Deleted');
                },
                function onCancel() {

                }
            )
        }

        function nextQst(campaign) {
            $scope.prevflag = false;

            if ($scope.asset_index >= $scope.Campaigns.briefQuestions - 1) {
                campaign.next = true;
            } else {
                $scope.asset_index++;
            }
            if ($scope.Campaigns.briefQuestions.length - 1 == $scope.asset_index) {
                campaign.next = true;
            }
            if ($scope.asset_index == 0)
                campaign.prev = true;
            else
                campaign.prev = false;

            campaign.currentQuestion = $scope.Campaigns.briefQuestions[$scope.asset_index];
        }

        function hrclick(campaign, id) {
            $scope.asset_index = id;
            if ($scope.asset_index >= 0 && $scope.asset_index < 10) {
                campaign.currentQuestion = $scope.Campaigns.briefQuestions[$scope.asset_index];
                $scope.current_index = $scope.asset_index
                if ($scope.current_index + 1 == 10)
                    campaign.next = true;
                else
                    campaign.next = false;
                if ($scope.current_index + 1 == 0)
                    campaign.prev = true;
                else
                    campaign.prev = false;
            }
        }

        function previousQst(campaign) {
            campaign.next = false;
            if ($scope.asset_index == 0) {
                campaign.prev = true;
            } else {
                $scope.asset_index--;
            }
            if ($scope.asset_index == 0) {
                campaign.prev = true;
            }
            campaign.currentQuestion = $scope.Campaigns.briefQuestions[$scope.asset_index];


        }

        function updateCampaignBrief(campaign) {
            var campaignBriefs = angular.copy($scope.Campaigns.briefQuestions);
            console.log($scope.Campaigns.briefQuestions);
            if (vm.campaign.campaignManager) {

                var reqObj = {
                    'campaign': {
                        'id': $scope.Campaigns.id
                    },
                    'campaignBriefs': campaignBriefs,
                    "user": {
                        "id": vm.campaign.campaignManager.id
                    }
                };
            } else {
                var reqObj = {
                    'campaign': {
                        'id': $scope.Campaigns.id
                    },
                    'campaignBriefs': campaignBriefs
                };

            }

            CampaignsService.updateCampaignBrief(reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    if (response.campaign.campaignBriefs) {
                        angular.forEach(response.campaign.campaignBriefs, function(item) {
                            DateConverter.convertElement(item);
                            if (item.campaignBriefQuestion) {
                                DateConverter.convertElement(item.campaignBriefQuestion);
                            }
                        });
                    }
                    vm.campaign.campaignBriefs = response.campaign.campaignBriefs;
                    if(response.campaign.campaignManager){
                    	vm.campaign.campaignManager=DateConverter.convertElement(response.campaign.campaignManager);
                    }
                    
                    Alertify.success(response.responseStatus.message);
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

            });
        }

        function uploadFileFromPool(file) {
            // var file = $scope.myFile;
            file.showSpinner = true;
            var reqObj = {
                "campaign": {
                    "id": vm.campaign.id,
                    "campaignId": vm.campaign.campaignId
                }
            };

            CampaignsService.addSupportingMaterial(file, reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    response.document.createdDate = new Date();
                    DateConverter.convertElement(response.document);
                    if (vm.campaign.supportingMaterials) {
                        vm.campaign.supportingMaterials.push(response.document);
                    } else {
                        vm.campaign.supportingMaterials = [];
                        vm.campaign.supportingMaterials.push(response.document);
                    }

                    vm.bufferDocs = vm.bufferDocs.filter(function(item) {
                        return item.name != file.name;
                    });
                    file.showSpinner = false;
                    Alertify.success(response.responseStatus.message);
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

            });
        }

        function removeFileFromPool(file) {
            vm.campaign.bufferDocs = campaign.bufferDocs.filter(function(item) {
                return item.file = file.fileName;
            });

        }

        function removeSupportingMaterial(document) {
            Alertify.confirm('You are about to remove a support material ' + '\n Press OK to continue').then(
                function Ok() {
                    var reqObj = {
                        'campaign': {
                            'id': vm.campaign.id,
                            'campaignId': vm.campaign.campaignId
                        },

                        'document': {
                            'id': document.id
                        }
                    };
                    CampaignsService.removeSupportingMaterial(reqObj).then(function(response) {
                        if (response.responseStatus.actionStatus == "SUCCESS") {
                            vm.campaign.supportingMaterials = vm.campaign.supportingMaterials.filter(function(item) {
                                return item.id != document.id;
                            });
                            Alertify.success(response.responseStatus.message);
                        } else if (response.responseStatus.actionStatus == "WARNING") {
        					Alertify.warning(response.responseStatus.message);
        				} else {
        					Alertify.error(response.responseStatus.message);
        				}
                    });
                },

                function cancel() {
                    //nothing
                }
            );
        }


        function showAssets() {
            if (vm.selectedAssetSubGroup && vm.selectedAssetSubGroup.id) {
                var reqObj = {
                    'campaign': { 'id': vm.campaign.id, 'campaignId': vm.campaign.campaignId },
                    'assetSubGroup': { 'id': vm.selectedAssetSubGroup.id }
                }

                CampaignsService.getAssets(reqObj).then(function(response) {
                    if (response.responseStatus.actionStatus == "SUCCESS") {
                        if (response.assets) {
                            angular.forEach(response.assets, function(asset) {
                                DateConverter.convertElement(asset);
                                if (asset.documents) {
                                    DateConverter.convertArray(asset.documents);
                                }
                                if (asset.assetSubGroup) {
                                    DateConverter.convertElement(asset.assetSubGroup);
                                    if (asset.assetSubGroup.assetGroup) {
                                        DateConverter.convertElement(asset.assetSubGroup.assetGroup);
                                    }
                                }
                            });
                        }
                        vm.selectedAssetSubGroup.assets = response.assets;
                        //Alertify .error(response.responseStatus.message);
                    } else if (response.responseStatus.actionStatus == "WARNING") {
    					Alertify.warning(response.responseStatus.message);
    				} else {
    					Alertify.error(response.responseStatus.message);
    				}
                });
            }
        }

        function addCampaignAsset(asset) {
            var reqObj = {
                'campaign': { 'id': vm.campaign.id, 'campaignId': vm.campaign.campaignId },
                'asset': { 'id': asset.id }
            };

            CampaignsService.addCampaignAsset(reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    if (response.campaignAsset) {
                        DateConverter.convertElement(response.campaignAsset);
                        if (response.campaignAsset.campaign) {
                            DateConverter.convertElement(response.campaignAsset.campaign);
                        }
                        if (response.campaignAsset.asset) {
                            DateConverter.convertElement(response.campaignAsset.asset);
                        }
                    }
                    if (vm.campaign.campaignAssets) {
                        vm.campaign.campaignAssets.push(response.campaignAsset);
                    } else {
                        vm.campaign.campaignAssets = [];
                        vm.campaign.campaignAssets.push(response.campaignAsset);
                    }
                    updateCampaignKredits();
                    vm.haveAssets = true;
                    Alertify.success(response.responseStatus.message);
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}
            });

        }

        function addQty(campaignAsset) {
            if (campaignAsset.assetQuantity == null || campaignAsset.assetQuantity == undefined || campaignAsset.totalKredits == null || campaignAsset.totalKredits == undefined) {
                campaignAsset.assetQuantity = 1;
                campaignAsset.totalKredits = campaignAsset.asset.kredits;
            }

            campaignAsset.assetQuantity += 1;
            campaignAsset.totalKredits = campaignAsset.assetQuantity * campaignAsset.asset.kredits;

            vm.updateCampaignKredits(vm.campaign);
        }

        // Substract Quantity

        function subtractQty(campaignAsset) {
            if (campaignAsset.assetQuantity == null || campaignAsset.assetQuantity == undefined || campaignAsset.totalKredits == null || campaignAsset.totalKredits == undefined) {
                campaignAsset.assetQuantity = 1;
                campaignAsset.totalKredits = campaignAsset.asset.kredits;
            }
            if (campaignAsset.assetQuantity >= 2) {
                campaignAsset.assetQuantity -= 1;
                campaignAsset.totalKredits = campaignAsset.assetQuantity * campaignAsset.asset.kredits;
            }
            vm.updateCampaignKredits(vm.campaign);
        }

        function updateCampaignKredits() {
            vm.campaign.totalKredits = 0;
            for (var i = 0; i < vm.campaign.campaignAssets.length; i++) {
                vm.campaign.totalKredits += vm.campaign.campaignAssets[i].totalKredits;
            }
        }

        function updateAssets() {
            var temp = angular.copy(vm.campaign);

            var reqObj = {
                "campaign": temp
            }

            CampaignsService.updateAssets(reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    vm.campaign.camaignAssets = response.campaign.campaignAssets;
                    Alertify.success(response.responseStatus.message);

                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}
            });
        }

        function selectAll() {
            for (var i = 0; i < vm.campaign.campaignAssets.length; i++) {
                vm.campaign.campaignAssets[i].selected = vm.campaign.allSelected;
            }

        }

        function selectAllUserPerms() {
            for (var i = 0; i < vm.campaign.userCampaigns.length; i++) {
                vm.campaign.userCampaigns[i].selected = vm.campaign.userPemAllSelected;
            }

        }

        function removeAsset() {
            vm.campaign.campaignAssets = vm.campaign.campaignAssets.filter(function(ast) {
                return ast.selected != true;
            });
            vm.campaign.allSelected = false;
        }

        function addInfo(campaignAsset, subtractflag) {
            var uibModalInstance = $uibModal.open({
                templateUrl: 'views/klient/asset-add-info.html',
                controller: 'AssetAditionalInfo',
                controllerAs: 'vm',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    campaignAsset: function() {
                        return campaignAsset;
                    },
                    subtractflag: function() {
                        return subtractflag;
                    },
                    campaignid: function() {
                        return vm.campaign.campaignId;
                    }
                }
            });
        }

        function clearCampaignUser() {
            vm.campaign.campaignUser = {};
            for (var i = 0; i < vm.campaign.permissionList.length; i++) {
                vm.campaign.permissionList[i].selected = false;
            }

        }

        function addCampaignUser() {
            var tempPerms = vm.campaign.permissionList.filter(function(item) {
                return item.selected == true;
            });
            DateConverter.convertArray(tempPerms);
            DateConverter.convertElement(vm.campaignUser);
            var reqObj = {
                "campaign": {
                    "id": vm.campaign.id,
                    'campaignId': vm.campaign.campaignId
                },
                "user": {
                    "id": vm.campaignUser.id,
                    "userId": vm.campaignUser.userId
                },
                "campaignPermissions": tempPerms
            }

            CampaignsService.addCampaignUser(reqObj).then(function(response) {
                if (response.responseStatus.actionStatus == "SUCCESS") {
                    if (vm.campaign.userCampaigns) {
                        vm.campaign.userCampaigns.push(response.userCampaign);
                    } else {
                        vm.campaign.userCampaigns = [];
                        vm.campaign.userCampaigns.push(response.userCampaign);
                    }
                    delete vm.campaignUser;
                    angular.forEach(vm.campaign.permissionList, function(permission) {
                        delete permission.selected;
                    });
                    Alertify.success(response.responseStatus.message);
                } else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}
            });
        }

        function removeMembers() {
            var tempUserCampaigns = angular.copy(vm.campaign.userCampaigns.filter(function(item) {
                return item.selected == true;
            }));
            if (tempUserCampaigns.length > 0) {
                angular.forEach(tempUserCampaigns, function(userCampaign) {
                    delete userCampaign.user;
                    delete userCampaign.campaign;
                    delete userCampaign.userCampaignPermissions;
                });


                Alertify.confirm('Are you sure you want to remove the selected members?').then(
                    function onOk() {
                        var reqObj = {
                            "campaign": {
                                "id": vm.campaign.id,
                                "campaignId": vm.campaign.campaignId
                            },
                            "userCampaigns": angular.copy(tempUserCampaigns)
                        }

                        CampaignsService.removeCampaignUsers(reqObj).then(function(response) {
                            if (response.responseStatus.actionStatus == "SUCCESS") {
                                var tempUserCampaigns = vm.campaign.userCampaigns.filter(function(item) {
                                    return item.selected != true;
                                });
                                vm.campaign.userCampaigns = tempUserCampaigns;
                                Alertify.success(response.responseStatus.message);
                            } else if (response.responseStatus.actionStatus == "WARNING") {
            					Alertify.warning(response.responseStatus.message);
            				} else {
            					Alertify.error(response.responseStatus.message);
            				}
                        });
                    },
                    function onCancel() {}
                );
            } else {
                Alertify.error('Please select atleast one user to remove');
            }
        }

        function sendQuotation() {
            Alertify.confirm('You are about to send the quotation to  Press OK to continue').then(
                function Ok() {
                    if (vm.campaign.quotation) {
                        vm.campaign.quotation.currency = vm.campaign.quotation.currency;
                    }

                    var reqObj = {
                        'campaign': { 'id': vm.campaign.id, 'campaignId': vm.campaign.campaignId },
                        'quotation': vm.campaign.quotation,
                        'customAssets': vm.campaign.campaignCustomAssets,
                        'campaignAssets': vm.campaign.campaignAssets
                    }

                    CampaignsService.sendQuotation(reqObj).then(function(response) {
                        if (response.responseStatus.actionStatus == "SUCCESS") {
                            response.quotation.createdDate = new Date();
                            DateConverter.convertElement(response.quotation);
                            vm.campaign.quotation = response.quotation;
                            vm.campaign.status = response.campaign.status;
                            Alertify.success(response.responseStatus.message);
                            vm.hideflag = true;
                        } else if (response.responseStatus.actionStatus == "WARNING") {
        					Alertify.warning(response.responseStatus.message);
        				} else {
        					Alertify.error(response.responseStatus.message);
        					vm.hideflag = false;
        				}
                    });
                },
                function cancel() {
                    //nothing
                }

            )
        }

        function sendInvoice(klient) {
            Alertify.confirm('You are about to send the invoice to ' + klient + '\n Press OK to continue').then(
                function Ok() {
                    var reqObj = {
                        'campaign': { 'id': vm.campaign.id, 'campaignId': vm.campaign.campaignId }
                    }

                    CampaignsService.sendInvoice(reqObj).then(function(response) {
                        if (response.responseStatus.actionStatus == "SUCCESS") {
                            Alertify.success(response.responseStatus.message);
                        } else if (response.responseStatus.actionStatus == "WARNING") {
        					Alertify.warning(response.responseStatus.message);
        				} else {
        					Alertify.error(response.responseStatus.message);
        				}

                    });
                },
                function cancel() {
                    //nothing
                }

            )

        }

        function createCustomTask() {


            var uibModalInstance = $uibModal.open({
                templateUrl: 'views/klient/new-customtask.html',
                controller: 'newCustomTask',
                controllerAs: 'vm',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    campaign: function() {
                        return vm.campaign;
                    }

                }
            });
        }

        $scope.assetdescription = function(row) {
            var uibModalInstance = $uibModal.open({
                controller: 'infoPopupController',
                controllerAs: 'vm',
                templateUrl: 'views/klient/infoPopup.html',
                windowClass: 'modal-asset',
                resolve: {
                    selectedRow: function() {
                        return row;
                    }
                }
            });
        };
    }

})();
