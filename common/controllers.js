PackageName


.controller('SidebarController', ['$scope', '$http','$state', '$timeout' ,
	function($scope, $http, $state , $timeout) {
		
}])

.controller('TopbarController', ['$scope', '$http','$state', '$timeout' ,'$modalStack','$rootScope',
	function($scope, $http, $state , $timeout,$modalStack,$rootScope) {

		// $scope.paneltitle = "Personal Details";
		// console.log($scope.paneltitle)
         $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options){
            $modalStack.dismissAll();
        });

		  $scope.$on('changepanelTitle', function(event, title) {
       		$scope.paneltitle = title;
    }); 
		
}])
 //====================================
    // DATE PICKER
    //====================================
    .controller('DatepickerDemoCtrl', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();


        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    }); 
