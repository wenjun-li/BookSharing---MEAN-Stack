module.exports = function(app, model){
    //app.get("/api/request/borrower/:borrowerId", findRequestedBooksByBorrower);
    //app.get("/api/request/lender/:lenderId", findRequestedBooksByLender);

    app.put("/api/request/:requestId", updateRequest);
    app.delete("/api/request/:requestId", deleteRequestById);
    app.get("/api/request/borrower/:borrowerId", findRequestByBorrower);
    app.get("/api/request/lender/:lenderId", findRequestByLender);
    app.get("/api/requests", findRequestsByBookIds);
    app.get("/api/request/book/:bookId", findRequestByBookId);
    app.post("/api/request/", createRequest);
    app.get("/api/request/:requestId", findRequestById);
    app.get("/api/request/", findRequest);

    var RequestModel = model.RequestModel;
    var BookModel = model.BookModel;

    function findRequestByBookId(req, res) {
        var bookId = req.params.bookId;
        RequestModel
            .findRequestByBookId(bookId)
            .then(function (requests) {
                res.send(requests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function findRequest(req, res) {
        RequestModel
            .findAllRequests()
            .then(function (requests) {
                res.send(requests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findRequestsByBookIds(req, res) {
        var bookIdsStr = req.query.bookIds;
        var bookIds = bookIdsStr.split(",");
        RequestModel
            .findRequestsByBookIds(bookIds)
            .then(function (requests) {
                res.send(requests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function findRequestByBorrower(req, res) {
        var borrowerId = req.params.borrowerId;
        RequestModel
            .findRequestByBorrower(borrowerId)
            .then(function (requests) {
                res.send(requests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findRequestByLender(req, res) {
        var lenderId = req.params.lenderId;
        RequestModel
            .findRequestByLender(lenderId)
            .then(function (requests) {
                res.send(requests);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findRequestById(req, res) {
        var requestId = req.params.requestId;
        RequestModel
            .findRequestById(requestId)
            .then(function (request) {
                res.send(request);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateRequest(req, res) {
        var requestId = req.params.requestId;
        var newRequest = req.body;

        if (newRequest.state == "BORROWED"){
            RequestModel
                .findRequestById(requestId)
                .then(function (request) {
                    return request;
                }, function (err) {
                    res.sendStatus(500).send(err);
                })
                .then(function (request) {
                    BookModel
                        .updateBookAvailability(request.bookId, false)
                        .then(function (status) {
                            return status;
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                        .then(function (status) {
                            RequestModel
                                .updateRequest(requestId, newRequest)
                                .then(function (status) {
                                    res.send(status);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        });
                });
        } else if (newRequest.state == "RETURNED"){
            RequestModel
                .findRequestById(requestId)
                .then(function (request) {
                    return request;
                }, function (err) {
                    res.sendStatus(500).send(err);
                })
                .then(function (request) {
                    BookModel
                        .updateBookAvailability(request.bookId, true)
                        .then(function (status) {
                            return status;
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                        .then(function (status) {
                            RequestModel
                                .updateRequest(requestId, newRequest)
                                .then(function (status) {
                                    res.send(status);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        });
                });
        }else {
            RequestModel
                .updateRequest(requestId, newRequest)
                .then(function (status) {
                    res.send(status);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        }
    }

    function deleteRequestById(req, res) {
        var requestId = req.params.requestId;
        RequestModel
            .deleteRequestById(requestId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createRequest(req, res) {
        var newRequest = req.body;

        if (newRequest.state == "BORROWED"){
            BookModel
                .updateBookAvailability(newRequest.bookId, false)
                .then(function (status) {
                    return status;
                }, function (err) {
                    res.sendStatus(500).send(err);
                })
                .then(function (status) {
                    RequestModel
                        .createRequest(newRequest)
                        .then(function (status) {
                            res.send(status);
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        });
                });
        } else {
            RequestModel
                .createRequest(newRequest)
                .then(function (status) {
                    res.send(status);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        }
    }
};