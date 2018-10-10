(function(){
    angular
        .module("WjlProject")
        .controller("BookEditController", bookEditController);

    function bookEditController($routeParams, $location, BookService, UserInfoService) {
        var tabName = $routeParams['tab'];
        var bookId = $routeParams['bookId'];

        var vm = this;
        vm.updateBook = updateBook;
        vm.deleteBook = deleteBook;
        vm.back = back;

        function init() {
            vm.tabName = tabName;
            vm.bookId = bookId;

            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        vm.user = user;

                        BookService
                            .findBookById(bookId)
                            .then(function (book, err) {
                                if (err) {
                                    console.log("cannot get book by id");
                                } else {
                                    vm.book = book;
                                }
                            });
                    }
                });



        }
        init();

        function back() {
            $location.url("/user/myBooks");
        }

        function deleteBook() {
            vm.myBooksError = "";
            BookService
                .deleteBookById(bookId)
                .then(function (status) {
                    $location.url("/user/" + tabName);
                }, function (err) {
                    vm.myBooksError = "Unable to delete book";
                    console.log(err);
                });
        }
        
        function updateBook(newBook) {
            vm.myBooksError = "";
            BookService
                .updateBook(vm.bookId, newBook)
                .then(function (status, err) {
                    if (err) {
                        vm.myBooksError = "Unable to update book!";
                    } else {
                        $location.url("/user/" + tabName);
                    }
                });
        }
    }
})();