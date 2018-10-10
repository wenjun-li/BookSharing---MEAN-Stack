(function(){
    angular
        .module("WjlProject")
        .controller("ProfileController", profileController);

    function profileController($routeParams, $location, UserInfoService, BookService, RequestService, $rootScope) {
        //var userId = $routeParams['uid'];
        var tabName = $routeParams['tab'];

        var vm = this;
        //vm.userId = userId;
        vm.updateUser = updateUser;
        vm.changeTab = changeTab;
        vm.addBook = addBook;
        vm.unFollow = unFollow;
        vm.logout = logout;
        vm.cancelBorrow = cancelBorrow;
        vm.finishBorrow = finishBorrow;
        vm.acceptToLend = acceptToLend;
        vm.declineToLend = declineToLend;
        
        function init() {
            vm.tabName = tabName;

            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user == "0"){
                            console.log("user not defined!");
                        } else {
                            UserInfoService
                                .isAdmin()
                                .then(function (response, err) {
                                    if (err) {
                                        console.log("cannot get request by id");
                                    } else {
                                        if (response){
                                            vm.isAdmin = true;
                                        } else {
                                            vm.isAdmin = false;
                                        }
                                    }
                                });

                            vm.user = user;

                            if(user.type == "borrower"){
                                // get all my follows and borrows
                                findMyFollows(user);
                                findMyBorrows(user);
                            } else if(user.type == "librarian"){
                                // get all my books and lends
                                findMyBooks(user);
                                findMyLends(user);
                            } else if (user.type == "admin"){
                                findMyFollows(user);
                                findMyBorrows(user);
                                findMyBooks(user);
                                findMyLends(user);
                            }
                        }

                    }
                });
        }
        init();

        function acceptToLend(requestId) {
            var newRequest = {state: "BORROWED"};
            RequestService
                .updateRequest(requestId, newRequest)
                .then(function (status, err) {
                    if (err) {
                        console.log("cannot get request by id");
                    } else {
                        findMyLends(vm.user);
                    }
                });
        }
        
        function declineToLend(requestId) {
            var newRequest = {state: "REJECTED"};
            RequestService
                .updateRequest(requestId, newRequest)
                .then(function (status, err) {
                    if (err) {
                        console.log("cannot get request by id");
                    } else {
                        findMyLends(vm.user);
                    }
                });
        }
        
        function cancelBorrow(requestId) {
            RequestService
                .deleteRequestById(requestId)
                .then(function (status, err) {
                    if (err) {
                        console.log("cannot get request by id");
                    } else {
                        findMyBorrows(vm.user);
                    }
                });
        }
        
        function finishBorrow(requestId) {
            var newRequest = {state: "RETURNED"};
            RequestService
                .updateRequest(requestId, newRequest)
                .then(function (status, err) {
                    if (err) {
                        console.log("cannot get request by id");
                    } else {
                        findMyBorrows(vm.user);
                    }
                });
        }

        function logout() {
            UserInfoService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }

        function findMyBorrows(user) {
            RequestService
                .findRequestByBorrower(user._id)
                .then(function (requests, err) {
                    if (err) {
                        console.log("cannot get book by owner id");
                    } else {
                        return requests;
                    }
                })
                .then(function (requests) {
                    if (requests.length == 0){
                        vm.myBorrows = [];
                    } else {
                        var bookIds = [];
                        for (var r in requests){
                            bookIds.push(requests[r].bookId);
                        }

                        var borrowsInfo = requests;

                        BookService
                            .findBooksByIds(bookIds)
                            .then(function (books, err) {
                                if (err) {
                                    console.log("cannot get book by owner id");
                                } else {
                                    return books;
                                }
                            })
                            .then(function (books) {
                                var lenderIds = [];
                                for (var b in books){
                                    for (var i in borrowsInfo){
                                        if (borrowsInfo[i].bookId == books[b]._id){
                                            borrowsInfo[i].bookName = books[b].name;
                                            borrowsInfo[i].bookPhoto = books[b].photo;
                                            borrowsInfo[i].lenderId = books[b].owner;
                                            lenderIds.push(books[b].owner);
                                        }
                                    }
                                }

                                UserInfoService
                                    .findUsersByIds(lenderIds)
                                    .then(function (users, err) {
                                        if (err) {
                                            console.log("cannot get book by owner id");
                                        } else {
                                            for (var u in users){
                                                for (var i in borrowsInfo){
                                                    if (borrowsInfo[i].lenderId == users[u]._id) {
                                                        borrowsInfo[i].lenderName = users[u].username;
                                                        borrowsInfo[i].lenderPortrait = users[u].portrait;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                vm.myBorrows = borrowsInfo;
                            });
                    }
                });
        }

        function findMyFollows(user) {
            UserInfoService
                .findAllFollows(user._id)
                .then(function (users, err) {
                    if (err) {
                        console.log("can not get followees");
                    } else {
                        vm.myFollows = users;
                    }
                });
        }

        function findMyBooks(user) {
            BookService
                .findBookByOwnerId(user._id)
                .then(function (books, err) {
                    if (err) {
                        console.log("cannot get book by owner id");
                    } else {
                        vm.myBooks = books;
                    }
                });
        }

        function findMyLends(user) {
            BookService
                .findBookByOwnerId(user._id)
                .then(function (books, err) {
                    if (err) {
                        console.log("cannot get book by owner id");
                    } else {
                        var bookIds = [];
                        for (var b in books){
                            bookIds.push(books[b]._id);
                        }
                        return bookIds;
                    }
                })
                .then(function (bookIds) {
                    if (bookIds.length == 0){
                        vm.myLends = [];
                    } else {
                        RequestService
                            .findRequestsByBookIds(bookIds)
                            .then(function (requests, err) {
                                if (err) {
                                    console.log("cannot get book by owner id");
                                } else {
                                    return requests;
                                }
                            })
                            .then(function (requests) {
                                if (requests.length == 0){
                                    vm.myLends = [];
                                } else {
                                    var lendsInfo = requests;

                                    var bookIds = [];
                                    var borrowerIds = [];

                                    for (var r in requests){
                                        bookIds.push(requests[r].bookId);
                                        borrowerIds.push(requests[r].borrower);
                                    }

                                    BookService
                                        .findBooksByIds(bookIds)
                                        .then(function (books, err) {
                                            if (err) {
                                                console.log("cannot get book by owner id");
                                            } else {
                                                return books;
                                            }
                                        })
                                        .then(function (requestedBooks) {
                                            for (var b in requestedBooks){
                                                lendBooks = requestedBooks[b];

                                                for (var i in lendsInfo){
                                                    if (requestedBooks[b]._id == lendsInfo[i].bookId){
                                                        lendsInfo[i].bookName = requestedBooks[b].name;
                                                        lendsInfo[i].bookPhoto = requestedBooks[b].photo;
                                                    }
                                                }
                                            }
                                        });

                                    UserInfoService
                                        .findUsersByIds(borrowerIds)
                                        .then(function (users, err) {
                                            if (err) {
                                                console.log("cannot get book by owner id");
                                            } else {
                                                return users;
                                            }
                                        })
                                        .then(function (users) {
                                            for (var u in users){
                                                for (var i in lendsInfo){
                                                    if (users[u]._id == lendsInfo[i].borrower){
                                                        lendsInfo[i].borrowerName = users[u].username;
                                                        lendsInfo[i].borrowerPortrait = users[u].portrait;
                                                        lendsInfo[i].borrowerEmail = users[u].email;
                                                    }
                                                }
                                            }
                                        });
                                    vm.myLends = lendsInfo;

                                }
                            });
                    }


                });
        }

        function unFollow(unFollowedUserId) {
            UserInfoService
                .deleteFollowFromUser(vm.user._id, unFollowedUserId)
                .then(function (status, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        UserInfoService
                            .findAllFollows(vm.user._id)
                            .then(function (users, err) {
                                if (err) {
                                    console.log("can not get followees");
                                } else {
                                    vm.myFollows = users;
                                }
                            });
                    }
                });
        }

        function addBook() {
            var newBook = {owner: vm.user._id, ISBN: "none", availability: true};
            BookService
                .addBook(newBook)
                .then(function (book, err) {
                    if (err) {
                        vm.myBooksError = "Unable to add book!";
                    } else {
                        $location.url("/user/" + tabName + "/" + book._id + "/book-edit");
                    }
                });
        }

        function updateUser(newUser) {
            if(newUser.email != "" && !validateEmail(newUser.email)){
                vm.profileError = "Wrong email format! [*@*.*]";
            } else {
                vm.profileError = "";
                UserInfoService
                    .updateUser(vm.user._id, newUser)
                    .then(function (status, err) {
                        if (err) {
                            vm.error = "Unable to Update User!";
                        } else {
                            vm.message = "User Successfully Updated!";
                        }
                    });
            }
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function changeTab(tabName) {
            vm.tabName = tabName;
            $location.url("/user/" + tabName);
        }

    }
})();