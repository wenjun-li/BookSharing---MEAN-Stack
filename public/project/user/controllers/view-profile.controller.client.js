(function(){
    angular
        .module("WjlProject")
        .controller("ViewProfileController", viewProfileController);

    function viewProfileController($routeParams, $location, UserInfoService, BookService) {

        //"/user/:tab/view-profile/:viewedUserId"
        //"/book-list/book-details/:bookId/view-profile/:viewedUserId"
        var tabName = $routeParams['tab'];
        var thisBookId = $routeParams['bookId'];
        var viewedUserId = $routeParams['viewedUserId'];


        var vm = this;
        vm.back = back;
        vm.viewBookDetails = viewBookDetails;
        vm.follow = follow;

        function init() {
            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user == '0'){
                            vm.viewee = null;
                        } else {
                            vm.viewee = user;
                        }
                    }
                });

            UserInfoService
                .findUserById(viewedUserId)
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        vm.user = user;
                    }
                });

            BookService
                .findBookByOwnerId(viewedUserId)
                .then(function (books, err) {
                    if (err) {
                        console.log("cannot get book by owner id");
                    } else {
                        vm.books = books;
                    }
                });


        }
        init();

        function follow() {
            if(vm.viewee){
                UserInfoService
                    .addFollowToUser(vm.viewee._id, vm.user._id)
                    .then(function (user) {
                        vm.message = "Successfully Followed!";
                    }, function (err) {
                        console.log(err);
                    });
            } else {
                vm.error = "Please log in first!"
            }
        }
        
        function viewBookDetails(bookId) {
            //"/user/:tab/view-profile/:viewedUserId"
            //"/book-list/book-details/:bookId/view-profile/:viewedUserId"
            if (tabName) {
                $location.url("/user/" + tabName + "/view-profile/" + viewedUserId + "/book-details/" + bookId);
            } else {
                $location.url("/book-list/book-details/" +  thisBookId + "/view-profile/" + viewedUserId + "/book-details/" + bookId);
            }
        }

        function back() {
            //"/user/:tab/view-profile/:viewedUserId"
            //"/book-list/book-details/:bookId/view-profile/:viewedUserId"
            if (tabName) {
                $location.url("/user/" + tabName );
            } else {
                $location.url("/book-list/book-details/" +  thisBookId);
            }
        }
        
    }
})();