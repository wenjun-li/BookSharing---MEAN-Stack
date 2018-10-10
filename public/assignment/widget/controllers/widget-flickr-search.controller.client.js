(function(){
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", flickrImageSearchController);

    function  flickrImageSearchController($routeParams, $location, FlickrService, WidgetService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function  init() {
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;
            vm.widgetId = $routeParams.wgid;
        }
        init();

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";


            var newWidget = {_id: vm.widgetId,
                             url: url,
                            type: 'IMAGE',
                            _page: vm.pageId};

            WidgetService
                .updateWidget(vm.widgetId, newWidget)
                .then(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                });
        }

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(data) {
                    data = data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }
    }
})();