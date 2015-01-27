// public/js/services/Service.js
angular.module('Service', [])

.factory('item', ['$http', function($http) {

    return {
        // call to get all items
        get : function() {
            return $http.get('/api/items');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new item
        create : function(itemData) {
            return $http.post('/api/items', itemData);
        },

        // call to DELETE a item
        delete : function(id) {
            return $http.delete('/api/items/' + id);
        }
    }       

}])

.factory("flash", function($rootScope) {
    var queue = [];
    var currentMessage = "";
    var user;

    $rootScope.$on("$routeChangeSuccess", function() {
        currentMessage = queue.shift() || "";
    });

    return {
        setMessage: function(message) {
            queue.push(message);
        },

        getMessage: function() { 
            return currentMessage;
        },

        setUser: function(userName) {
            user = userName;
        },

        getUser: function(){
            if(user) return user;
            return "No User";
        }
    };
});




