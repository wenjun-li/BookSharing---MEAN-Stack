(function(){
    angular
        .module("WjlProject")
        .controller("HomeController", homeController);

    function homeController(UserInfoService, $rootScope, $location) {
        var vm = this;
        vm.logout = logout;


        function init() {
            //vm.user = "usr";
            UserInfoService
                .loggedIn()
                .then(function (user, err) {
                    if (err) {
                        console.log("cannot get user by id");
                    } else {
                        if (user == '0'){
                            vm.user = null;
                        } else {
                            vm.user = user;
                        }
                    }
                });
        }
        init();

        function logout() {
            UserInfoService
                .logout()
                .then(function (response, err) {
                    if (err) {
                        console.log("cannot logout");
                    } else {
                        vm.user = '0';
                        $rootScope.currentUser = '0';
                        $location.url("/");
                    }
                });
        }
    }
})();