(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", widgetListController);

    function  widgetListController($sce, $routeParams, WidgetService, PageService) {
        var vm = this;
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.convertHtml = convertHtml;

        function  init() {
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;

            PageService
                .findPageById(vm.pageId)
                .then(function (page, err) {
                    if(err){
                        console.log("Cannot find the page");
                    } else {
                        return page.widgets;
                    }
                })
                .then(function (widgets) {
                    var widgetList = [];

                    for (w in widgets){
                        //var widget;
                        WidgetService
                            .findWidgetById(widgets[w])
                            .then(function (widget) {
                                widgetList.push(widget);
                            }, function (err) {
                                console.log(err);
                            });
                    }

                    vm.widgets = widgetList;
                });
        }
        init();

        function doYouTrustUrl(url) {
            var baseUrl = "https://www.youtube.com/embed/";
            var urlParts = url.split('/');
            var id = urlParts[urlParts.length - 1];
            baseUrl += id;

            return $sce.trustAsResourceUrl(baseUrl);
        }

        function convertHtml(html) {
            return $sce.trustAsHtml(html);
        }
    }
})();