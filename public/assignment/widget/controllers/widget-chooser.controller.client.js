(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetChooserController", widgetChooserController);

    function  widgetChooserController($routeParams, $location, WidgetService) {
        var vm = this;

        vm.addWidget = addWidget;

        function  init() {
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;
        }
        init();

        function addWidget(type) {
            var newWidget = {type: type};

            WidgetService
                .createWidget(vm.pageId, newWidget)
                .then(function (widget, err) {
                    if (widget){
                       $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widget._id);
                    } else {
                        console.log(err);
                        vm.error = "Unable to add widget!";
                    }
                });
        }
    }
})();