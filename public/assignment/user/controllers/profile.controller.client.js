(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController);

    function profileController($routeParams, $location, UserService) {

        var userId = $routeParams['uid'];

        var vm = this; // vm stands for ViewModel
        // event handlers
        vm.updateUser = updateUser;
        vm.unregisterUser = unregisterUser;
        vm.userId = userId;

        function init() {
/*            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    vm.user = user;
                 })
                .error(function () {
                   console.log("cannot get user by id");
                });

            return promise;*/
            UserService
                .findUserById(userId)
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        vm.user = user;
                    }
                });
        }
        init();

        function unregisterUser(user) {
            var answer = confirm("Are you sure to unregister?");
            if (answer){
                UserService
                    .deleteUser(user._id)
                    .then(function (status, err) {
                        if (err) {
                            vm.error = "Unable to unregister!";
                        } else {
                            $location.url('/login');
                        }
                    });
                    /*.success(function () {
                        $location.url('/login');
                    })
                    .error(function () {
                       vm.error = "Unable to unregister!";
                    });*/
            }
        }
        
        function updateUser(newUser) {
/*            if(!validateEmail(newUser.email)){
                vm.message = "";
                vm.error = "Invalid email!";
            }else{
                var user = UserService
                    .updateUser(userId, newUser)
                    .success(function (user){

                    });
                if(user != null){
                    vm.error = "";
                    vm.message = "User Successfully Updated!";
                } else{
                    vm.message = "";
                    vm.error = "Unable to Update User!";
                }
            }*/

            UserService
                .updateUser(userId, newUser)
                .then(function (status, err) {
                    if (err) {
                        vm.error = "Unable to Update User!";
                    } else {
                        vm.message = "User Successfully Updated!";
                    }
                });
        }

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
})();