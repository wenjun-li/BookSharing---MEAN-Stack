(function () {
    angular
        .module("WebAppMaker")
        .service("WebsiteService", WebsiteService);

    function WebsiteService($http, $routeParams) {
        this.createWebsite = createWebsite;
        this.findWebsiteByUser = findWebsiteByUser;
        this.findWebsiteById = findWebsiteById;
        this.updateWebsite = updateWebsite;
        this.deleteWebsite = deleteWebsite;

        function init() {
            this.userId = $routeParams.uid;
        }
        init();

        function createWebsite(userId, newWebsite) {
            return $http.post("/api/user/" + userId + "/website", newWebsite)
                .then(function (response) {
                    return response.data;
                });
        }

        function findWebsiteByUser(userId) {
            return $http.get("/api/user/" + userId + "/website")
                .then(function (response) {
                    return response.data;
                });
        }

        function findWebsiteById(websiteId) {
            return $http.get("/api/website/" + websiteId)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateWebsite(websiteId, newWebsite) {
            return $http.put("/api/website/" + websiteId, newWebsite)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteWebsite(websiteId) {
            return $http.delete("/api/website/" + websiteId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();