(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController);

    function  loginController($location, UserService) {
        var vm = this;
        // event handlers
        vm.login = login;

        function  init() {
        }
        init();

        function login(user) {
            UserService
                .findUserByCredentials(user.username, user.password)
                .then (function (loginUser) {
                    if (loginUser != null){
                        console.log(loginUser);
                        $location.url("/user/" + loginUser._id);
                    } else {
                        vm.error = "User not found";
                    }
                }, function (err) {
                    vm.error = "User not found.";
                });

            // var promise = UserService.findUserByCredentials(user.username, user.password);
            // promise
            //     .success(function(user){
            //         var loginUser = user;
            //         if(loginUser != null){
            //             //console.log(user);
            //             $location.url("/user/" + loginUser._id);
            //         }else{
            //             vm.error = "User not found";
            //         }
            //     })
            //     .error(function () {
            //         vm.error = "User not found";
            //     });
            //
            // return promise;

        }
    }
})();