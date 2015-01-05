// public/js/services/Service.js
angular.module('Service', []).factory('item', ['$http', function($http) {

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

}]);