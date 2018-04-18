(function() {
        'use strict';

        angular.module('PackageName').controller('CampaignBriefCtrl', CampaignBriefCtrl);

        CampaignBriefCtrl.$inject = ['$http', '$rootScope', '$state', '$stateParams', 'Alertify', 'DateConverter', '$scope'];

        function CampaignBriefCtrl($http, $rootScope, $state, $stateParams, Alertify, DateConverter, $scope) {

            var vm = this;
            vm.campaignId;
            vm.load = load;
            $scope.dynamic = 0;
            $scope.campaignfind = [];
            $scope.newcampaignFlag = true;
            $scope.editcampaignflag = false;
            $scope.saveshowflag = false;
            $scope.editshowflag = true;
            $scope.asset_index = 0;
            if ($stateParams.campaign != null)
                vm.campaignId = $stateParams.campaign;
            load();
            $scope.$on('campaign-brief', function(event, _campaign) {
                vm.campaignId = _campaign;
                // CommonInteraction.CamapaginDetails =  vm.campaignId;
                load();
            }); 

            function load() {

                if (vm.campaignId == null || vm.campaignId == undefined || vm.campaignId == "newcampaign") {
                    var reqObj = {};
                    $scope.Campaigns = {};
                    $scope.Campaignresult = {};
                    $scope.createdDateconvert = {};

                    var reqObj = {
                        userKey: $rootScope.globals.userKey

                    }
                      
                    $scope.state = "progress-bar-success";
                } else {                  
                            // $scope.Campaigns.briefQuestions = vm.campaignId.campaignBriefs;
                            $scope.Campaigns.prev = true;
                            $scope.Campaigns.next = false;

                            // $scope.Campaigns.currentQuestion = $scope.Campaigns.briefQuestions[0];
                            // $scope.max = $scope.Campaigns.briefQuestions.length;
                    $scope.Campaigns = vm.campaignId;
                    $scope.Campaignresult = vm.campaignId;  
                    $scope.createdDateconvert = DateConverter.convertDate($scope.Campaigns.createdDate);
                    // $scope.Campaigns.briefQuestions =$scope.Campaigns.briefQuestions;
                    $scope.Campaigns.prev = true;
                    $scope.Campaigns.next = false;

                    // $scope.Campaigns.currentQuestion = $scope.Campaigns.briefQuestions[0];
                    // $scope.max = $scope.Campaigns.briefQuestions.length;              

                }

            }
                $scope.nextQst = function(campaign) {
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
                $scope.hrclick = function(campaign, id) {
                    $scope.asset_index = id;
                    if ($scope.asset_index >= 0 && $scope.asset_index < 10) {
                        campaign.currentQuestion = $scope.Campaigns.briefQuestions[$scope.asset_index];
                        $scope.current_index = $scope.asset_index
                        if ($scope.current_index + 1 == 9)
                            campaign.next = true;
                        else
                            campaign.next = false;
                        if ($scope.current_index + 1 == 0)
                            campaign.prev = true;
                        else
                            campaign.prev = false;
                    }
                }

                $scope.previousQst = function(campaign) {
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
                $scope.editcampaign = function() {
                    $scope.editshowflag = false;
                    $scope.saveshowflag = true;
                };

                $scope.savecampaign = function() {
                    $scope.editshowflag = true;
                    $scope.saveshowflag = false;
                    DateConverter.convertArray($scope.Campaigns.briefQuestions);
                    DateConverter.convertArray($scope.Campaigns);
                    
                    var reqObj={
                    	  campaign:{
                    		id:$scope.Campaigns.id,
                    	    campaignId:$scope.Campaigns.campaignId,
                    	    campaignName:$scope.Campaigns.campaignName,
                    	    briefQuestions:$scope.Campaigns.briefQuestions
                           },
                       userKey:$rootScope.globals.userKey
                	
                    }
                    
                    updateBriefService.updateBrief(reqObj).then(
                        function(response) {
                          var response=response.data;
                          if(response.responseStatus.actionStatus=='SUCCESS'){
                        		 Alertify.success(response.responseStatus.message);
         						
                        	  } else if (response.responseStatus.actionStatus == "WARNING") {
          					Alertify.warning(response.responseStatus.message);
              				} else {
              					Alertify.error(response.responseStatus.message);
              				}
                        	  
                        });

                    }

            }
        })();