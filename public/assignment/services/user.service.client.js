(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return api;

        function createUser(user) {
            return $http.post("/api/user/", user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/" + userId, newUser)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete('/api/user/' + userId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();