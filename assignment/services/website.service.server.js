module.exports = function (app, model) {
    app.get("/api/user/:uid/website", findWebsiteByUser);
    app.get("/api/website/:wid", findWebsiteById);
    app.post( "/api/user/:uid/website", createWebsite);
    app.put("/api/website/:wid", updateWebsite);
    app.delete("/api/website/:wid", deleteWebsite);

    var WebsiteModel = model.WebsiteModel;
    var UserModel = model.UserModel;

    function findWebsiteByUser(req, res) {
        var userId = req.params.uid;
        WebsiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                res.send(websites);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.wid;
        WebsiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                res.send(website);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createWebsite(req, res) {
        var website = req.body;
        var userId = req.params.uid;

        var newWebsite = {
            _user: userId,
            name: website.name,
            description: website.description
        };

        WebsiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(function (website, err) {
                if (website){
                    return website;
                } else {
                    res.sendStatus(500).send(err);
                }
            })
            .then(function (website) {
                UserModel
                    .addWebsiteToUser(userId, website._id)
                    .then(function (user, err) {
                        if(user){
                            //console.log(user);
                            res.send(website);
                        } else {
                            res.sendStatus(500).send(err);
                        }
                    })
            });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.wid;
        var newWebsite = req.body;

        WebsiteModel
            .updateWebsite(websiteId, newWebsite)
            .then(function (website) {
                res.send(website);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteWebsite(req, res) {

        var websiteId = req.params.wid;

        WebsiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                return UserModel.deleteWebsiteFromUser(website._user, websiteId);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                return WebsiteModel.deleteWebsite(websiteId);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }



};