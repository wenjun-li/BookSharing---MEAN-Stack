(function () {
    angular
        .module('wjlDirectives', [])
        .directive('wjlSortable', widgetListDir);

    function widgetListDir(WidgetService) {
        function  linkFunction(scope, element) {
            var startIndex = -1;
            var endIndex = -1;
            element.sortable({
                axis: "y",
                start: function (event, ui) {
                    startIndex = ui.item.index();
                },
                stop: function (event, ui) {
                    endIndex = ui.item.index();
                    //console.log([startIndex, endIndex]);
                    if(endIndex != null && startIndex != endIndex) {
                        WidgetService.reorderWidget(startIndex, endIndex);
                    }
                }
            });
        }
        return{
            link:linkFunction
        }
    }
})();
