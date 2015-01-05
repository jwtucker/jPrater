angular.module('Filters', []).filter('brandFilter', [function () {
    return function (items, brandSelect) {
        if (!angular.isUndefined(items) && !angular.isUndefined(brandSelect) && brandSelect.length > 0) {
            var tempItems = [];
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    for (var j = 0; j < item.brand.length; j++){
                        if(_.contains(brandSelect,item.brand[j]) && !(_.contains(tempItems,item))){
                            tempItems.push(item);
                        }
                    }
                }
            return tempItems;
        }
        else {
            console.log("Returned else");
            return items;
        }
    };
}]);