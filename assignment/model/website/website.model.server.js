module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var WebsiteSchema = require('./website.schema.server.js')();

    var websiteModel = mongoose.model('WebsiteModel', WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        addPageToWebsite: addPageToWebsite,
        deletePageFromWebsite: deletePageFromWebsite
    };
    return api;

    function addPageToWebsite(websiteId, pageId) {
        var deferred = q.defer();
        websiteModel
            .update(
                {_id: websiteId},
                {$push: {pages: pageId}},
                function (err, website) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(website);
                    }
                });
        return deferred.promise;
    }

    function deletePageFromWebsite(websiteId, pageId) {
        var deferred = q.defer();
        websiteModel
            .update(
                {_id: websiteId},
                {$pull: {pages: pageId}},
                function (err, website) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(website);
                    }
                });
        return deferred.promise;
    }

    function createWebsiteForUser(userId, newWebsite) {
        newWebsite._user = userId;

        var deferred = q.defer();
        websiteModel.create(newWebsite, function (err, website) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(website);
            }
        });
        return deferred.promise;
    }

    function findAllWebsitesForUser(userId) {
        var deferred = q.defer();
        //console.log("in model find all websites for user: " + userId);
        websiteModel
            .find({_user: userId}, function (err, websites) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    deferred.resolve(websites);
                }
            });
        return deferred.promise;
    }

    function findWebsiteById(websiteId) {
        var deferred = q.defer();
        websiteModel.findById(websiteId, function (err, website) {
                if (err){
                    console.log(err);
                    deferred.abort(err);
                } else {
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function updateWebsite(websiteId, newWebsite) {
        newWebsite._id = websiteId;
        var deferred = q.defer();
        websiteModel
            .update(
                {_id: websiteId},
                {$set: {name: newWebsite.name, description: newWebsite.description}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function deleteWebsite(websiteId) {
        var deferred = q.defer();
        websiteModel
            .remove({_id: websiteId}, function (err, status) {
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