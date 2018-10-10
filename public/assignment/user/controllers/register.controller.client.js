(function(){
    angular
        .module("WebAppMaker")
        .controller("RegisterController", registerController);

    function  registerController($location, UserService) {
        var vm = this;

        // event handlers
        vm.register = register;

        function  init() {
        }
        init();

        function register(user) {
            if(user.pwd != user.verifyPwd){
                vm.error = "Password not matched!";
            }else {
                UserService
                    .findUserByUsername(user.username)
                    .then(function (err, status) {
                        if (status){
                            vm.error = "Username already taken!";
                        } else {
                            UserService
                                .createUser(user)
                                .then(function (newUser, err) {
                                    if (err){
                                        vm.error = "Unable to register.";
                                    } else {
                                        $location.url("/user/" + newUser._id);
                                    }
                                });
                        }
                    });
                    // .success(function (user) {
                    //     vm.error = "Username already taken!"
                    // })
                    // .error(function () {
                    //     UserService
                    //         .createUser(user)
                    //         .success(function (user) {
                    //             $location.url("/user/" + user._id);
                    //         })
                    //         .error(function () {
                    //             vm.error = "Unable to register";
                    //         });
                    // });
            }
        }
    }
})();