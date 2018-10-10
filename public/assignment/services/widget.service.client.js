(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", WidgetService);

    function WidgetService($http, $routeParams) {
        this.createWidget = createWidget;
        this.findWidgetsByPageId = findWidgetsByPageId;
        this.findWidgetById = findWidgetById;
        this.updateWidget = updateWidget;
        this.deleteWidget = deleteWidget;
        this.reorderWidget = reorderWidget;

        function init() {
            this.userId = $routeParams.uid;
            this.websiteId = $routeParams.wid;
            this.pageId = $routeParams.pid;
            this.widgetId = $routeParams.wgid;
        }
        init();
        
        function reorderWidget(index1, index2) {
            return $http.put("/api/page/" + pageId + "/widget?initial=" + index1 + "&final=" + index2)
                .then(function (response) {
                    return response.data;
                });
        }

        function createWidget(pageId, newWidget) {
            return $http.post("/api/page/"+ pageId +"/widget", newWidget)
                .then(function (response) {
                   return response.data;
                });
        }

        function findWidgetsByPageId(pageId) {
            return $http.get("/api/page/" + pageId + "/widget")
                .then(function (response) {
                    return response.data;
                });
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/" + widgetId)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateWidget(widgetId, newWidget) {
            return $http.put("/api/widget/" + widgetId, newWidget)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/" + widgetId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();