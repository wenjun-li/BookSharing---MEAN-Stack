(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", pageListController);

    function  pageListController($routeParams, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;

            PageService
                .findPageByWebsiteId(websiteId)
                .then(function (pages, err) {
                    if (err) {
                        console.log("Cannot find pages by website id");
                    } else {
                        vm.pages = pages;
                    }
                });

            // var promise = PageService.findPageByWebsiteId(vm.websiteId);
            // promise
            //     .success(function (pages) {
            //         vm.pages = pages;
            //     })
            //     .error(function () {
            //         vm.error = "Could not find pages";
            //     });
            // return promise;
        }
        init();

    }
})();