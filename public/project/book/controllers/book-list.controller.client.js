(function(){
    angular
        .module("WjlProject")
        .controller("BookListController", bookListController);

    function bookListController($routeParams, $location, BookService, UserInfoService, $rootScope) {

        var vm = this;
        vm.getBookDetails = getBookDetails;
        vm.searchBook = searchBook;
        vm.logout = logout;

        function init() {
            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user == '0'){
                            vm.user = null;

                            BookService
                                .findAllBooks()
                                .then(function (books) {
                                    vm.books = books;
                                }, function (err) {
                                    console.log(err);
                                });

                        } else {
                            vm.user = user;

                            UserInfoService
                                .isAdmin()
                                .then(function (response, err) {
                                    if (err) {
                                        console.log("cannot get request by id");
                                    } else {
                                        vm.isAdmin = response;
                                    }
                                });

                            if (user.type == "Lender"){
                                BookService
                                    .findBookWithoutCurUserId(user._id)
                                    .then(function (books) {
                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            } else {
                                BookService
                                    .findAllBooks()
                                    .then(function (books) {
                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        }
                    }
                });

            // if (userId) {
            //     UserInfoService
            //         .findUserById(userId)
            //         .then(function (user) {
            //             return user;
            //         }, function (err) {
            //             console.log(err);
            //         })
            //         .then(function (user) {
            //            if (user.type == "Borrower"){
            //                BookService
            //                    .findBookWithoutCurUserId(userId)
            //                    .then(function (books) {
            //                        vm.books = books;
            //                    }, function (err) {
            //                        console.log(err);
            //                    });
            //            } else {
            //                BookService
            //                    .findAllBooks()
            //                    .then(function (books) {
            //                        vm.books = books;
            //                    }, function (err) {
            //                        console.log(err);
            //                    });
            //            }
            //         });
            // } else {
            //     BookService
            //         .findAllBooks()
            //         .then(function (books) {
            //             vm.books = books;
            //         }, function (err) {
            //             console.log(err);
            //         });
            // }
        }
        init();

        function logout() {
            UserInfoService
                .logout()
                .then(function (response, err) {
                    if (err) {
                        console.log("cannot logout");
                    } else {
                        vm.user = null;
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                });
        }

        function searchBook(type, searchText) {
            vm.books = [];

            if (searchText == ""){
                BookService
                    .findAllBooks()
                    .then(function (books) {
                        vm.books = books;
                    }, function (err) {
                        console.log(err);
                    });
            }

            switch (type){
                case "Search By":
                    BookService
                        .findAllBookWithKeyword(searchText)
                        .then(function (books) {
                            vm.books = books;
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                case "Name":
                    BookService
                        .findBookByName(searchText)
                        .then(function (books) {
                            vm.books = books;
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                case "Author":
                    BookService
                        .findBookByAuthor(searchText)
                        .then(function (books) {
                            vm.books = books;
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                case "ISBN":
                    BookService
                        .findBookByISBN(searchText)
                        .then(function (books) {
                            vm.books = books;
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                default:
                    break;
            }
        }

        function getBookDetails(bookId) {
            $location.url("/book-list/book-details/" + bookId);
        }

    }
})();