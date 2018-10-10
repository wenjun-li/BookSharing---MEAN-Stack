(function(){
    angular
        .module("WjlProject")
        .controller("LoginController", loginController);

    function loginController($location, UserInfoService, $rootScope) {
        var vm = this;
        // event handlers
        vm.login = login;
        vm.logout = logout;

        function  init() {
        }
        init();

        function login(user) {
            UserInfoService
                .login(user)
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user === '0'){
                            vm.error = "Cannot find user by credentials!";
                        } else {
                            $rootScope.currentUser = user;
                            UserInfoService
                                .isAdmin(user)
                                .then(function (response, err) {
                                    if (err) {
                                        console.log("cannot get user by id");
                                    } else {
                                        if (response) {
                                            $location.url("/admin/user");
                                        } else {
                                            $location.url("/user/profile");
                                        }
                                    }
                                });
                        }
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


        // function login(user) {
        //     UserInfoService
        //         .findUserByCredentials(user.username, user.password)
        //         .then(function (loginUser) {
        //             if (loginUser != null) {
        //                 if (loginUser.type == "admin"){
        //                     $location.url("/admin/" + loginUser._id + "/user");
        //                 } else {
        //                     $location.url("/user/" + loginUser._id + "/profile");
        //                 }
        //             } else {
        //                 vm.error = "User not found";
        //             }
        //         }, function (err) {
        //             vm.error = "User not found.";
        //         });
        // }
    }
})();