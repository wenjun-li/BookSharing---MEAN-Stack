(function(){
    angular
        .module("WebAppMaker")
        .controller("PageEditController", pageEditController);

    function  pageEditController($routeParams, $location, PageService) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;

        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function  init() {
            vm.userId = userId;
            vm.websiteId = websiteId;
            vm.pageId = pageId;

            PageService
                .findPageById(pageId)
                .then(function (page) {
                    vm.page = page;
                }, function (err) {
                    console.log("Cannot get page by id");
                });


            // var promise = PageService.findPageById(pageId);
            // promise
            //     .success(function (page) {
            //         vm.page = page;
            //     })
            //     .error(function () {
            //         console.log("Cannot get page by id");
            //     });
        }
        init();

        function updatePage(newPage){
            // var promise = PageService.updatePage(pageId, newPage);
            // promise
            //     .success(function () {
            //         $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
            //     })
            //     .error(function () {
            //         vm.error = "Failed to update page!";
            //     });
            PageService
                .updatePage(pageId, newPage)
                .then(function (page) {
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
                }, function (err) {
                    vm.error = "Failed to update page!";
                    console.log(err);
                });

        }

        function deletePage() {
            PageService
                .deletePage(pageId)
                .then(function (page) {
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                }, function (err) {
                    vm.error = "Unable to delete the page";
                    console.log(err);
                });

            //
            // var promise = PageService.deletePage(pageId);
            // promise
            //     .success(function () {
            //         $location.url("/user/" + userId + "/website/" + websiteId + "/page");
            //     })
            //     .error(function () {
            //        vm.error = "Unable to delete the page";
            //     });
        }
    }
})();