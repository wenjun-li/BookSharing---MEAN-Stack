(function () {
    angular
        .module("WebAppMaker")
        .service("PageService", PageService);

    function PageService($http, $routeParams) {
        this.createPage = createPage;
        this.findPageByWebsiteId = findPageByWebsiteId;
        this.findPageById = findPageById;
        this.updatePage = updatePage;
        this.deletePage = deletePage;

        function init() {
            this.websiteId = $routeParams.wid;
            this.pageId = $routeParams.pid;
        }
        init();

        function createPage(websiteId, newPage) {
            return $http.post("/api/website/" + websiteId + "/page/", newPage)
                .then(function (response) {
                    return response.data;
                });
        }

        function findPageByWebsiteId(websiteId) {
            return $http.get("/api/website/" + websiteId + "/page")
                .then(function (response) {
                    return response.data;
                });
        }

        function findPageById(pageId) {
            return $http.get("/api/page/" + pageId)
                .then(function (response) {
                    return response.data;
                });
        }

        function updatePage(pageId, newPage) {
            return $http.put("/api/page/" + pageId, newPage)
                .then(function (response) {
                    return response.data;
                });
        }

        function deletePage(pageId) {
            return $http.delete("/api/page/" + pageId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();