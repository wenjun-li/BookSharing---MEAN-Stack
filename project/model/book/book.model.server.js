module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var BookSchema = require('./book.schema.server')();

    var bookModel = mongoose.model('BookModel', BookSchema);

    var api = {
        addBook: addBook,
        findAllBooks: findAllBooks,
        findAllBookWithKeyword: findAllBookWithKeyword,
        findBookById: findBookById,
        findBooksByIds: findBooksByIds,
        findAllBooksByIds: findAllBooksByIds,
        findBookByOwnerId: findBookByOwnerId,
        findBookWithoutCurUserId: findBookWithoutCurUserId,
        findBookByName: findBookByName,
        findBookByAuthor: findBookByAuthor,
        findBookByISBN: findBookByISBN,
        updateBook: updateBook,
        adminUpdateBook: adminUpdateBook,
        updateBookAvailability: updateBookAvailability,
        deleteBookById: deleteBookById,
        deleteBookByOwnerId: deleteBookByOwnerId
    };
    return api;

    function adminUpdateBook(bookId, newBook) {
        var deferred = q.defer();
        bookModel
            .update(
                {_id: bookId},
                {$set:
                       {name: newBook.name,
                        author: newBook.author,
                        ISBN: newBook.ISBN,
                        owner: newBook.owner}
                },
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function findBooksByIds(bookIds) {
        var deferred = q.defer();
        bookModel
            .find({_id: {$in: bookIds}},
                function (err, status) {
                    if (err){
                        console.log(err);
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function findAllBookWithKeyword(keyword) {
        var deferred = q.defer();
        bookModel
            .find({$or: [{ name: { $regex: keyword, $options: "si" }},
                        {author: {$regex: keyword, $options: "si" }},
                        {ISBN: {$regex: keyword, $options: "si" }}]},
                function (err, books) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(books);
                    }
                })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }
    
    function findAllBooks() {
        var deferred = q.defer();
        bookModel
            .find(
                function (err, books) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(books);
                    }
                })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function findBookWithoutCurUserId(userId) {
        var deferred = q.defer();
        bookModel
            .find({owner: {$not: {$eq: userId}}},
                function (err, books) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(books);
                    }
                })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function findAllBooksByIds(bookIds) {
        var deferred = q.defer();
        bookModel
            .find({_id: {$in: bookIds}},
                function (err, books) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(books);
                    }
            })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function findBookByOwnerId(ownerId) {
        var deferred = q.defer();
        bookModel
            .find({owner: ownerId}, function (err, books) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(books);
                }
            })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function addBook(newBook) {
        var deferred = q.defer();
        bookModel.create(newBook, function (err, status) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findBookById(bookId) {
        var deferred = q.defer();
        bookModel.findById(bookId, function (err, book) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(book);
            }
        });
        return deferred.promise;
    }

    function findBookByName(bookName) {
        var deferred = q.defer();
        bookModel
            .find({ name: { $regex: bookName, $options: "si" }}, function (err, books) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(books);
                }
            });
        return deferred.promise;
    }


    function findBookByAuthor(author) {
        var deferred = q.defer();
        bookModel
            .find({ author: { $regex: author, $options: "si" }}, function (err, books) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(books);
                }
            })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }


    function findBookByISBN(isbn) {
        var deferred = q.defer();
        bookModel
            .find({ISBN: isbn}, function (err, books) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(books);
                }
            })
            .sort({availability: -1, dateCreated: -1});
        return deferred.promise;
    }

    function updateBookAvailability(bookId, availability) {
        var deferred = q.defer();
        bookModel
            .update(
                {_id: bookId},
                {$set: {availability: availability}
                },
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }
    
    function updateBook(bookId, newBook) {
        newBook._id = bookId;
        var deferred = q.defer();
        bookModel
            .update(
                {_id: bookId},
                {$set:
                    {name: newBook.name,
                        author: newBook.author,
                        ISBN: newBook.ISBN,
                        photo: newBook.photo,
                        availability: newBook.availability,
                        description: newBook.description,
                        owner: newBook.owner}
                },
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function deleteBookById(bookId) {
        var deferred = q.defer();
        bookModel.remove({_id: bookId}, function (err, status) {
            if (err) {
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function deleteBookByOwnerId(ownerId) {
        var deferred = q.defer();
        bookModel.remove({owner: ownerId}, function (err, status) {
            if (err) {
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

};