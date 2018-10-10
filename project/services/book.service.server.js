module.exports = function(app, model){
    var multer = require('multer'); // npm install multer --save
    var uploadBookPic = multer({ dest: __dirname+'/../../public/uploadBookPhotos' });

    app.post("/api/book/", addBook);
    app.get("/api/book/:bookId", findBookById);
    app.get("/api/books", findBooksByIds);
    app.get("/api/book/", findBook);
    app.put("/api/book/:bookId", updateBook);
    app.put   ('/api/admin/bookUpdate/:bookId', adminUpdateBook);
    app.delete('/api/book/:bookId', deleteBookById);
    app.delete('/api/book/owner/:ownerId', deleteBookByOwnerId);
    app.get("/api/book/owner/:ownerId", findBookByOwnerId);
    app.get("/api/book/withoutOwner/:ownerId", findBookWithoutCurUserId);
    app.post ("/api/uploadBookPhoto", uploadBookPic.single('myFile'), uploadBookPicture);

    var BookModel = model.BookModel;
    var RequestModel = model.RequestModel;

    function adminUpdateBook(req, res) {
        var bookId = req.params.bookId;
        var newBook = req.body;

        BookModel
            .adminUpdateBook(bookId, newBook)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBooksByIds(req, res) {
        var bookIdsStr = req.query.bookIds;

        var bookIds = bookIdsStr.split(",");
        BookModel
            .findBooksByIds(bookIds)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function findBookWithoutCurUserId(req, res) {
        var ownerId = req.params.ownerId;
        BookModel
            .findBookWithoutCurUserId(ownerId)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllBooksByIds() {
        var booksJson = req.body;
        var books = booksJson.books;
        BookModel
            .findAllBooksByIds(book)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function findBookByOwnerId(req, res) {
        var ownerId = req.params.ownerId;
        BookModel
            .findBookByOwnerId(ownerId)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteBookByOwnerId(req, res) {
        var ownerId = req.params.ownerId;

        BookModel
            .then(function (books) {
                var bookImgs = [];
                for(var b in books){
                    bookImgs.push(books[b].photo);
                }
                console.log("the book images: ");
                console.log(bookImgs);
                return bookImgs;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (photos) {
                console.log("book photos");
                console.log(photos);

                for(var p in photos){
                    if (photos[p] != "/uploadBookPhotos/book-default.png"){
                        var fs = require('fs');
                        var filePath = __dirname+ '/../../public' + photos[p];
                        fs.unlink(filePath);
                    }
                }
            });


        BookModel
            .findBookByOwnerId(ownerId)
            .then(function (books) {
                return books;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (books) {
                if (books.length ==0){
                    res.send("this user does not have any book!");
                } else {
                    var bookIds = [];
                    for(var b in books){
                        bookIds.push(books[b]._id);
                    }
                    RequestModel
                        .deleteRequestsByBookIds(bookIds)
                        .then(function (status) {
                            return status;
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                        .then(function (status) {
                            BookModel
                                .deleteBookByOwnerId(ownerId)
                                .then(function (status) {
                                    res.send(status);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        });
                }
            });
    }

    function deleteBookById(req, res) {
        var bookId = req.params.bookId;

        BookModel
            .findBookById(bookId)
            .then(function (book) {
                return book.photo;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (photo) {
                if (photo != "/uploadBookPhotos/book-default.png"){
                    var fs = require('fs');
                    var filePath = __dirname+ '/../../public' + photo;
                    fs.unlink(filePath);
                }
            });

        BookModel
            .deleteBookById(bookId)
            .then(function (status) {
                return status;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (status) {
                RequestModel
                    .deleteRequestByBookId(bookId)
                    .then(function (status) {
                        res.send(status);
                    }, function (err) {
                        res.sendStatus(500).send(err);
                    })
            });
    }

    function updateBook(req, res) {
        var bookId = req.params.bookId;
        var newBook = req.body;

        BookModel
            .updateBook(bookId, newBook)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addBook(req, res) {
        var newBook = req.body;
        BookModel
            .addBook(newBook)
            .then(function (book) {
                res.send(book);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBookById(req, res) {
         var bookId = req.params.bookId;
        BookModel
            .findBookById(bookId)
            .then(function (book) {
                res.send(book);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBook(req, res) {
        var isbn = req.query.isbn;
        var author = req.query.author;
        var bookName = req.query.bookName;
        var searchText = req.query.searchText;

        if (isbn){
            findBookByISBN(req, res);
        } else if (author) {
            findBookByAuthor(req, res);
        } else if (bookName) {
            findBookByName(req, res);
        } else if (searchText) {
            findAllBookWithKeyword(req, res);
        } else {
            findAllBooks(req, res);
        }
    }

    function findAllBookWithKeyword(req, res) {
        var searchText = req.query.searchText;
        BookModel
            .findAllBookWithKeyword(searchText)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllBooks(req, res) {
        BookModel
            .findAllBooks()
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBookByISBN(req, res) {
        var isbn = req.query.isbn;

        BookModel
            .findBookByISBN(isbn)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBookByAuthor(req, res) {
        var author = req.query.author;

        BookModel
            .findBookByAuthor(author)
            .then(function (books) {
                res.send(books);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findBookByName(req, res) {
        var bookName = req.query.bookName;

        BookModel
            .findBookByName(bookName)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function uploadBookPicture(req, res) {
        var bookId        = req.body.bookId;
        var userId        = req.body.userId;
        var tabName        = req.body.tabName;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = /uploadBookPhotos/ + filename;
        var oldPortrait;

        BookModel
            .findBookById(bookId)
            .then(function (book) {
                oldPhoto = book.photo;
                book.photo = url;
                return book;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (book) {
                return BookModel.updateBook(bookId, book);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (book) {
                if (oldPhoto != "/uploadBookPhotos/book-default.png"){
                    var fs = require('fs');
                    var filePath = __dirname+ '/../../public' + oldPhoto;
                    fs.unlink(filePath);
                }
                res.redirect(301, "/project/#/user/" + tabName + "/" +  bookId +"/book-edit");
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
};