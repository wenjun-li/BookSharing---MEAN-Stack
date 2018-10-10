(function(){
    angular
        .module("WjlProject")
        .controller("AdminController", adminController);

    function adminController($location, $routeParams, $rootScope, UserInfoService, RequestService, BookService) {
        //var userId = $routeParams['uid'];
        var tabName = $routeParams['tab'];

        var vm = this;
        vm.changeTab = changeTab;
        vm.logout = logout;

        // book handlers
        vm.searchBook = searchBook;
        vm.editBook = editBook;
        vm.updateBook = updateBook;
        vm.deleteBook = deleteBook;
        vm.showAddBookComponents = showAddBookComponents;
        vm.addBook = addBook;
        vm.cancelAddBook = cancelAddBook;

        //user handlers
        vm.showAddUserComponents = showAddUserComponents;
        vm.addUser = addUser;
        vm.cancelAddUser = cancelAddUser;
        vm.editUser = editUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.searchUser = searchUser;

        //request handlers
        vm.searchRequest = searchRequest;
        vm.showAddRequestComponents = showAddRequestComponents;
        vm.addRequest = addRequest;
        vm.cancelAddRequest = cancelAddRequest;
        vm.editRequest = editRequest;
        vm.updateRequest = updateRequest;
        vm.deleteRequest = deleteRequest;

        function  init() {
            vm.tabName = tabName;
            vm.showAddBookContainer = false;

            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user == '0'){
                            vm.admin = null;
                            $location.url("/login");
                        } else {
                            UserInfoService
                                .isAdmin()
                                .then(function (response, err) {
                                    if (err) {
                                        console.log("cannot get user by id");
                                    } else {
                                        if (response){
                                            vm.admin = user;
                                            $rootScope.currentUser = vm.admin;
                                        } else {
                                            console.log(user);
                                            console.log("user is not an admin user");
                                            $location.url("/user/profile");
                                        }
                                    }
                                });
                        }
                    }
                });


            findAllUsers();
            findAllBooks();
            findAllRequests();

            findAllLenders();
            findAllBorrowers();
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

        function changeTab(tabName) {
            vm.tabName = tabName;

            findAllUsers();
            findAllBooks();
            findAllRequests();

            findAllLenders();
            findAllBorrowers();

            $location.url("/admin/" + vm.tabName);
        }


        function findAllUsers() {
            UserInfoService
                .findAllUsers()
                .then(function (users) {
                    return users;
                }, function (err) {
                    console.log(err);
                })
                .then(function (users) {
                    for(var u in users){
                        users[u].disabled = true;
                        users[u].newUsername = users[u].username;
                    }
                    vm.users = users;
                });
        }

        function findAllBorrowers() {
            UserInfoService
                .findAllUsers()
                .then(function (users) {
                    return users;
                }, function (err) {
                    console.log(err);
                })
                .then(function (users) {
                    var borrowers = [];
                    for (var u in users){
                        if (users[u].type == 'admin' || users[u].type == "borrower"){
                            borrowers.push(users[u]);
                        }
                    }
                    vm.borrowers = borrowers;
                });
        }

        function findAllLenders() {
            UserInfoService
                .findAllUsers()
                .then(function (users) {
                    return users;
                }, function (err) {
                    console.log(err);
                })
                .then(function (users) {
                    var lenders = [];
                    for (var u in users){
                        if (users[u].type == 'admin' || users[u].type == "librarian"){
                            lenders.push(users[u]);
                        }
                    }
                    vm.lenders = lenders;
                });
        }

        function findAllRequests() {
            RequestService
                .findAllRequests()
                .then(function (requests) {
                    return requests;
                }, function (err) {
                    console.log(err);
                })
                .then(function (requests) {
                    if (requests.length == 0){
                        vm.requests = [];
                    } else {
                        var lenderIds = [];
                        var borrowerIds = [];
                        for (var r in requests){
                            requests[r].disabled = true;
                            lenderIds.push(requests[r].lender);
                            borrowerIds.push(requests[r].borrower);
                        }

                        UserInfoService
                            .findUsersByIds(borrowerIds)
                            .then(function (users) {
                                return users;
                            }, function (err) {
                                console.log(err);
                            })
                            .then(function (users) {
                                for (var u in users){
                                    for (var r in requests){
                                        if (requests[r].borrower == users[u]._id) {
                                            requests[r].borrowerName = users[u].username;
                                        }
                                    }
                                }
                            });

                        vm.requests = requests;
                    }
                });
        }

        function findAllBooks() {
            BookService
                .findAllBooks()
                .then(function (books) {
                    vm.allBooks = books;
                    findOwnerNames(books);
                }, function (err) {
                    console.log(err);
                });
        }

        function showAddRequestComponents() {
            vm.newRequest = {};
            vm.showAddRequestContainer = true;
            vm.error = "";
        }

        function showAddUserComponents() {
            vm.newUser = {};
            vm.showAddUserContainer = true;
            vm.error = "";
        }

        function showAddBookComponents() {
            vm.newBook = {};
            vm.showAddBookContainer = true;
            vm.error = "";
            vm.lenders = findAllLenders();
        }

        function cancelAddRequest() {
            vm.newRequest = {};
            vm.error = "";
            vm.showAddRequestContainer = false;
        }

        function cancelAddUser() {
            vm.newUser = {};
            vm.error = "";
            vm.showAddUserContainer = false;
        }

        function cancelAddBook() {
            vm.newBook = {};
            vm.error = "";
            vm.showAddBookContainer = false;
        }

        function addUser(user) {
            user.type = user.type.replace(/(^\s*)|(\s*$)/g,"");
            if (!user.username){
                vm.error = "Please enter username!";
            } else {
                UserInfoService
                    .findUserByUsername(user.username)
                    .then(function (foundUser) {
                        var username = foundUser.username;
                        if (username != undefined){
                            vm.error = "Username already exist!";
                        } else {
                            var newUser = {
                                username: user.username,
                                email: user.email,
                                type: user.type,
                                pwd: user.username
                            };

                            UserInfoService
                                .adminCreateUser(newUser)
                                .then(function (user) {
                                    user.disabled = true;
                                    user.newUsername = user.username;
                                    console.log(user);
                                    vm.users.unshift(user);
                                }, function (err) {
                                    console.log(err);
                                });
                        }
                    }, function (err) {
                        console.log(err);
                    });

                vm.newUser = {};
                vm.showAddUserContainer = false;
            }
        }

        function addRequest(request) {
            vm.error = "";
            if (request.borrowerName == undefined || request.bookId  == undefined || request.state == undefined ) {
                vm.error = "please select all the fileds!";
            } else {
                request.borrowerName = request.borrowerName.replace(/(^\s*)|(\s*$)/g,"");
                request.bookId = request.bookId.replace(/(^\s*)|(\s*$)/g,"");
                request.state = request.state.replace(/(^\s*)|(\s*$)/g,"");

                UserInfoService
                    .findUserByUsername(request.borrowerName)
                    .then(function (user) {
                        request.borrower = user._id;
                        var newRequest = {
                            state: request.state,
                            borrower: request.borrower,
                            bookId: request.bookId
                        };
                        RequestService
                            .createRequest(newRequest)
                            .then(function (newRequest) {
                                newRequest.disabled = true;
                                newRequest.borrowerName = request.borrowerName;
                                vm.requests.unshift(newRequest);
                            }, function (err) {
                                console.log(err);
                            });
                    }, function (err) {
                        console.log(err);
                    });

                vm.showAddRequestContainer = false;
            }
        }


        function addBook(book) {
            vm.error = "";
            if (!book.selectedUserName && !book.ISBN){
                vm.error = "Please enter ISBN and select an user!";
            } else if (book.selectedUserName && !book.ISBN){
                vm.error = "Please enter ISBN!";
            } else if (!book.selectedUserName && book.ISBN){
                vm.error = "Please select an user!";
            }else if (book.selectedUserName && book.ISBN) {
                book.selectedUserName = book.selectedUserName.replace(/(^\s*)|(\s*$)/g,"");
                UserInfoService
                    .findUserByUsername(book.selectedUserName)
                    .then(function (user) {
                        var newBook = {owner: user._id, ISBN: book.ISBN, name: book.name, author: book.author};
                        BookService
                            .addBook(newBook)
                            .then(function (book) {
                                book.disabled = true;
                                book.ownerName = user.username;
                                vm.books.unshift(book);
                            }, function (err) {
                                console.log(err);
                            });
                        vm.showAddBookContainer = false;
                    }, function (err) {
                        console.log(err);
                    });
            }
        }

        function deleteRequest(request) {
            RequestService
                .deleteRequestById(request._id)
                .then(function (status) {
                    var newRequests = vm.requests;
                    for (var r in newRequests){
                        if (newRequests[r]._id === request._id){
                            newRequests.splice(r, 1);
                            break;
                        }
                    }

                    vm.requests = newRequests;

                }, function (err) {
                    console.log(err);
                });
        }

        function deleteUser(user) {
            UserInfoService
                .deleteUser(user._id)
                .then(function (status) {
                    var newUsers = vm.users;
                    for (var u in newUsers){
                        if (newUsers[u]._id === user._id){
                            newUsers.splice(u, 1);
                            break;
                        }
                    }
                    vm.users = newUsers;

                }, function (err) {
                    console.log(err);
                });
        }
        
        function deleteBook(book) {
            BookService
                .deleteBookById(book._id)
                .then(function (status) {
                    var newBooks = vm.books;
                    for (var b in newBooks){
                        if (newBooks[b]._id === book._id){
                            newBooks.splice(b, 1);
                            break;
                        }
                    }

                    vm.books = newBooks;

                }, function (err) {
                    console.log(err);
                });
        }

        function updateRequest(request) {
            request.disabled = true;
            request.state = request.state.replace(/(^\s*)|(\s*$)/g,"");

            var newRequest = {
                state: request.state
            };

            RequestService
                .updateRequest(request._id, newRequest)
                .then(function (status) {
                }, function (err) {
                    console.log(err);
                });
        }

        function updateUser(user) {
            vm.error = "";
            user.disabled = true;
            var username = '';

            UserInfoService
                .findUserByUsername(user.newUsername)
                .then(function (foundUser) {
                    username = foundUser.username;
                    if (foundUser && foundUser._id !=user._id){
                        vm.error = "Username already exist!";
                        user.disabled = false;
                    } else {
                        var newUser;
                        if (user.username != user.newUsername){
                            newUser = {
                                username: user.newUsername,
                                email: user.email,
                                type: user.type
                            };
                        } else {
                            newUser = {
                                email: user.email,
                                type: user.type
                            };
                        }

                        UserInfoService
                            .adminUpdateUser(user._id, newUser)
                            .then(function (status) {
                                user.username = user.newUsername;
                            }, function (err) {
                                console.log(err);
                            });
                    }
                });
        }
        
        function updateBook(book) {
            book.disabled = true;
            book.ownerName = book.ownerName.replace(/(^\s*)|(\s*$)/g,"");

            UserInfoService
                .findUserByUsername(book.ownerName)
                .then(function (foundUser) {
                    book.owner = foundUser._id;
                    var newBook =
                        {owner: book.owner,
                            name: book.name,
                            author: book.author,
                            ISBN: book.ISBN
                        };

                    BookService
                        .adminUpdateBook(book._id, newBook)
                        .then(function (status) {
                            //console.log("Successfully updated");
                        }, function (err) {
                            console.log(err);
                        });
                }, function (err) {
                    console.log(err);
                });
        }

        function editRequest(request) {
            request.disabled = false;
            vm.error = "";
        }

        function editBook(book) {
            book.disabled = false;
            vm.error = "";
        }

        function editUser(user) {
            user.disabled = false;
            vm.error = "";
        }
        
        function findOwnerNames(books) {
            if (books.length == 0){
                vm.books = [];
                return;
            }

            var userIds = [];
            for (var b in books){
                userIds.push(books[b].owner);
            }

            if (userIds.length == 0){
                vm.books = [];
                return;
            }

            UserInfoService
                .findUsersByIds(userIds)
                .then(function (users) {
                    vm.books = books;
                    for (var b in books){
                        vm.books[b].disabled = true;
                        for (var u in users){
                            if (books[b].owner == users[u]._id) {
                                vm.books[b].ownerName = users[u].username;
                            }
                        }
                    }
                }, function (err) {
                    console.log(err);
                });

        }

        function searchRequest(type, searchText) {
            vm.error = "";
            vm.users = [];

            if (searchText == ""){
                RequestService
                    .findAllRequests()
                    .then(function (requests) {
                        vm.requests = requests;
                    }, function (err) {
                        console.log(err);
                    });
            }

            switch (type){
                case "Borrower":
                    UserInfoService
                        .findUserByUsername(searchText)
                        .then(function (user) {
                            if (user) {
                                RequestService
                                    .findRequestByBorrower(user._id)
                                    .then(function (requests) {
                                        return requests;
                                    }, function (err) {
                                        console.log(err);
                                    })
                                    .then(function (requests) {
                                        if(requests.length == 0){
                                            vm.requests = [];
                                        } else {
                                            var borrowerIds = [];
                                            for (var r in requests){
                                                borrowerIds.push(requests[r].borrower);
                                            }
                                            UserInfoService
                                                .findUsersByIds(borrowerIds)
                                                .then(function (users) {
                                                    var requestList = [];
                                                    for (var r in requests){
                                                        for (var u in users){
                                                            if (users[u]._id === requests[r].borrower){
                                                                requests[r].disabled = true;
                                                                requests[r].borrowerName = users[u].username;
                                                                requestList.push(requests[r]);
                                                            }
                                                        }
                                                    }
                                                    vm.requests = requestList;
                                                }, function (err) {
                                                    console.log(err);
                                                });
                                        }
                                    });
                            } else {
                                vm.requests = [];
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                case "BookId":
                    BookService
                        .findAllBooks()
                        .then(function (books) {
                            var foundBook = false;
                            for (var b in books){
                                if (books[b]._id == searchText){
                                    foundBook = true;
                                    break;
                                }
                            }

                            if (!foundBook){
                                vm.error = "Searched book id does not exist!";
                            } else {
                                RequestService
                                    .findRequestByBookId(searchText)
                                    .then(function (requests) {
                                        if(requests.length == 0){
                                            vm.requests = [];
                                        } else {
                                            var borrowerIds = [];
                                            for (var r in requests){
                                                borrowerIds.push(requests[r].borrower);
                                            }
                                            UserInfoService
                                                .findUsersByIds(borrowerIds)
                                                .then(function (users) {
                                                    var requestList = [];
                                                    for (var r in requests){
                                                        for (var u in users){
                                                            if (users[u]._id === requests[r].borrower){
                                                                requests[r].disabled = true;
                                                                requests[r].borrowerName = users[u].username;
                                                                requestList.push(requests[r]);
                                                            }
                                                        }
                                                    }
                                                    vm.requests = requestList;
                                                }, function (err) {
                                                    console.log(err);
                                                });
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                default:
                    break;
            }
        }

        function searchUser(type, searchText) {
            vm.error = "";
            vm.users = [];

            if (searchText == ""){
                UserInfoService
                    .findAllUsers()
                    .then(function (users) {
                        vm.users = users;
                    }, function (err) {
                        console.log(err);
                    });
            }

            switch (type){
                case "Username":
                    UserInfoService
                        .findUserByUsername(searchText)
                        .then(function (user) {
                            if (user) {
                                user.disabled = true;
                                vm.user = user;
                                vm.user.newUsername = user.username;
                                vm.users = [user];
                            } else {
                                vm.users = [];
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    break;
                case "UserId":
                    UserInfoService
                        .findAllUsers()
                        .then(function (users) {
                            for (var b in users) {
                                if (searchText === users[b]._id) {
                                    return searchText;
                                }
                            }
                            vm.error = "Searched user id does not exist!";
                        })
                        .then(function (searchText) {
                            if(searchText != undefined) {
                                UserInfoService
                                    .findUserById(searchText)
                                    .then(function (user) {
                                        if(user != undefined){
                                            user.disabled = true;
                                            vm.user.newUsername = user.username;
                                            vm.users = [user];
                                        } else {
                                            vm.users = [];
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        });
                    break;
                default:
                    break;
            }
        }

        function searchBook(type, searchText) {
            vm.books = [];
            vm.error = "";
            searchText = searchText.replace(/(^\s*)|(\s*$)/g,"");
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
                            return books;
                        }, function (err) {
                            console.log(err);
                        })
                        .then(function (books) {
                            if(books.length == 0){
                                vm.books = [];
                            } else {
                                var bookOweners = [];
                                for(var b in books){
                                    books[b].disabled = true;
                                    bookOweners.push(books[b].owner);
                                }

                                UserInfoService
                                    .findUsersByIds(bookOweners)
                                    .then(function (users) {
                                        for (var u in users){
                                            for(var b in books){
                                                if(users[u]._id === books[b].owner){
                                                    books[b].ownerName = users[u].username;
                                                }
                                            }
                                        }

                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    })
                            }
                        });
                    break;
                case "OwnerName":
                    UserInfoService
                        .findUserByUsername(searchText)
                        .then(function (user) {
                            return user;
                        }, function (err) {
                            console.log(err);
                        })
                        .then(function (user) {
                            if(user == undefined){
                                vm.books = [];
                            } else {
                                BookService
                                    .findAllBooks()
                                    .then(function (books) {
                                       var bookList = [];
                                       for (b in books){
                                           if(user._id === books[b].owner){
                                               books[b].disabled = true;
                                               books[b].ownerName = user.username;
                                               bookList.push(books[b]);
                                           }
                                       }
                                       vm.books = bookList;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        });
                    break;
                case "Name":
                    BookService
                        .findBookByName(searchText)
                        .then(function (books) {
                            return books;
                        }, function (err) {
                            console.log(err);
                        })
                        .then(function (books) {
                            if(books.length == 0){
                                vm.books = [];
                            } else {
                                var bookOweners = [];
                                for(var b in books){
                                    books[b].disabled = true;
                                    bookOweners.push(books[b].owner);
                                }

                                UserInfoService
                                    .findUsersByIds(bookOweners)
                                    .then(function (users) {
                                        for (var u in users){
                                            for(var b in books){
                                                if(users[u]._id === books[b].owner){
                                                    books[b].ownerName = users[u].username;
                                                }
                                            }
                                        }

                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    })
                            }
                        });
                    break;
                case "Author":
                    BookService
                        .findBookByAuthor(searchText)
                        .then(function (books) {
                            return books;
                        }, function (err) {
                            console.log(err);
                        })
                        .then(function (books) {
                            if(books.length == 0){
                                vm.books = [];
                            } else {
                                var bookOweners = [];
                                for(var b in books){
                                    books[b].disabled = true;
                                    bookOweners.push(books[b].owner);
                                }

                                UserInfoService
                                    .findUsersByIds(bookOweners)
                                    .then(function (users) {
                                        for (var u in users){
                                            for(var b in books){
                                                if(users[u]._id === books[b].owner){
                                                    books[b].ownerName = users[u].username;
                                                }
                                            }
                                        }

                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    })
                            }
                        });
                    break;
                case "ISBN":
                    BookService
                        .findBookByISBN(searchText)
                        .then(function (books) {
                            return books;
                        }, function (err) {
                            console.log(err);
                        })
                        .then(function (books) {
                            if(books.length == 0){
                                vm.books = [];
                            } else {
                                var bookOweners = [];
                                for(var b in books){
                                    books[b].disabled = true;
                                    bookOweners.push(books[b].owner);
                                }

                                UserInfoService
                                    .findUsersByIds(bookOweners)
                                    .then(function (users) {
                                        for (var u in users){
                                            for(var b in books){
                                                if(users[u]._id === books[b].owner){
                                                    books[b].ownerName = users[u].username;
                                                }
                                            }
                                        }

                                        vm.books = books;
                                    }, function (err) {
                                        console.log(err);
                                    })
                            }
                        });
                    break;
                case "BookId":
                    BookService
                        .findAllBooks()
                        .then(function (books) {
                            var foundBook = false;
                            for (var b in books) {
                                if (searchText === books[b]._id) {
                                    return searchText;
                                }
                            }
                            vm.error = "Searched book id does not exist!";
                        })
                        .then(function (searchText) {
                            if(searchText != undefined){
                                BookService
                                    .findBookById(searchText)
                                    .then(function (book) {
                                        if(book){
                                            book.disabled = true;
                                            UserInfoService
                                                .findUserById(book.owner)
                                                .then(function (user) {
                                                    book.ownerName = user.username;
                                                    vm.books = [book];
                                                }, function (err) {
                                                    console.log(err);
                                                });
                                        } else {
                                            vm.books = [];
                                        }

                                    }, function (err) {
                                        console.log(err);
                                    });
                            } else {
                                vm.books = [];
                            }

                        });
                    break;
                default:
                    break;
            }
        }
    }
})();