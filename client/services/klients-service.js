(function() {
	'use strict';

	angular.module('PackageName').factory('KlientsService', KlientsService);

	KlientsService.$inject = [ '$http', '$rootScope' ];
	function KlientsService($http, $rootScope) {
		var service = {};
		service.createKlient = createKlient;
		service.search = search;
		service.getKlientDetails = getKlientDetails;
		service.uploadPicture = uploadPicture;
		service.updateProfile = updateProfile;
		service.updateKreditLimits = updateKreditLimits;
		service.createCampaign = createCampaign;
		service.deleteCampaigns = deleteCampaigns;
		service.createUser = createUser;
		service.deleteUsers = deleteUsers;
		service.createDepartment = createDepartment;
		service.deleteDepartments = deleteDepartments;
		service.recordPayment = recordPayment;
		service.addRole = addRole;
		service.deleteRoles=deleteRoles;
		service.getKlientPermList = getKlientPermList;
		service.getUserRolesAndUserGroups=getUserRolesAndUserGroups;
		service.getKlientPermissions=getKlientPermissions;
		service.updateOrderExpireDate=updateOrderExpireDate;
		service.getCampaignDetails=getCampaignDetails;
		service.addKredits=addKredits;
		return service;
		
		function getCampaignDetails(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/klients/getCampaignDetails',
					requestObj).then(handleSuccess,
					handleError('Error while getting campaign details'));
		}

		function createKlient(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/createKlient',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function search(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/search',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getKlientDetails(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/getKlientDetails',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateProfile(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/updateProfile',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateKreditLimits(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/klients/updateKreditLimits',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function createCampaign(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/createCampaign',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function deleteCampaigns(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/deleteCampaigns',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function createUser(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/createUser',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function deleteUsers(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/deleteUsers',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function createDepartment(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/createDepartment',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function deleteDepartments(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/klients/deleteDepartments',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function recordPayment(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/recordPayment',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function addRole(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/klients/addRole',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function getKlientPermList(requestObj){
			setUserKey(requestObj)
			return $http.post('/pm/klients/getKlientPermList',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function getUserRolesAndUserGroups(requestObj){
			setUserKey(requestObj)
			return $http.post('/pm/klients/getUserRolesAndUserGroups',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function deleteRoles(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/klients/deleteRoles',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getKlientPermissions(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/klients/getKlientPermList',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function updateOrderExpireDate(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/klients/updateOrderExpireDate',
					requestObj).then(handleSuccess,
					handleError('Error while updating expire date'));
		}	
		
		function addKredits(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/klients/addKredits',
					requestObj).then(handleSuccess,
					handleError('Error while updating expire date'));
		}


		function uploadPicture(file, requestObj) {
			setUserKey(requestObj);
			var fd = new FormData();
			fd.append('file', file);
			fd.append('requestObj', JSON.stringify(requestObj));
			return $http.post('/pm/klients/uploadPicture',
					fd, {
						transformRequest : angular.identity,
						headers : {
							'Content-Type' : undefined
						}
					}).then(handleSuccess,
					handleError('Error while creating campaign'));
		}

		function setUserKey(requestObj) {
			requestObj.userKey = $rootScope.globals.userKey;
		}

		function handleSuccess(res) {
			return res.data;
		}

		function handleError(error) {
			return function() {
				return {
					success : false,
					message : error
				};
			};
		}
	}

})();
