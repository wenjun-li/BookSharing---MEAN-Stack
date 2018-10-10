(function(){
    angular
        .module("WjlProject")
        .controller("RegisterController", registerController);

    function  registerController($location, UserInfoService, $rootScope) {
        var vm = this;

        // event handlers
        vm.register = register;

        function  init() {
        }
        init();

        function register(user) {
            if(user.pwd != user.verifyPwd){
                console.log(user.pwd);
                console.log(user.verifyPwd);
                vm.error = "Password not matched!";
            }else {
                UserInfoService
                    .findUserByUsername(user.username)
                    .then(function (status, err) {
                        if (err){
                            vm.error = "Unable to register";
                        } else {
                            if(status){
                                vm.error = "Username already exist";
                            } else {
                                UserInfoService
                                    .register(user)
                                    .then(function (newUser, err) {
                                        if (err){
                                            vm.error = "Unable to register.";
                                        } else {
                                            $rootScope.currentUser = newUser;
                                            $location.url("/user/profile");
                                        }
                                    });
                            }
                        }
                    });
            }
        }
    }
})();