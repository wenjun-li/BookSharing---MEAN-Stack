(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", widgetEditController);

    function  widgetEditController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.editWidget = editWidget;
        vm.deleteWidget = deleteWidget;

        function  init() {
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;
            vm.widgetId = $routeParams.wgid;

            WidgetService
                .findWidgetById(vm.widgetId)
                .then(function (widget, err) {
                    if (err) {
                        console.log("Cannot find widget by page id");
                    } else {
                        vm.widget = widget;
                    }
                });
        }
        init();

        function editWidget(newWidget) {
            console.log(newWidget);

            WidgetService
                .updateWidget(vm.widgetId, newWidget)
                .then(function (widget) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }, function (err) {
                    vm.error = "Failed to update the widget!";
                    console.log(err);
                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .then(function (status) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }, function (err) {
                    vm.error = "Unable to delete widget";
                    console.log(err);
                });
        }
    }
})();