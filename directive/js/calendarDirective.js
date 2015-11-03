/**
 * Created by izel on 31-10-15.
 */
angular.module('app').directive('calendarDirective',function($compile){
    return {
        restrict:'E',
        scope:{
            monthNameCalendar:'=',
            daysName:'=',
            calendarSize:'=',
            holyDays:'=',
            initialMonth:'=',
            selectDay:'&',
            model:'='
        },
        controller:function($scope,$element,$attrs){
            $scope.select=function(date){
                var newDate=new Date(date);
                $scope.selectDay()(newDate);
            };
        },
        link: {
            pre: function (scope, element, attr) {
                scope.month = buildDataDate();
                var table=angular.element('<table border="0" cellspacing="0" cellpadding="0">');
                var tbody=angular.element('<tbody>');
                var countMonths=scope.initialMonth-1;
                var columns=scope.calendarSize[0] ? scope.calendarSize[1] : 1;
                var rows=scope.calendarSize[1] ? scope.calendarSize[0] : 1;
                for(i=0;i<rows;i++){
                    var tr=angular.element('<tr>');
                    for(j=0;j<columns;j++){
                        var td=angular.element('<td class="content-month" align="left" valign="top" >');
                        scope.holyDay=buildHolyDays(countMonths);
                        if(scope.model.getMonth()==countMonths){
                            var stringDate=scope.model.toLocaleDateString().split('/');
                            stringDate=stringDate[2]+'/'+stringDate[1]+'/'+stringDate[0];
                            scope.holyDay.push({
                                day:scope.model.getDate(),
                                class:'dayNow',
                                //date:scope.model.toLocaleDateString().split('/'),
                                date:stringDate,
                                description:''
                            })
                        }
                        scope.monthValue=buildDataDate(countMonths);
                        countMonths++;
                        var month=angular.element('<month-directive month="{{monthValue}}" select-day="select" holy-day="{{holyDay}}">');
                        $compile(month)(scope);
                        $(td).append(month);
                        $(tr).append(td);
                    }
                    $(tbody).append(tr);
                }

                $(table).append(tbody);
                $compile(table)(scope);
                $(element).append(table);

                function buildHolyDays(month){
                    var arr=[];
                    angular.forEach(scope.holyDays,function(val){
                        if(val.date){
                            if(month==new Date(val.date).getMonth()){
                                arr.push(val);
                            }
                        }
                    });
                    return arr;
                }

                function buildDataDate(month) {
                    scope.monthName =
                        scope.monthName ? scope.monthName : ['January', 'Febrery', 'March', 'April', 'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'];
                    scope.daysName =
                        scope.daysName ? scope.daysName : ['Sunday', 'Monday', 'Tuesday', 'Westerday', 'Thursday', 'Friday', 'Saturday'];
                    var date = new Date(2015,month,1);
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    var firstDate = scope.monthName[month] + " " + 1 + " " + year;
                    var dayNo = new Date(firstDate).getDay();
                    var NumDays = new Date(year, month + 1, 0).getDate();
                    return {
                        date: date,
                        month: month,
                        DaysName:scope.daysName,
                        MonthName: scope.monthNameCalendar[month],
                        year: year,
                        firstDay: firstDate,
                        dayNo: dayNo,
                        NumDays: NumDays
                    }
                }
            },
        }
        //template:'<month-directive month="month" ></month-directive>'
    }
}).directive('monthDirective',function(){
    return{
        restrict:'E',
        replace: true,
        scope:{
            month:'@',
            holyDay:'@',
            selectDay:'&'
        },
        link:function(scope,element,attr){
            scope.month=scope.$eval(scope.month);
            scope.holyDay=scope.$eval(scope.holyDay);
            scope.holys=scope.holyDay;
            scope.MonthName=scope.month.MonthName;
            scope.year=scope.month.year;
            scope.numMonth=scope.month.month;
            scope.numWeek=new Array(4);
            scope.numDays=new Array(6);
            scope.DaysName=scope.month.DaysName;

            var date=1;
            var FnBuildMonth=function(){
                var month=[];
                for(var w = 0;w <= scope.numWeek.length ;w++){
                    var week=[];
                    for(var day = 0;day <=scope.numDays.length; day++){
                        if(date<=scope.month.NumDays){

                            var dayClass=checkHolyDate(date);
                            if(w==0){
                                if(scope.month.dayNo > day){
                            //        week.push('x');
                                    week.push({
                                        day:'',
                                    });
                                }else{
                                    week.push(dayClass);
                                    date++;
                                }
                            }else{
                                week.push(dayClass);
                                date++;
                            }
                            //date++;
                        }else{
                            week.push({
                                day:''
                            });
                        }
                    }
                    month.push(week);
                }
                return month;
            }

            function checkHolyDate(date){
                var temp={};
                angular.forEach(scope.holyDay,function(val){
                    var tmpDate=new Date(val.date);
                    if(date==tmpDate.getDate()){
                        temp=val;
                        //scope.holys.push(temp);
                    }
                });
                temp.day=date;
                return temp;
            }

            scope.BuildMonth=FnBuildMonth();
        },
        controller:function($scope,$element,$attrs){

            var positionDay={
                week:'',
                day:'',
            };
            var classDay='';

            $scope.date=function(day){
                $scope.selectDay()(Date($scope.year,$scope.numMonth,day));
            };
            $scope.getDay=function(date){
                return new Date(date.date).getDate();
            }
            $scope.upDay=function(date){
                angular.forEach($scope.BuildMonth,function(value,index){
                    angular.forEach(value,function(val,ind){
                        if(val.day==new Date(date.date).getDate()){
                            positionDay={
                                week:index,
                                day:ind,
                                class:val.class
                            }
                            console.log(positionDay);
                            val.class='dayHoli'
                            console.log(positionDay);
                        }
                    });
                });
            }
            $scope.downDay=function(date){
                $scope.BuildMonth[positionDay.week][positionDay.day].class=positionDay.class;
            }

            $scope.upDayDescription=function(date){
                if(date.date){
                    angular.forEach($scope.holys,function(val){
                        if(date.day==new Date(val.date).getDate()){
                            console.log(classDay)
                            classDay=val.class;
                            val.class='dayHoli';
                        }
                    })
                }
            }

            $scope.downDayDescription=function(date){
                if(date.date){
                    angular.forEach($scope.holys,function(val){
                        if(date.day==new Date(val.date).getDate()){
                            val.class = classDay;
                        }
                    })
                }
            }
        },
        template:'<div class="month">' +
                    '<div class="header-month">' +
                        '{{MonthName}} {{year}}' +
                    '</div>' +
                    '<div class="container-days">' +
                        '<table class="table-calendar">' +
                            '<thead>'+
                                '<tr>'+
                                    '<th ng-repeat="days in DaysName ">' +
                                        '<div class="th-header">'+
                                            '{{days}}' +
                                        '</div>'+
                                    '</th>'+
                                '</tr>' +
                            '<thead>'+
                            '<tbody>'+
                                '<tr class="cellDay" ng-repeat="week in BuildMonth">' +
                                    '<td  ng-mouseover="upDayDescription(day)" '+
                                        'ng-mouseleave="downDayDescription(day)" ng-repeat="day in week track by $index" '+
                                        'class="cellDay" ng-click="date(day)">'+
                                        '<div class="dayCss {{day.class}}">'+
                                            '{{day.day}}'+
                                        '</div>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</div >'+
                    '<div>'+
                        '<p ng-repeat="holy in holys track by $index" '+                            
                            'class="event-calendar"'+
                            'ng-mouseover="upDay(holy)" '+
                            'ng-mouseleave="downDay(holy)" '+
                            'ng-if="holy.description != \'\' ">'+                            
                                '{{getDay(holy)}} - {{holy.description}}'+
                                '<span class="cell-event {{holy.class}}"> </sapn>'+
                        '</p>'+
                    '</div>'+
                '</div>'
    }
});