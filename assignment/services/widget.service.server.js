module.exports = function(app, model){
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.get("/api/page/:pid/widget", findWidgetsByPageId);
    app.get("/api/widget/:wgid", findWidgetById);
    app.post("/api/page/:pid/widget", createWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/page/:pid/widget", reorderWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    var WidgetModel = model.WidgetModel;
    var PageModel = model.PageModel;

    //
    // var widgets = [
    //     { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
    //     { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    //     { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
    //         "url": "http://lorempixel.com/400/200/"},
    //     { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum as html</p>"},
    //     { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    //     { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
    //         "url": "https://youtu.be/AM2Ivdi9c4E" },
    //     { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum as html</p>"}
    // ];

    function reorderWidget(req, res) {
        var pageId = req.params.pid;
        var originIndex = req.query.initial;
        var finalIndex = req.query.final;

        PageModel
            .reorderWidget(pageId, originIndex, finalIndex)
            .then(function (page) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });

    }

    function findWidgetsByPageId(req, res) {
        var pageId = req.params.pid;

        WidgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {

                console.log("in widget service server, find widgets by id, widgets:");
                for (w in widgets){
                    console.log(widgets[w].text);
                }

                res.send(widgets);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.wgid;

        WidgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                res.send(widget);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createWidget(req, res) {
        var pageId = req.params.pid;
        var newWidget = req.body;

        WidgetModel
            .createWidget(pageId, newWidget)
            .then(function (widget, err) {
                if (widget){
                    return widget;
                } else {
                    res.sendStatus(500).send(err);
                }
            })
            .then(function (widget) {
                PageModel
                    .addWidgetToPage(pageId, widget._id)
                    .then(function (page, err) {
                        if(page){
                            res.send(widget);
                        } else {
                            res.sendStatus(500).send(err);
                        }
                    })
            });
    }

    function updateWidget(req, res) {
        var widgetId = req.params.wgid;
        var newWidget = req.body;

        // console.log(widgetId);
        // console.log(newWidget);

        WidgetModel
            .updateWidget(widgetId, newWidget)
            .then(function (widget) {
                res.send(widget);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.wgid;

        WidgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                return PageModel.deleteWidgetFromPage(widget._page, widgetId);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                return WidgetModel.deleteWidget(widgetId);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;


        var url = /uploads/ + filename;

        WidgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                widget.url = url;
                return widget;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (widget) {
                return WidgetModel.updateWidget(widgetId, widget);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (widget) {
                res.redirect(301, "/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            }, function (err) {

            });
    }

};