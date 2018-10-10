module.exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js')();

    var userModel = mongoose.model('UserModel', UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        addWebsiteToUser: addWebsiteToUser,
        deleteWebsiteFromUser: deleteWebsiteFromUser
    };
    return api;

    function addWebsiteToUser(userId, websiteId) {
        var deferred = q.defer();
        userModel
            .update(
                {_id: userId},
                {$push: {websites: websiteId}},
                function (err, user) {
                    if (err) {
                        deferred.abort(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }

    function deleteWebsiteFromUser(userId, websiteId) {
        var deferred = q.defer();
        userModel
            .update(
                {_id: userId},
                {$pull: {websites: websiteId}},
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
        //console.log(newUser);
        newUser.password = newUser.pwd;
        var deferred = q.defer();
        userModel.create(newUser, function (err, status) {
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
        userModel.findById(userId, function (err, user) {
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
        userModel
            .find({username: username}, function (err, user) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(user[0]);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        userModel
            .find({username: username, password: password}, function (err, user) {
                if (err) {
                    deferred.abort(err);
                } else {
                    deferred.resolve(user[0]);
                }
            });
        return deferred.promise;
    }

    function updateUser(userId, newUser) {
        newUser._id = userId;
        var deferred = q.defer();
        userModel
            .update(
                {_id: userId},
                {$set: {firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email}},
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
        userModel.remove({_id: userId}, function (err, status) {
            if (err) {
                deferred.abort(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

};