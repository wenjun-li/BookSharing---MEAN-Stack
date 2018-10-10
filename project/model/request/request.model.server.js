module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var RequestSchema = require('./request.schema.server')();

    var requestModel = mongoose.model('RequestModel', RequestSchema);

    var api = {
        findAllRequests: findAllRequests,
        createRequest: createRequest,
        findRequestById: findRequestById,
        findRequestsByBookIds: findRequestsByBookIds,
        findRequestByBorrower: findRequestByBorrower,
        updateRequest: updateRequest,
        deleteRequestById: deleteRequestById,
        deleteRequestByBookId: deleteRequestByBookId,
        deleteRequestsByBookIds: deleteRequestsByBookIds,
        deleteRequestByBorrower: deleteRequestByBorrower,
        findRequestByBookId: findRequestByBookId
    };
    return api;

    function deleteRequestsByBookIds(bookIds) {
        var deferred = q.defer();
        requestModel
            .remove({bookId: {$in: bookIds}},
                function (err, requests) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
                });
        return deferred.promise;
    }

    function deleteRequestByBookId(bookId) {
        var deferred = q.defer();
        requestModel
            .remove({bookId: bookId},
                function (err, requests) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
                });
        return deferred.promise;
    }

    function deleteRequestByBorrower(borrowerId) {
        var deferred = q.defer();
        requestModel
            .remove({borrower: borrowerId},
                function (err, requests) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
                });
        return deferred.promise;
    }

    function findRequestByBookId(bookId) {
        var deferred = q.defer();
        requestModel
            .find({bookId: bookId},
                function (err, requests) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
                })
            .sort({borrower: -1});
        return deferred.promise;
    }

    function findAllRequests() {
        var deferred = q.defer();
        requestModel
            .find(
                function (err, requests) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
                })
            .sort({borrower: -1});
        return deferred.promise;
    }

    function findRequestsByBookIds(bookIds) {
        var deferred = q.defer();
        requestModel
            .find({bookId: {$in: bookIds}},
                function (err, requests) {
                    if (err){
                        console.log(err);
                        deferred.abort(err);
                    } else {
                        deferred.resolve(requests);
                    }
            });
        return deferred.promise;
    }
    
    function createRequest(newRequest) {
        var deferred = q.defer();
        requestModel.create(newRequest, function (err, status) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findRequestById(requestId) {
        var deferred = q.defer();
        requestModel.findById(requestId, function (err, request) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(request);
            }
        });
        return deferred.promise;
    }

    function findRequestByBorrower(borrowerId) {
        var deferred = q.defer();
        requestModel
            .find({borrower: borrowerId}, function (err, requests) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(requests);
                }
            });
        return deferred.promise;
    }

    function updateRequest(requestId, newRequest) {
        newRequest._id = requestId;
        var deferred = q.defer();
        requestModel
            .update(
                {_id: requestId},
                {$set: {state: newRequest.state}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function deleteRequestById(requestId) {
        var deferred = q.defer();
        requestModel.remove({_id: requestId}, function (err, status) {
            if (err) {
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }
};