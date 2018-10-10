(function () {
    angular
        .module("WjlProject")
        .factory("UserInfoService", UserInfoService);

    function UserInfoService($http) {
        var api = {
            register: register,
            "adminCreateUser": adminCreateUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "findAllFollows": findAllFollows,
            "addFollowToUser": addFollowToUser,
            "deleteFollowFromUser": deleteFollowFromUser,
            "findUsersByIds": findUsersByIds,
            "findAllUsers": findAllUsers,
            login: login,
            logout: logout,
            isAdmin: isAdmin,
            loggedIn: loggedIn,
            adminUpdateUser: adminUpdateUser
        };
        return api;
        
        function isAdmin() {
            return $http.get('/api/project/isAdmin')
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            return $http.post('/api/project/logout')
                .then(function (response) {
                    return response.data;
                });
        }

        function login(user) {
            return $http.post('/api/project/login', user)
                .then(function (response) {
                    return response.data;
                });
        }

        function loggedIn() {
            return $http.get('/api/project/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }
        
        function findAllUsers() {
            return $http.get("/api/userInfo/")
                .then(function (response) {
                    return response.data;
                })
        }

        function findUsersByIds(userIds) {
            return $http.get("/api/users?userIds=" + userIds)
                .then(function (response) {
                    return response.data;
                })
        }

        function addFollowToUser(userId, followedUserId) {
            return $http.put("/api/user/" + userId + "/addFollow/" + followedUserId)
                .then(function (response) {
                    return response.data;
                });
        }
        
        function deleteFollowFromUser(userId, followedUserId) {
            return $http.put("/api/user/" + userId + "/unFollow/" + followedUserId)
                .then(function (response) {
                    return response.data;
                });
        }
        
        function findAllFollows(userId) {
            return $http.get("/api/userInfo/" + userId + "/follows")
                .then(function (response) {
                    return response.data;
                });
        }

        function register(user) {
            return $http.post("/api/userInfo/", user)
                .then(function (response) {
                    return response.data;
                });
        }

        function adminCreateUser(user) {
            return $http.post("/api/admin/createUser", user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserById(userId) {
            return $http.get("/api/userInfo/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            return $http.get("/api/userInfo?username=" + username)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/userInfo?username=" + username + "&password=" + password)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/userInfo/" + userId, newUser)
                .then(function (response) {
                    return response.data;
                });
        }

        function adminUpdateUser(userId, newUser) {
            return $http.put("/api/admin/userUpdate/" + userId, newUser)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete('/api/userInfo/' + userId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();