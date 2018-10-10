module.exports = function (app) {
    const https = require('https');
    const querystring = require('querystring');


    var apiKey = "df70bd4e76062d7e87140cb18cf8072a";
    var secret = "0d8378768cff9877";
    var apiPrefix = "/api/flickr";

    app.get(apiPrefix + '/:flickrMethod', flickrProxy);

    var endpoint  = 'https://api.flickr.com/services/rest/?method=METHOD&api_key=API_KEY&format=json';
    var host = 'api.flickr.com';
    var pathTemplate = '/services/rest/?method=METHOD&api_key=API_KEY&format=json';

    endpoint = endpoint.replace('API_KEY', apiKey);
    pathTemplate = pathTemplate.replace('API_KEY', apiKey);

    function flickrProxy(req, res) {
        var flickrMethod = req.params.flickrMethod;
        var url = endpoint.replace('METHOD', flickrMethod);
        var path = pathTemplate.replace('METHOD', flickrMethod);
        return httpsResponse(req, res, path);
    }

    function httpsResponse(req, res, path) {
        var query = querystring.stringify(req.query);
        path += '&'+query;
        https.get({
            host: host,
            path: path
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                body = body.replace('jsonFlickrApi(', '');
                body = body.substr(0, body.length-1);
                body = JSON.parse(body);
                res.json(body);
            });
        });
    }
};