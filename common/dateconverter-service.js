(function() {
	'use strict';

	angular.module('PackageName').factory('DateConverter', DateConverter);

	DateConverter.$inject = [ '$rootScope' ];
	function DateConverter($rootScope) {

		var vm = {};
		vm.convertArray = convertArray;
		vm.convertElement = convertElement;
		vm.convertDate =convertDate;

		return vm;

		function convertArray(array) {
			if (array != null && array != undefined && array.length > 0) {
				for ( var i = 0; i < array.length; i++) {
					vm.convertElement(array[i]);
				}
			}
			return array;
		}

		function convertElement(element) {
			if (element != null && element != undefined) {
				if (element.createdDate != null && element.createdDate != undefined) {
					element.createdDate = new Date(element.createdDate);
				}
				if (element.modifiedDate != null && element.modifiedDate != undefined) {
					element.modifiedDate = new Date(element.modifiedDate);
				}
				
				if (element.scheduleDate != null && element.scheduleDate != undefined) {
					element.scheduleDate = new Date(element.scheduleDate);
				}
				if(element.scheduleTime != null && element.scheduleTime !=undefined){
					if(element.scheduleTime instanceof Date){
						element.scheduleTime=new Date(element.scheduleTime);
					}else{
						element.scheduleTime=Date.parse(element.scheduleTime);
					}
				}
				if(element.earlyStartDate !=null && element.earlyStartDate !=undefined){
					element.earlyStartDate = new Date(element.earlyStartDate);
				}
				if(element.joinDate !=null && element.joinDate !=undefined){
					element.joinDate = new Date(element.joinDate);
				}
				if(element.holiday !=null && element.holiday !=undefined){
					element.holiday = new Date(element.holiday);
				}
				if(element.startTime !=null && element.startTime !=undefined){
					element.startTime = new Date(element.startTime);
				}
				if(element.endTime !=null && element.endTime !=undefined){
					element.endTime = new Date(element.endTime);
				}
				if(element.expireDate !=null && element.expireDate !=undefined){
					element.expireDate = new Date(element.expireDate);
				}
			}
			return element;
		}
		 function convertDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }
	}

})();