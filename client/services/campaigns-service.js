(function() {
	'use strict';

	angular.module('PackageName')
			.factory('CampaignsService', CampaignsService);

	CampaignsService.$inject = [ '$http', '$rootScope' ];

	function CampaignsService($http, $rootScope) {
		var service = {};
		service.getCampaignDetails = getCampaignDetails;
		service.updateBrief = updateBrief;
		service.updateCallToAction = updateCallToAction;
		service.updateTargetGroup = updateTargetGroup;
		service.updateCommunication = updateCommunication;
		service.updateConvey = updateConvey;
		service.updateMandatories = updateMandatories;
		service.updateAnyInsight = updateAnyInsight;
		service.updateUniqueSellingPoint = updateUniqueSellingPoint;
		service.updateReference = updateReference;
		service.updateNote = updateNote;
		service.search = search;
		service.getAssetGroups = getAssetGroups;
		service.getAssets = getAssets;
		service.updateAssets = updateAssets;
		service.addCampaignUser = addCampaignUser;
		service.removeCampaignMembers = removeCampaignMembers;
		service.getCampaignPerms = getCampaignPerms;
		service.addSupportingMaterial = addSupportingMaterial;
		service.removeSupportingMaterial=removeSupportingMaterial;
		service.getSupportMeterials = getSupportMeterials;
		service.removeCampaignUsers = removeCampaignUsers;
		service.updateCampaignBrief=updateCampaignBrief;
		service.Campaigndeliverable = Campaigndeliverable;
		service.getMember = getMember;
		service.getCampaignTask = getCampaignTask;
		service.getBlockedMonth = getBlockedMonth;
		service.getUsersBySkillset = getUsersBySkillset;
		service.getSkillsetGroups = getSkillsetGroups;
		service.createCustomTask = createCustomTask;
		service.removeCampaignTask = removeCampaignTask;
		service.assignTask = assignTask;
		service.submitComment=submitComment;
		service.proposeTimeline = proposeTimeline;
		service.addCampaignDeliverable=addCampaignDeliverable;
		service.addCampaignAsset=addCampaignAsset;
		service.sendQuotation=sendQuotation;
		service.sendInvoice=sendInvoice;
		service.uploadAddInfo=uploadAddInfo;
		service.closeCampaign = closeCampaign; 
		service.getTaskDeliverables = getTaskDeliverables; 
		service.addCampaignTaskComment=addCampaignTaskComment;
		return service;

		function search(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/search',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function sendQuotation(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/sendQuotation',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		function sendInvoice(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/sendInvoice',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function closeCampaign(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/closeCampaign',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function getTaskDeliverables(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/taskDeliverables',
					requestObj).then(handleSuccess,
					handleError('Error while getting tasks'));
		}
		
		function proposeTimeline(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/proposeTimeline',
					requestObj).then(handleSuccess,
					handleError('Error while proposing campaign timeline'));
		}
		

		function addCampaignAsset(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/addCampaignAsset',
					requestObj).then(handleSuccess,
					handleError('Error while proposing campaign timeline'));
		}
		
		function getCampaignDetails(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/getCampaignDetails',
					requestObj).then(handleSuccess,
					handleError('Error while getting campain details'));
		}

		function updateBrief(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/updateBrief',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateCallToAction(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateCallToAction',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateTargetGroup(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateTargetGroup',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateCommunication(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateCommunication',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateConvey(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateConvey',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateMandatories(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateMandatories',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateAnyInsight(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateAnyInsight',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateUniqueSellingPoint(requestObj) {
			setUserKey(requestObj)
			return $http
					.post(
							'/pm/campaigns/updateUniqueSellingPoint',
							requestObj).then(handleSuccess,
							handleError('Error while creatingdepartment'));
		}

		function updateReference(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateReference',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function updateNote(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/updateNote',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function addSupportingMaterial(file, requestObj) {
			setUserKey(requestObj);

			var fd = new FormData();
			fd.append('file', file);
			fd.append('requestObj', JSON.stringify(requestObj));
			return $http
					.post(
							'/pm/campaigns/addSupportingMaterial',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined
								}
							}).then(handleSuccess,
							handleError('Error while creating campaign'));

		}

		
		function removeSupportingMaterial(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/removeSupportingMaterial',
					requestObj).then(handleSuccess,
					handleError('Error while removing supporting material'));
		}
		
		function addCampaignDeliverable(file, requestObj) {
			setUserKey(requestObj);
		
			var fd = new FormData();
			fd.append('file', file);
			fd.append('requestObj', JSON.stringify(requestObj));
			return $http
					.post(
							'/pm/campaigns/addCampaignDeliverable',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined
								}
							}).then(handleSuccess,
							handleError('Error while uploading campaign deliverable'));
		
		}
		
		function uploadAddInfo(file, requestObj) {
			setUserKey(requestObj);		
			var fd = new FormData();
			fd.append('file', file);
			fd.append('requestObj', JSON.stringify(requestObj));
			return $http
					.post(
							'/pm/campaigns/uploadAddInfo',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined
								}
							}).then(handleSuccess,
							handleError('Error while uploading campaign deliverable'));
		
		}
		

		
		function updateCampaignBrief(requestObj){
			setUserKey(requestObj);
			return $http.post('/pm/campaigns/updateCampaignBrief',
					requestObj).then(handleSuccess,
					handleError('Error while updating expire date'));
		}


		function getSupportMeterials(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getSupportMeterials',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		// Service for getMember
		function getMember(requestObj) {
			setUserKey(requestObj)
			return $http
					.post(
							'/klient/klientCampaigns/getCampaignMembers',
							requestObj).then(handleSuccess,
							handleError('Error while creatingdepartment'));
		}

		function updateAssets(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/updateAssets',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function addCampaignUser(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/addCampaignUser',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function removeCampaignMembers(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/removeCampaignMembers',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getAssetGroups(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getAssetGroups',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getAssets(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/getAssets',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getCampaignPerms(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getCampaignPerms',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function removeCampaignUsers(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/removeCampaignMembers',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getCampaignTask(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getCampaignTask',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		// Service for Campaigndeliverable
		function Campaigndeliverable(requestObj) {
			return $http.post('json/deliverable.json', requestObj).then(
					handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getBlockedMonth(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getBlockedMonth',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function getUsersBySkillset(requestObj){
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getUsersBySkillset',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getUsersBySkillset(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getUsersBySkillset',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function getSkillsetGroups(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/getSkillsetGroups',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function createCustomTask(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/createCustomTask',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function removeCampaignTask(requestObj) {
			setUserKey(requestObj)
			return $http.post(
					'/pm/campaigns/removeCampaignTask',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}

		function assignTask(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/assignTask',
					requestObj).then(handleSuccess,
					handleError('Error while creatingdepartment'));
		}
		
		function submitComment(requestObj) {
			setUserKey(requestObj)
			return $http.post('/pm/campaigns/submitComment',
					requestObj).then(handleSuccess,
					handleError('Error while submitting campaign comment'));
		}
		
		function addCampaignTaskComment(file, requestObj) {
			setUserKey(requestObj);
		
			var fd = new FormData();
			fd.append('file', file);
			fd.append('requestObj', JSON.stringify(requestObj));
			return $http
					.post(
							'/pm/campaigns/addCampaignTaskComment',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined
								}
							}).then(handleSuccess,
							handleError('Error while uploading campaign deliverable'));
		
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
