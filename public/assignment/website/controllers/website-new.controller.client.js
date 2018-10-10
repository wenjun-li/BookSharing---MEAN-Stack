(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", websiteNewController);

    function websiteNewController($routeParams, $location, WebsiteService) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;

        var vm = this;
        vm.userId = userId;
        vm.newWebsite = newWebsite;

        function init() {
            WebsiteService
                .findWebsiteByUser(userId)
                .then(function (websites) {
                    vm.websites = websites;
                }, function (err) {
                    console.log("Cannot get websites by username: " + err);
                });

            // WebsiteService
            //     .findWebsiteById(websiteId)
            //     .then(function (err) {
            //         console.log("Cannot get website by id" + err);
            //     }, function (website) {
            //         vm.website = website;
            //     });

            // var promise1 = WebsiteService.findWebsiteByUser(userId);
            // promise1
            //     .success(function (websites) {
            //         vm.websites = websites;
            //     })
            //     .error(function () {
            //         console.log("Cannot get websites by username");
            //     });

            // var promise2 = WebsiteService.findWebsiteById(websiteId);
            // promise2
            //     .success(function (website) {
            //         vm.website = website;
            //     })
            //     .error(function () {
            //         console.log("Cannot get website by id");
            //     });
        }
        init();

        function newWebsite(newWebsite) {
            WebsiteService
                .createWebsite(userId, newWebsite)
                .then(function (website, err) {
                    if (website) {
                        $location.url("/user/" + userId + "/website/");
                    } else {
                        vm.error = "Failed to create new website!";
                    }
                });

            /*var promise = WebsiteService.createWebsite(userId, newWebsite);
            promise
                .success(function () {
                    $location.url("/user/" + userId + "/website/");
                })
                .error(function () {
                    vm.error = "Failed to create new website!";
                });*/
        }

    }
})();
