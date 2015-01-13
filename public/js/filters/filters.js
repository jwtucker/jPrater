angular.module('Filters', []).filter('categoryFilter', [function () {
    return function (items, subOptionList) {
        var tempItems = [];
        var isMatched = false;
        if (!angular.isUndefined(items) && !angular.isUndefined(subOptionList) && subOptionList.length > 0) {
                for(var i=0; i < items.length; i++){
                    if(items[i].categories.length == 0) tempItems.push(items[i]); //Outlier Case
                    for(var j=0; j < items[i].categories.length; j++){
                        for(var k=0; k < items[i].categories[j].subOptions.length; k++){
                            if(_.contains(subOptionList[j],items[i].categories[j].subOptions[k])){
                                isMatched = true;
                            }
                            if(subOptionList[j].length == 0) isMatched = true;
                        }
                        if(!isMatched) break;
                        else isMatched = false;
                        if(j == items[i].categories.length-1){
                            tempItems.push(items[i]);
                        }
                    }
                }
            return tempItems;
        }
        else {
            return items;
        }
    };
}]);