module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var PageSchema = require('./page.schema.server.js')();

    var pageModel = mongoose.model('PageModel', PageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        addWidgetToPage: addWidgetToPage,
        deleteWidgetFromPage: deleteWidgetFromPage,
        reorderWidget: reorderWidget
    };
    return api;

    function reorderWidget(pageId, start, end) {
        var deferred = q.defer();
        pageModel
            .findById(pageId, function (err, page) {
                if (err){
                    deferred.abort(err);
                } else {
                    page.widgets.splice(end, 0, page.widgets.splice(start, 1));
                    page.markModified('widgets');
                    page.save(function (err, page) {
                        if (err){
                            deferred.abort(err);
                        } else {
                            deferred.resolve(page);
                        }
                    });
                }
            });
        return deferred.promise;
    }
    
    function addWidgetToPage(pageId, widgetId) {
        var deferred = q.defer();
        pageModel
            .update(
                {_id: pageId},
                {$push: {widgets: widgetId}},
                function (err, page) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(page);
                    }
                });
        return deferred.promise;
    }
    
    function deleteWidgetFromPage(pageId, widgetId) {
        var deferred = q.defer();
        pageModel
            .update(
                {_id: pageId},
                {$pull: {widgets: widgetId}},
                function (err, page) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(page);
                    }
                });
        return deferred.promise;
    }
    
    function createPage(websiteId, newPage) {
        newPage._website = websiteId;

        var deferred = q.defer();
        pageModel.create(newPage, function (err, status) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllPagesForWebsite(websiteId) {
        var deferred = q.defer();
        //console.log("in model find all websites for user: " + userId);
        pageModel
            .find({_website: websiteId}, function (err, pages) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    deferred.resolve(pages);
                }
            });
        return deferred.promise;
    }
    
    function findPageById(pageId) {
        var deferred = q.defer();
        pageModel.findById(pageId, function (err, page) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    //deferred.resolve(user[0]);
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }
    
    function updatePage(pageId, newPage) {
        newPage._id = pageId;
        var deferred = q.defer();
        pageModel
            .update(
                {_id: pageId},
                {$set: {name: newPage.name, description: newPage.description}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }
    
    function deletePage(pageId) {
        var deferred = q.defer();
        pageModel
            .remove({_id: pageId}, function (err, status) {
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