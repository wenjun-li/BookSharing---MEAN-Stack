(function () {
    angular
        .module("WjlProject")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./home/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/home", {
                templateUrl: "./home/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "./user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "./user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/:tab", {
                templateUrl: "./user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/admin/:tab", {
                templateUrl: "./user/templates/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model"
            })
            .when("/book-list", {
                templateUrl: "./book/templates/book-list.view.client.html",
                controller: "BookListController",
                controllerAs: "model"
            })
            .when("/user/:tab/:bookId/book-edit", {
                templateUrl: "./book/templates/book-edit.view.client.html",
                controller: "BookEditController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            //For view-profile routes
            .when("/user/:tab/view-profile/:viewedUserId", {
                templateUrl: "./user/templates/view-profile.view.client.html",
                controller: "ViewProfileController",
                controllerAs: "model"
            })
            .when("/book-list/book-details/:bookId/view-profile/:viewedUserId", {
                templateUrl: "./user/templates/view-profile.view.client.html",
                controller: "ViewProfileController",
                controllerAs: "model"
            })

            // For book-details routes
            .when("/book-list/book-details/:bookId", {
                templateUrl: "./book/templates/book-details.view.client.html",
                controller: "BookDetailsController",
                controllerAs: "model"
            })
            .when("/book-list/book-details/:bookId/view-profile/:viewedUserId/book-details/:viewedBookId", {
                templateUrl: "./book/templates/book-details.view.client.html",
                controller: "BookDetailsController",
                controllerAs: "model"
            })
            .when("/user/:tab/view-profile/:viewedUserId/book-details/:viewedBookId", {
                templateUrl: "./book/templates/book-details.view.client.html",
                controller: "BookDetailsController",
                controllerAs: "model"
            });
    }

    function checkAdmin($q, UserInfoService, $location) {
        var deferred = $q.defer();
        UserInfoService
            .isAdmin()
            .then(function (user) {
                if(user != '0' && user.type === "admin") {
                    deferred.resolve(user);
                    $location.url('/admin/' + user._id + "/user");
                } else if (user != '0'){
                    $location.url('/user/' + user._id + "/profile");
                    //deferred.reject();
                } else {
                    $location.url("/login");
                }
            });
        return deferred.promise;
    }

    function checkLogin($q, UserInfoService, $location, $rootScope) {
        var deferred = $q.defer();
        UserInfoService
            .loggedIn()
            .then(function (user) {
                if(user != '0') {
                    $rootScope.currentUser = user;
                    deferred.resolve(user);
                } else {
                    $location.url('/login');
                    deferred.reject();
                }
            });
        return deferred.promise;
    }

})();
