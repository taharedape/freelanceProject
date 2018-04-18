(function() {
	'use strict';

	PackageName.controller('timeline', timeline);

	timeline.$inject = [ '$http', '$rootScope', '$state', '$stateParams',
	'Alertify', '$uibModal', 'DTOptionsBuilder', '$scope', 'DateConverter','moment','timelineService'];

	function timeline($http, $rootScope, $state, $stateParams, Alertify,
		$uibModal, DTOptionsBuilder, $scope, DateConverter, moment, timelineService) {

		var vm = this;
		vm.toggleMode = toggleMode;
		vm.saveConfig = saveConfig;  
		vm.restoreConfig = restoreConfig; 
		vm.applyConfig = applyConfig; 
		vm.zoomToFit = zoomToFit;
		vm.getUnitsBetween = getUnitsBetween; 
		vm.setScaleConfig = setScaleConfig; 
		//day view by fefault 
		$scope.scale = 1; 
		$scope.assign = true;
		vm.todayDate = new Date();
		



		vm.month = 'month';
		
		vm.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
		'<li class="dropdown" dropdown>' +
		'<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
		'<ul class="dropdown-menu dropdown-menu-right">' +
		'<li class="active">' +
		'<a data-calendar-view="month" href="">Month View</a>' +
		'</li>' +
		'<li>' +
		'<a data-calendar-view="basicWeek" href="">Week View</a>' +
		'</li>' +
		'<li>' +
		'<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
		'</li>' +
		'<li>' +
		'<a data-calendar-view="basicDay" href="">Day View</a>' +
		'</li>' +
		'<li>' +
		'<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'</li>';


		$scope.events = [
		{
			title: 'Hangout with friends',
			start: new Date(2016, 3, 1, 2,21),
			end: new Date(2016, 3, 12, 23,22),
			allDay: false,
			className: 'bgm-cyan'
		},
		{
			title: 'Meeting with client',
			start: new Date(2016, 3, 14, 2,21),
			end: new Date(2016, 3, 16, 3,22),

			allDay: true,
			className: 'bgm-red'
		}
		],
		$scope.select = function (start, end, allDay) {
			scope.select({
				start: start, 
				end: end
			});
		}
		$scope.dynamicPopover = {
			templateUrl: 'myPopoverTemplate.html',
		};



		
		vm.kreatorSearch = kreatorSearch; 
		vm.assignKreator = assignKreator; 
		vm.removeKreator = removeKreator; 
		vm.getRandomColor = getRandomColor; 
		vm.getDayClass = getDayClass; 


		onLoading();

		function onLoading() {
			//Load Kreator's name
			$http.get('json/kreators.json').success(function (data) {				
				vm.kreators = data;

			});
			//Load tasks
			$http.get('json/tasks.json').success(function (data) {				
				vm.tasks = data;
				vm.events = data;
			});
			//Load skillsets 
			$http.get('json/skillset.json').success(function (data) {				
				vm.skills = data;
			});


		}
		vm.calendarView = 'month';
		vm.viewDate = new Date();


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

	function kreatorSearch() {
			//display the kreator's list based on the filter //
		}

		function assignKreator(k) {
			//display the kreator's list based on the filter //
			vm.calendarEvents = vm.events; 
			vm.calendarEvents.push(k);
			console.log(vm.events);

		}
		function removeKreator(k) {

			vm.events = vm.events.filter(function(item){
				return item.title != k.title;
			});
			console.log(vm.events);

		}

		// random color display 
		function getRandomColor() {

			return {
				background: '#' + Math.floor(Math.random()*16777215).toString(16)
			}
		}

		$scope.getcolor =  function(){
			var color = ["pink", "green", "blue","gray","orange","brown","black","yellow","red"]
			var randoms = color[Math.floor(Math.random() * 9)];
			return randoms;
		}
		$scope.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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

		function getDayClass(data) {
			var date = data.date,
			mode = data.mode;


			return '';
		}

		function toggleMode(toggle) {
			toggle.enabled = !toggle.enabled;
			if (toggle.enabled) {
				toggle.innerHTML = "Set default Scale";
			//Saving previous scale state for future restore
			saveConfig();
			zoomToFit();
		} else {

			toggle.innerHTML = "Zoom to Fit";
			//Restore previous scale state
			restoreConfig();
			gantt.render();
		}
	}

	var cachedSettings = {};
	function saveConfig() {
		var config = gantt.config;
		cachedSettings = {};
		cachedSettings.scale_unit = config.scale_unit;
		cachedSettings.date_scale = config.date_scale;
		cachedSettings.step = config.step;
		cachedSettings.subscales = config.subscales;
		cachedSettings.template = gantt.templates.date_scale;
		cachedSettings.start_date = config.start_date;
		cachedSettings.end_date = config.end_date;
	}
	function restoreConfig() {
		applyConfig(cachedSettings);
	}

	function applyConfig(config, dates) {
		gantt.config.scale_unit = config.scale_unit;
		if (config.date_scale) {
			gantt.config.date_scale = config.date_scale;
			gantt.templates.date_scale = null;
		}
		else {
			gantt.templates.date_scale = config.template;
		}

		gantt.config.step = config.step;
		gantt.config.subscales = config.subscales;

		if (dates) {
			gantt.config.start_date = gantt.date.add(dates.start_date, -1, config.unit);
			gantt.config.end_date = gantt.date.add(gantt.date[config.unit + "_start"](dates.end_date), 2, config.unit);
		} else {
			gantt.config.start_date = gantt.config.end_date = null;
		}
	}



	function zoomToFit() {
		var project = gantt.getSubtaskDates(),
		areaWidth = gantt.$task.offsetWidth;

		for (var i = 0; i < scaleConfigs.length; i++) {
			var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].unit, scaleConfigs[i].step);
			if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
				break;
			}
		}

		if (i == scaleConfigs.length) {
			i--;
		}

		applyConfig(scaleConfigs[i], project);
		gantt.render();
	}

	// get number of columns in timeline
	function getUnitsBetween(from, to, unit, step) {
		var start = new Date(from),
		end = new Date(to);
		var units = 0;
		while (start.valueOf() < end.valueOf()) {
			units++;
			start = gantt.date.add(start, step, unit);
		}
		return units;
	}

	//Setting available scales
	var scaleConfigs = [
		// minutes
		{ unit: "minute", step: 1, scale_unit: "hour", date_scale: "%H", subscales: [
		{unit: "minute", step: 1, date: "%H:%i"}
		]
	},
		// hours
		{ unit: "hour", step: 1, scale_unit: "day", date_scale: "%j %M",
		subscales: [
		{unit: "hour", step: 1, date: "%H:%i"}
		]
	},
		// days
		{ unit: "day", step: 1, scale_unit: "month", date_scale: "%F",
		subscales: [
		{unit: "day", step: 1, date: "%j"}
		]
	},
		// weeks
		{unit: "week", step: 1, scale_unit: "month", date_scale: "%F",
		subscales: [
		{unit: "week", step: 1, template: function (date) {
			var dateToStr = gantt.date.date_to_str("%d %M");
			var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		}}
		]},
		// months
		{ unit: "month", step: 1, scale_unit: "year", date_scale: "%Y",
		subscales: [
		{unit: "month", step: 1, date: "%M"}
		]},
		// quarters
		{ unit: "month", step: 3, scale_unit: "year", date_scale: "%Y",
		subscales: [
		{unit: "month", step: 3, template: function (date) {
			var dateToStr = gantt.date.date_to_str("%M");
			var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		}}
		]},
		// years
		{unit: "year", step: 1, scale_unit: "year", date_scale: "%Y",
		subscales: [
		{unit: "year", step: 5, template: function (date) {
			var dateToStr = gantt.date.date_to_str("%Y");
			var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		}}
		]},
		// decades
		{unit: "year", step: 10, scale_unit: "year", template: function (date) {
			var dateToStr = gantt.date.date_to_str("%Y");
			var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		},
		subscales: [
		{unit: "year", step: 100, template: function (date) {
			var dateToStr = gantt.date.date_to_str("%Y");
			var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		}}
		]}
		];
	//export pdf and image 

	gantt.templates.task_text = function(s,e,task){
		return "Export " + task.text;
	}
	gantt.config.columns[0].template = function(obj){
		return obj.text + " -";
	}
	gantt.init("gantt_here");
	gantt.parse(demo_tasks);

	function setScaleConfig(value){
		switch (value) {
			case "1":
			gantt.config.scale_unit = "day";
			gantt.config.step = 1;
			gantt.config.date_scale = "%d %M";
			gantt.config.subscales = [];
			gantt.config.scale_height = 27;
			gantt.templates.date_scale = null;
			break;
			case "2":
			var weekScaleTemplate = function(date){
				var dateToStr = gantt.date.date_to_str("%d %M");
				var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
				return dateToStr(date) + " - " + dateToStr(endDate);
			};

			gantt.config.scale_unit = "week";
			gantt.config.step = 1;
			gantt.templates.date_scale = weekScaleTemplate;
			gantt.config.subscales = [
			{unit:"day", step:1, date:"%D" }
			];
			gantt.config.scale_height = 50;
			break;
			case "3":
			gantt.config.scale_unit = "month";
			gantt.config.date_scale = "%F, %Y";
			gantt.config.subscales = [
			{unit:"day", step:1, date:"%j, %D" }
			];
			gantt.config.scale_height = 50;
			gantt.templates.date_scale = null;
			break;
			case "4":
			gantt.config.scale_unit = "year";
			gantt.config.step = 1;
			gantt.config.date_scale = "%Y";
			gantt.config.min_column_width = 50;

			gantt.config.scale_height = 90;
			gantt.templates.date_scale = null;


			gantt.config.subscales = [
			{unit:"month", step:1, date:"%M" }
			];
			break;
		}
	}

	setScaleConfig('1');

	gantt.init("gantt_here");
	// gantt.init("gantt_here", new Date(2013,0,1), new Date(2013,8,1));
	gantt.parse(demo_tasks);

	var func = function(e) {
		e = e || window.event;
		var el = e.target || e.srcElement;
		var value = el.value;
		setScaleConfig(value);
		gantt.render();
	};

	var els = document.getElementsByName("scale");
	for (var i = 0; i < els.length; i++) {
		els[i].onclick = func;
	}


}


function templateHelper($element){
	var template = $element[0].innerHTML;
	return template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function(match, prop){
		if (prop.indexOf("|") != -1){
			var parts = prop.split("|");
			return "\"+gantt.aFilter('"+(parts[1]).trim()+"')(task."+(parts[0]).trim()+")+\"";
		}
		return '"+task.'+prop+'+"';
	});
}


})();