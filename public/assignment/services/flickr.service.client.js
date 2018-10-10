(function () {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    //var key = process.env.FLICKR_KEY;
    //var secret = process.env.FLICKR_SECRET;
    var key = "df70bd4e76062d7e87140cb18cf8072a";
    var secret = "0d8378768cff9877";
    var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";


    function FlickrService($http) {
        var api = {
            "searchPhotos": searchPhotos
        };
        return api;

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            //console.log(url);

            return $http.get(url)
                    .then(function (response) {
                        //console.log(response.data);
                        return response.data;
                     });
        }


    }
})();