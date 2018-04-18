(function() {
    'use strict';

    PackageName.controller('campaignTimeline', campaignTimeline);

    campaignTimeline.$inject = ['$http', '$rootScope', '$state', '$stateParams',
    'Alertify', '$uibModal', 'DTOptionsBuilder', '$scope', 'DateConverter', 'moment', 'timelineService', 'CampaignsService', 'campaign'
    ];

    function campaignTimeline($http, $rootScope, $state, $stateParams, Alertify,
        $uibModal, DTOptionsBuilder, $scope, DateConverter, moment, timelineService, CampaignsService, campaign) {

        var vm = this;
        vm.proposeTimeline = proposeTimeline;

        $scope.assign = true;
        onLoading();

        function onLoading() {
            vm.campaign = angular.copy(campaign);
            vm.events = [{
                "title": "timeline",
                "startsAt": vm.campaign.startTime,
                "endsAt": vm.campaign.endTime,
                "draggable": "true",
                "resizable": "true"
            }]
            vm.show = true;
            
            //Load Kreator's name
            $http.get('json/kreators.json').success(function(data) {
                vm.kreators = data;

            });
            //Load tasks
            $http.get('json/tasks.json').success(function(data) {
                // vm.tasks = data;
                // vm.events = data;
            });
            //Load skillsets 
            $http.get('json/skillset.json').success(function(data) {
                vm.skills = data;
            });

            //get campaigns

        }

        function proposeTimeline(event) {
          
            Alertify.confirm('You are about to porpose the timeline for ' + vm.campaign.campaignName + ' campaign ?\n Press Ok to continue').then(
                function onOk() {
                    var reqObj = {
                        'campaign': {
                            'id': vm.campaign.id,
                            'campaignId': vm.campaign.campaignId,
                            'startTime': event[0].startsAt,
                            'endTime': event[0].endsAt
                        }
                    };

                    CampaignsService.proposeTimeline(reqObj).then(function(response) {
                        if (response.responseStatus.actionStatus == 'SUCCESS') {
                            DateConverter.convertElement(response.campaign);
                            campaign.startTime = response.campaign.startTime;
                            campaign.endTime = response.campaign.endTime;
                            Alertify.success(response.responseStatus.message);
                        } else if (response.responseStatus.actionStatus == "WARNING") {
                           Alertify.warning(response.responseStatus.message);
                       } else {
                           Alertify.error(response.responseStatus.message);
                       }
                   });
                }
                );

        }

        // Must be for calendar view  
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.todayDate = new Date();
        // 

        vm.isCellOpen = false;

        vm.eventClicked = function(event) {
            // timelineService.show('Clicked', event);
            // console.log(event);
            // vm.alertobj ={};
            //         vm.alertobj.type = "delete";
            // var modalInstance = $uibModal.open({
            //              templateUrl : 'views/klient/timeline-modal.html',
            //              controller : 'AlertCtrl',
            //              controllerAs : 'vm',
            //              size : true,
            //              windowClass: 'alert-modal backdrop-modal-remove',
            //              backdrop  : 'static',
            //              keyboard  : false,
            //              resolve : {
            //                   alertobj : function() {
            //                      return  vm.alertobj;
            //                  }
            //              }
            //          }).result.then(function(result) {
            //              // vm.user = result;
            //          });

        };

        vm.eventEdited = function(event) {
            timelineService.show('Edited', event);
        };

        vm.eventDeleted = function(event) {
            timelineService.show('Deleted', event);
        };

        vm.eventTimesChanged = function(event) {
            timelineService.show('Dropped or resized', event);
        };

        vm.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        }
        vm.toggle1 = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[field] = !$scope[field];
        }


        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        }

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        }
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        }


        $scope.popup1 = {
            opened: false
        }
        $scope.popup2 = {
            opened: false
        }

    }


})();
