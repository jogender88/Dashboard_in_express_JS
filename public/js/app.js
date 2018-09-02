var myApp = angular.module("myApp",[]);
    myApp.controller("mobilecontroller",function($scope){
        $scope.mobile=mobiles;
        
      
    });
    myApp.controller("musiccontroller",function($scope){
       
        $scope.music=musics;
    });
    myApp.controller("laptopcontroller",function($scope){
       
        $scope.laptop=laptops;
       
    });
