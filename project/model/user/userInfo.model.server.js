module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var UserInfoSchema = require('./userInfo.schema.server')();

    var userInfoModel = mongoose.model('UserInfoModel', UserInfoSchema);

    var api = {
        findAllUsers: findAllUsers,
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        adminResetUserCredential: adminResetUserCredential,
        adminUpdateUser: adminUpdateUser,
        deleteUser: deleteUser,
        addBookToUser: addBookToUser,
        deleteBookFromUser: deleteBookFromUser,
        addRequestToUser: addRequestToUser,
        deleteRequestFromUser: deleteRequestFromUser,
        findUsersByIds: findUsersByIds,
        addFollowToUser: addFollowToUser,
        findUserByFacebookId: findUserByFacebookId,
        deleteFollowFromUser: deleteFollowFromUser,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function findUserByGoogleId(googleId) {
        var deferred = q.defer();
        userInfoModel
            .findOne({'google.id': googleId},
                function (err, users) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(users);
                    }
                });
        return deferred.promise;
    }

    function findUserByFacebookId(facebookId) {
        var deferred = q.defer();
        userInfoModel
            .findOne({'facebook.id': facebookId},
                function (err, users) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(users);
                    }
                });
        return deferred.promise;
    }

    function findAllUsers() {
        var deferred = q.defer();
        userInfoModel
            .find(
                function (err, users) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(users);
                    }
                })
            .sort({dateCreated: -1});
        return deferred.promise;
    }

    function findUsersByIds(userIds) {
        var deferred = q.defer();
        userInfoModel
            .find(
                {_id: {$in: userIds}},
                function (err, users) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(users);
                    }
                });
        return deferred.promise;
    }

    function addFollowToUser(userId, followedUserId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$addToSet: {follows: followedUserId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function deleteFollowFromUser(userId, followedUserId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$pull: {follows: followedUserId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function addRequestToUser(userId, requestId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$addToSet: {requests: requestId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function deleteRequestFromUser(userId, requestId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$pull: {requests: requestId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function addBookToUser(userId, bookId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$push: {books: bookId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function deleteBookFromUser(userId, bookId) {
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$pull: {books: bookId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function createUser(newUser) {
        var deferred = q.defer();
        userInfoModel.create(newUser, function (err, status) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();
        userInfoModel.findById(userId, function (err, user) {
            if (err){
                console.log(err);
                deferred.abort(err);
            } else {
                //deferred.resolve(user[0]);
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        userInfoModel
            .find({username: username},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user[0]);
                    }
            });
        return deferred.promise;
    }

    function findUserByCredentials(credentials) {
            var deferred = q.defer();

            userInfoModel
                .find({username: credentials.username, password: credentials.password},
                    function (err, user) {
                        if (err) {
                            deferred.abort(err);
                        } else {
                            deferred.resolve(user[0]);
                        }
                });
            return deferred.promise;
    }

    function adminResetUserCredential(userId, newUser) {
        newUser._id = userId;
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$set: {username: newUser.username,
                        password: newUser.password}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function adminUpdateUser(userId, newUser) {
        newUser._id = userId;
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$set: {type: newUser.type,
                        email: newUser.email}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function updateUser(userId, newUser) {
        newUser._id = userId;
        var deferred = q.defer();
        userInfoModel
            .update(
                {_id: userId},
                {$set: {personalInfo: newUser.personalInfo,
                    email: newUser.email,
                    portrait: newUser.portrait}},
                function (err, status) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(status);
                    }
                });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        userInfoModel
            .remove({_id: userId}, function (err, status) {
            if (err) {
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

};