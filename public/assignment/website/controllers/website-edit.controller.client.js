(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", websiteEditController);

    function websiteEditController($routeParams, $location, WebsiteService) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;

        var vm = this;
        vm.userId = userId;
        vm.edit = edit;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsiteByUser(userId)
                .then(function (websites) {
                    vm.websites = websites;
                }, function (err) {
                    console.log("Cannot get websites by username: " + err);
                });

            //console.log(websiteId);
            WebsiteService
                .findWebsiteById(websiteId)
                .then(function (website) {
                    //console.log(website);
                    vm.website = website;
                }, function (err) {
                    console.log("Cannot get website by id: " + err);
                });

            // var promise1 = WebsiteService.findWebsiteByUser(userId);
            // promise1
            //     .success(function (websites) {
            //         vm.websites = websites;
            //     })
            //     .error(function () {
            //         console.log("Cannot get websites by username");
            //     });
            //
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

        function edit(newWebsite) {
            WebsiteService
                .updateWebsite(websiteId, newWebsite)
                .then(function (website) {
                    $location.url("/user/" + userId + "/website/");
                }, function (err) {
                    vm.error = "Fail to update the website!";
                    console.log(err);
                });
            // var promise = WebsiteService.updateWebsite(websiteId, newWebsite);
            // promise
            //     .success(function () {
            //         $location.url("/user/");
            //     })
            //     .error(function () {
            //         vm.error = "Fail to update the website!";
            //     });
        }

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(websiteId)
                .then(function (status) {
                    $location.url("/user/" + userId + "/website/");
                }, function (err) {
                    vm.error = "Unable to delete website";
                    console.log(err);
                });

            // var promise = WebsiteService.deleteWebsite(websiteId);
            // promise
            //     .success(function () {
            //         $location.url("/user/" + userId + "/website/");
            //     })
            //     .error(function () {
            //         vm.error = "Unable to delete website";
            //     });
        }
    }
})();
