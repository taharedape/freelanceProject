/*
 @author : Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
 @version: 2.0.2

 @description:  MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates.
 Css style can be changed by editing less or css stylesheet.
 See scope declaration below for options you can pass through html directive.
 Feel free to edit and share this piece of code, our idea is to keep it simple ;)

 Demo page : http://arca-computing.github.io/MultipleDatePicker/
 */
(function (angular) {
    'use strict';
    var multipleDatePicker = function () {
        return {
            restrict: 'AE',
            scope: {
                /*
                 * Type : Array of moment dates
                 * Array will mutate when user select/unselect a date
                 */
                ngModel: '=?',
                /*
                 * Type: array of objects (see doc)
                 * Days to highlights
                 * */
                highlightDays: '=?',
                /*
                 * Type : function
                 * Will be called to manage (un)selection of a date
                 */
                dayClick: '=?',
                /*
                 * Type : function
                 * Will be called to manage hover of a date
                 */
                dayHover: '=?',

                /*
                 * Type: moment date
                 * Month to be displayed
                 * Default is current month
                 */
                month: '=?',

                /*
                 * Type: function(newMonth, oldMonth)
                 * Will be called when month changed
                 * Param newMonth/oldMonth will be the first day of month at midnight
                 * */
                monthChanged: '=?',
                /*
                 * Type: array of integers
                 * Recurrent week days not selectables
                 * /!\ Sunday = 0, Monday = 1 ... Saturday = 6
                 * */
                weekDaysOff: '=?',
                /*
                 * Type: boolean
                 * Set all days off
                 * */
                allDaysOff: '=?',
                /*
                 * Type: array of moment dates
                 * Set days allowed (only thos dates will be selectable)
                 * */
                daysAllowed: '=?',
                /*
                 * Type: boolean
                 * Sunday be the first day of week, default will be Monday
                 * */
                sundayFirstDay: '=?',
                /*
                 * Type: boolean
                 * if true can't go back in months before today's month
                 * */
                disallowBackPastMonths: '=?',
                /*
                 * Type: boolean
                 * if true can't go in futur months after today's month
                 * */
                disallowGoFuturMonths: '=?',
                /*
                 * Type: boolean
                 * if true empty boxes will be filled with days of previous/next month
                 * */
                showDaysOfSurroundingMonths: '=?',
                /*
                 * Type: string
                 * CSS classes to apply to days of next/previous months
                 * */
                cssDaysOfSurroundingMonths: '=?',
                /*
                 * Type: boolean
                 * if true events on empty boxes (or next/previous month) will be fired
                 * */
                fireEventsForDaysOfSurroundingMonths: '=?',
                /*
                 * Type: any type moment can parse
                 * If filled will disable all days before this one (not included)
                 * */
                disableDaysBefore: '=?',
                /*
                 * Type: any type moment can parse
                 * If filled will disable all days after this one (not included)
                 * */
                disableDaysAfter: '=?'
            },
            template: '<div class="multiple-date-picker">' +
            '<div class="picker-top-row">' +
            '<div class="picker-month f-blue">{{month.format(\'MMMM\')}}</div>' +
            '<div class="text-center picker-navigate picker-navigate-left-arrow" ng-class="{\'disabled\':disableBackButton}" ng-click="previousMonth()"><i class="zmdi zmdi-chevron-left"></i></div>' +
            '<div class="text-center picker-navigate picker-navigate-right-arrow" ng-class="{\'disabled\':disableNextButton}" ng-click="nextMonth()"><i class="zmdi zmdi-chevron-right"></i></div>' +
            '</div>' +
            '<div class="picker-days-week-row">' +
            '<div class="text-center f-black f-600 f-10" ng-repeat="day in daysOfWeek">{{day}}</div>' +
            '</div>' +
            '<div class="picker-days-row">' +
            '<div class="text-center picker-day {{!day.mdp.otherMonth || showDaysOfSurroundingMonths ? day.css : \'\'}} {{day.mdp.otherMonth ? cssDaysOfSurroundingMonths : \'\'}}" title="{{day.title}}" ng-repeat="day in days" ng-click="toggleDay($event, day)" ng-mouseover="hoverDay($event, day)" ng-mouseleave="dayHover($event, day)" ng-class="{\'picker-selected\':day.mdp.selected, \'picker-off\':!day.selectable, \'today\':day.mdp.today,\'past\':day.mdp.past,\'future\':day.mdp.future, \'picker-other-month\':day.mdp.otherMonth}">{{day ? day.mdp.otherMonth && !showDaysOfSurroundingMonths ? \'&nbsp;\' : day.date.format(\'D\') : \'\'}}</div>' +
            '</div>' +
            '</div>',
            link: function (scope) {

                scope.ngModel = scope.ngModel || [];

                /*utility functions*/
                var checkNavigationButtons = function () {
                        var today = moment(),
                            previousMonth = moment(scope.month).subtract(1, 'month'),
                            nextMonth = moment(scope.month).add(1, 'month');
                        scope.disableBackButton = scope.disallowBackPastMonths && today.isAfter(previousMonth, 'month');
                        scope.disableNextButton = scope.disallowGoFuturMonths && today.isBefore(nextMonth, 'month');
                    },
                    getDaysOfWeek = function () {
                        /*To display days of week names in moment.lang*/
                        var momentDaysOfWeek = moment().localeData()._weekdaysMin,
                            days = [];

                        for (var i = 1; i < 7; i++) {
                            days.push(momentDaysOfWeek[i]);
                        }

                        if (scope.sundayFirstDay) {
                            days.splice(0, 0, momentDaysOfWeek[0]);
                        } else {
                            days.push(momentDaysOfWeek[0]);
                        }

                        return days;
                    };

                /*scope functions*/
                scope.$watch('ngModel', function () {
                    scope.generate();
                }, true);

                scope.$watch('highlightDays', function () {
                    scope.generate();
                }, true);

                scope.$watch('weekDaysOff', function () {
                    scope.generate();
                }, true);

                scope.$watch('allDaysOff', function () {
                    scope.generate();
                }, true);

                scope.$watch('daysAllowed', function () {
                    scope.generate();
                }, true);

                //default values
                scope.month = scope.month || moment().startOf('day');
                scope.days = [];
                scope.weekDaysOff = scope.weekDaysOff || [];
                scope.daysOff = scope.daysOff || [];
                scope.disableBackButton = false;
                scope.disableNextButton = false;
                scope.daysOfWeek = getDaysOfWeek();
                scope.cssDaysOfSurroundingMonths = scope.cssDaysOfSurroundingMonths || 'picker-empty';

                /**
                 * Called when user clicks a date
                 * @param event event the click event
                 * @param day "complex" mdp object with all properties
                 */
                scope.toggleDay = function (event, day) {
                    event.preventDefault();

                    if (day.mdp.otherMonth && !scope.fireEventsForDaysOfSurroundingMonths) {
                        return;
                    }

                    var prevented = false;

                    event.preventDefault = function () {
                        prevented = true;
                    };

                    if (typeof scope.dayClick == 'function') {
                        scope.dayClick(event, day);
                    }

                    if (day.selectable && !prevented) {
                        day.mdp.selected = !day.mdp.selected;

                        if (day.mdp.selected) {
                            scope.ngModel.push(day.date);
                        } else {
                            scope.ngModel = scope.ngModel.filter(function (date) {
                                return !day.date.isSame(date, 'day');
                            });
                        }
                    }
                };

                /**
                 * Hover day
                 * @param event hover event
                 * @param day "complex" mdp object with all properties
                 */
                scope.hoverDay = function (event, day) {
                    event.preventDefault();
                    var prevented = false;

                    event.preventDefault = function () {
                        prevented = true;
                    };

                    if (typeof scope.dayHover == 'function') {
                        scope.dayHover(event, day);
                    }

                    if (!prevented) {
                        day.mdp.hover = event.type === 'mouseover';
                    }
                };

                /*Navigate to previous month*/
                scope.previousMonth = function () {
                    if (!scope.disableBackButton) {
                        var oldMonth = moment(scope.month);
                        scope.month = scope.month.subtract(1, 'month');
                        if (typeof scope.monthChanged == 'function') {
                            scope.monthChanged(scope.month, oldMonth);
                        }
                        scope.generate();
                    }
                };

                /*Navigate to next month*/
                scope.nextMonth = function () {
                    if (!scope.disableNextButton) {
                        var oldMonth = moment(scope.month);
                        scope.month = scope.month.add(1, 'month');
                        if (typeof scope.monthChanged == 'function') {
                            scope.monthChanged(scope.month, oldMonth);
                        }
                        scope.generate();
                    }
                };

                /*Check if the date is off : unselectable*/
                scope.isDayOff = function (day) {
                    return scope.allDaysOff ||
                        (!!scope.disableDaysBefore && moment(day.date).isBefore(scope.disableDaysBefore, 'day')) ||
                        (!!scope.disableDaysAfter && moment(day.date).isAfter(scope.disableDaysAfter, 'day')) ||
                        (angular.isArray(scope.weekDaysOff) && scope.weekDaysOff.some(function (dayOff) {
                            return day.date.day() === dayOff;
                        })) ||
                        (angular.isArray(scope.daysOff) && scope.daysOff.some(function (dayOff) {
                            return day.date.isSame(dayOff, 'day');
                        })) ||
                        (angular.isArray(scope.daysAllowed) && !scope.daysAllowed.some(function (dayAllowed) {
                            return day.date.isSame(dayAllowed, 'day');
                        })) ||
                        (angular.isArray(scope.highlightDays) && scope.highlightDays.some(function (highlightDay) {
                            return day.date.isSame(highlightDay.date, 'day') && !highlightDay.selectable;
                        }));
                };

                /*Check if the date is selected*/
                scope.isSelected = function (day) {
                    return scope.ngModel.some(function (d) {
                        return day.date.isSame(d, 'day');
                    });
                };

                /*Generate the calendar*/
                scope.generate = function () {
                    var previousDay = moment(scope.month).date(0).day(scope.sundayFirstDay ? 0 : 1).subtract(1, 'day');

                    if (moment(scope.month).date(0).diff(previousDay, 'day') > 6) {
                        previousDay = previousDay.add(1, 'week');
                    }

                    var firstDayOfMonth = moment(scope.month).date(1),
                        days = [],
                        now = moment(),
                        lastDay = moment(firstDayOfMonth).endOf('month'),
                        createDate = function () {
                            var day = {
                                date: moment(previousDay.add(1, 'day')),
                                mdp: {
                                    selected: false
                                }
                            };
                            if (angular.isArray(scope.highlightDays)) {
                                var hlDay = scope.highlightDays.filter(function (d) {
                                    return day.date.isSame(d.date, 'day');
                                });
                                day.css = hlDay.length > 0 ? hlDay[0].css : '';
                                day.title = hlDay.length > 0 ? hlDay[0].title : '';
                            }
                            day.selectable = !scope.isDayOff(day);
                            day.mdp.selected = scope.isSelected(day);
                            day.mdp.today = day.date.isSame(now, 'day');
                            day.mdp.past = day.date.isBefore(now, 'day');
                            day.mdp.future = day.date.isAfter(now, 'day');
                            if (!day.date.isSame(scope.month, 'month')) {
                                day.mdp.otherMonth = true;
                            }
                            return day;
                        },
                        maxDays = lastDay.diff(previousDay, 'days'),
                        lastDayOfWeek = scope.sundayFirstDay ? 6 : 0;

                    if (lastDay.day() !== lastDayOfWeek) {
                        maxDays += (scope.sundayFirstDay ? 6 : 7) - lastDay.day();
                    }

                    for (var j = 0; j < maxDays; j++) {
                        days.push(createDate());
                    }

                    scope.days = days;
                    checkNavigationButtons();
                };

                scope.generate();
            }
        };
    };

    angular.module('multipleDatePicker', [])
        .directive('multipleDatePicker', multipleDatePicker);

})(window.angular);