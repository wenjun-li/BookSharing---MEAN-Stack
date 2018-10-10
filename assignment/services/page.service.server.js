module.exports = function(app, model){
    app.get("/api/website/:wid/page", findPageByWebsiteId);
    app.get("/api/page/:pid", findPageById);
    app.put("/api/page/:pid", updatePage);
    app.post("/api/website/:wid/page/", createPage);
    app.delete("/api/page/:pid", deletePage);

    var PageModel = model.PageModel;
    var WebsiteModel = model.WebsiteModel;

    function findPageByWebsiteId(req, res) {
        var websiteId = req.params.wid;

        PageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.send(pages);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findPageById(req, res) {
        var pageId = req.params.pid;

        PageModel
            .findPageById(pageId)
            .then(function (page) {
                res.send(page);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updatePage(req, res) {
        var pageId = req.params.pid;
        var newPage = req.body;

        PageModel
            .updatePage(pageId, newPage)
            .then(function (page) {
                res.send(page);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createPage(req, res) {
        var websiteId = req.params.wid;
        var page = req.body;

        var newPage = {
            _website: websiteId,
            name: page.name,
            description: page.description
        };

        PageModel
            .createPage(websiteId, newPage)
            .then(function (page, err) {
                if (page){
                    return page;
                } else {
                    res.sendStatus(500).send(err);
                }
            })
            .then(function (page) {
                WebsiteModel
                    .addPageToWebsite(websiteId, page._id)
                    .then(function (website, err) {
                        if(website){
                            res.send(page);
                        } else {
                            res.sendStatus(500).send(err);
                        }
                    })
            });
    }

    function deletePage(req, res) {
        var pageId = req.params.pid;

        PageModel
            .findPageById(pageId)
            .then(function (page) {
                return WebsiteModel.deletePageFromWebsite(page._website, pageId);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                return PageModel.deletePage(pageId);
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