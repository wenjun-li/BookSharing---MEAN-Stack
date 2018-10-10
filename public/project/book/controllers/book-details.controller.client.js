(function(){
    angular
        .module("WjlProject")
        .controller("BookDetailsController", bookDetailsController);

    function bookDetailsController($routeParams, $location, RequestService, BookService, UserInfoService) {

        //"/book-list/book-details/:bookId"
        //"/book-list/book-details/:bookId/view-profile/:viewedUserId/book-details/:viewedBookId"
        //"/user/:tab/view-profile/:viewedUserId/book-details/:viewedBookId"
        var tab = $routeParams['tab'];
        var bookId = $routeParams['bookId'];
        var viewedUserId = $routeParams['viewedUserId'];
        var viewedBookId = $routeParams['viewedBookId'];

        var vm = this;
        vm.back = back;
        vm.sendRequest = sendRequest;
        vm.viewUserDetails = viewUserDetails;

        function init() {
            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (user) {
                        if (user == "0") {
                            vm.viewee = null;
                        } else {
                            vm.viewee = user;
                        }

                        if (viewedBookId) {
                            getBookDetails(viewedBookId);
                        } else {
                            getBookDetails(bookId);
                        }
                    } else {
                        console.log("can not get loggedin user");
                    }
                });
        }
        init();

        function getGoogleBookDetails(ISBN) {
            BookService
                .findBookDetailsFromGoogle(ISBN)
                .then(function (info) {
                    if (info.totalItems === 0){
                        vm.showGoogleResult = false;
                    } else  {
                        vm.showGoogleResult = true;
                        var volumeInfo = info.items[0].volumeInfo;
                        var authors = volumeInfo.authors;
                        var autorsStr = "";
                        for (var a in authors){
                            autorsStr = autorsStr + authors[a] + ", ";
                        }
                        autorsStr = autorsStr.substring(0, autorsStr.length - 2);

                        var googleBookDetails = {
                            photo: volumeInfo.imageLinks.thumbnail,
                            title: volumeInfo.title,
                            authors: autorsStr,
                            description: volumeInfo.description,
                            infoLink: volumeInfo.infoLink
                        };

                        vm.googleBookDetails = googleBookDetails;
                    }


                }, function (err) {
                    console.log(err);
                })
        }
        
        function getBookDetails(bookId) {
            BookService
                .findBookById(bookId)
                .then(function (book) {
                    vm.book = book;
                    getGoogleBookDetails(book.ISBN);
                    return book.owner;
                }, function (err) {
                    console.log(err);
                })
                .then(function (userId) {
                    UserInfoService
                        .findUserById(userId)
                        .then(function (user) {
                            vm.book.ownerName = user.username;
                            vm.book.ownerPortrait = user.portrait;
                        }, function (err) {
                            console.log(err);
                        })
                });
        }

        function back() {
            //"/book-list/book-details/:bookId"
            //"/book-list/book-details/:bookId/view-profile/:viewedUserId/book-details/:viewedBookId"
            //"/user/:tab/view-profile/:viewedUserId/book-details/:viewedBookId"
            if (tab && viewedUserId) {
                $location.url("/user/" + tab + "/view-profile/" + viewedUserId);
            } else if(viewedUserId) {
                $location.url("/book-list/book-details/" + bookId + "/view-profile/" + viewedUserId );
            } else {
                $location.url("/book-list/");
            }
        }

        function viewUserDetails(ownerId) {
            if (tab && viewedUserId) {
                $location.url("/user/" + tab + "/view-profile/" + viewedUserId);
            } else if(viewedUserId) {
                $location.url("/book-list/book-details/" + bookId + "/view-profile/" + viewedUserId );
            } else {
                $location.url("/book-list/book-details/" + bookId + "/view-profile/" + ownerId);
            }
        }

        function sendRequest(requestText) {
            vm.message = "";
            vm.error = "";

            if (!vm.viewee || vm.viewee == "0") {
                vm.error = "Please log in first!";
            } else {
                var newRequest =
                        {lender: vm.book.owner,
                        borrower: vm.viewee._id,
                        bookId: vm.book._id,
                        requestMessage: requestText,
                        state: "PENDING"};

                RequestService
                    .createRequest(newRequest)
                    .then(function (status) {
                        vm.message = "Your request has been sent, please wait for the owner's processing";
                    }, function (err) {
                        vm.error = "Unable to send borrow request!";
                        console.log(err);
                    });
            }
        }
    }
})();