(function(){
    angular
        .module("WebAppMaker")
        .controller("PageNewController", pageNewController);

    function  pageNewController($routeParams, $location, PageService) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;

        var vm = this;
        vm.newPage = newPage;

        function  init() {
            vm.userId = userId;
            vm.websiteId = websiteId;
        }
        init();

        function newPage(newP){
            PageService
                .createPage(websiteId, newP)
                .then(function (page, err) {
                    if (page) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
                    } else {
                        vm.error = "Failed to create page!";
                        console.log(err);
                    }
                });

            // var promise = PageService.createPage(websiteId, newP);
            // promise
            //     .success(function () {
            //         $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
            //     })
            //     .error(function () {
            //         vm.error = "Failed to create page!";
            //     });
        }
    }
})();