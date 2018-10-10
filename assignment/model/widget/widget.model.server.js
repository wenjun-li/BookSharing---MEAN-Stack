module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server.js')();

    var widgetModel = mongoose.model('WidgetModel', WidgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget
    };
    return api;

    function findAllWidgetsForPage(pageId) {
        var deferred = q.defer();
        //console.log("in model find all websites for user: " + userId);
        widgetModel
            .find({_page: pageId}, function (err, widgets) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    deferred.resolve(widgets);
                }
            });
        return deferred.promise;
    }

    function createWidget(pageId, newWidget) {
        newWidget._page = pageId;

        var deferred = q.defer();
        widgetModel.create(newWidget, function (err, widget) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(widget);
            }
        });

        return deferred.promise;
    }

    function updateWidget(widgetId, newWidget) {
        newWidget._id = widgetId;

        var deferred = q.defer();

        switch(newWidget.type){
            case "HEADER":
                widgetModel
                    .update(
                        {_id: widgetId},
                        {$set: {size: newWidget.size, text: newWidget.text}},
                        function (err, status) {
                            if (err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(status);
                            }
                        });
                break;
            case "IMAGE":
                widgetModel
                    .update(
                        {_id: widgetId},
                        {$set: {width: newWidget.width, url: newWidget.url}},
                        function (err, status) {
                            if (err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(status);
                            }
                        });
                break;
            case "HTML":
                widgetModel
                    .update(
                        {_id: widgetId},
                        {$set: {text: newWidget.text}},
                        function (err, status) {
                            if (err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(status);
                            }
                        });
                break;
            case "YOUTUBE":
                widgetModel
                    .update(
                        {_id: widgetId},
                        {$set: {width: newWidget.width, url: newWidget.url}},
                        function (err, status) {
                            if (err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(status);
                            }
                        });
                break;
            case "TEXT":
                widgetModel
                    .update(
                        {_id: widgetId},
                        {$set: {text: newWidget.text, rows: newWidget.rows,
                            placeholder: newWidget.placeholder, formatted: newWidget.formatted}},
                        function (err, status) {
                            if (err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(status);
                            }
                        });
                break;
            default:
                break;
        }

        return deferred.promise;
    }


    function findWidgetById(widgetId) {
        var deferred = q.defer();
        widgetModel.findById(widgetId, function (err, widget) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(widget);
            }
        });
        return deferred.promise;
    }

    function deleteWidget(widgetId) {
        var deferred = q.defer();
        widgetModel
            .remove({_id: widgetId}, function (err, status) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
};