(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", websiteListController);

    function  websiteListController($routeParams, WebsiteService) {
        var userId = $routeParams.uid;

        var vm = this;

        function init() {
            vm.userId = userId;
            //console.log(vm.userId);

            WebsiteService
                .findWebsiteByUser(userId)
                .then(function (websites, err) {
                    if (err) {
                        console.log("Cannot find websites by user");
                    } else {
                        vm.websites = websites;
                    }
                });

/*            var promise = WebsiteService.findWebsiteByUser(vm.userId);
            promise
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function () {
                   vm.error = "Cannot find websites";
                });
            return promise;*/
        }
        init();

    }
})();