(function() {
	'use strict';

	angular.module('PackageName').controller('AddUser', AddUser);

	AddUser.$inject = ['$http', '$rootScope', '$state', '$stateParams', 'Alertify', '$modal', 'DTOptionsBuilder', '$scope','$modalInstance', 'KlientsService', 'DateConverter', 'company'];

	function AddUser($http, $rootScope, $state, $stateParams, Alertify, $modal, DTOptionsBuilder, $scope, $modalInstance, KlientsService, DateConverter, company) {
		var vm = this;
		vm.createCampaign = createCampaign; 
		vm.modalInstance = $modalInstance;
		vm.dismiss =dismiss; 


		onLoading(); 
		
		function dismiss() {
			vm.modalInstance.dismiss();
		}

		function onLoading(){

		}
		
		function createCampaign(){

			var reqObj = {
			 "company" : {
				"id" : company.id 
			},
			"campaign" : vm.campaign
		}

		KlientsService.createCampaign(reqObj).then(
			function(response) {
				if (response.responseStatus.actionStatus == "SUCCESS") {
					company.campaigns.push(response.campaign);
					DateConverter.convertArray(company.campaigns);
					Alertify.success(response.responseStatus.message);
					vm.dismiss();
				} else if (response.responseStatus.actionStatus == "WARNING") {
					Alertify.warning(response.responseStatus.message);
				} else {
					Alertify.error(response.responseStatus.message);
				}

			});
	}
}
})();