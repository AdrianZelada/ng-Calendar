/**
 * Created by izel on 31-10-15.
 */
angular.module('app',[]).controller('main',function($scope){
    $scope.monthName=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    $scope.daysName=['Do','Lu','Ma','Mi','Ju','Vi','Sa'];
    $scope.holy=[
        {
            class:'holyDay',
            date:'2015/1/1',
            description:'año Nuevo'
        },
        {
            class:'holyDay',
            date:'2015/1/24',
            description:'alasitas'
        },
        {
            class:'holy',
            date:'2015/1/25',
            description:'test1'
        },
        {
            class:'holy',
            date:'2015/2/24',
            description:'Cody'
        },
        {
            class:'holyDay',
            date:'2015/2/15',
            description:'carnaval'
        }
    ]
    //$scope.model=new Date('2015/10/22');
    $scope.model=new Date();
    $scope.select=function(date){
        console.dir(date);
    }
});