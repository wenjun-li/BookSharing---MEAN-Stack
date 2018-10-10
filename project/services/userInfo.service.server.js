module.exports = function(app, model){
    var multer = require('multer'); // npm install multer --save
    var uploadPortrait = multer({ dest: __dirname+'/../../public/uploadUserPortraits' });

    var passport = require('passport');
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

    var bcrypt = require("bcrypt-nodejs");

    var auth = authorized;
    app.post("/api/userInfo", register);
    app.post  ('/api/project/login', passport.authenticate('local'), login);
    app.get   ('/api/project/loggedin',       loggedin);
    app.get   ('/api/project/isAdmin',        isAdmin);
    app.post  ('/api/project/logout',         logout);
    app.get("/api/userInfo/", findUser);
    app.get("/api/userInfo/:userId", findUserById);
    app.get("/api/userInfo/:userId/follows", findAllFollows);
    app.get("/api/users", findUsersByIds);
    app.put("/api/userInfo/:userId", updateUser);
    app.put("/api/user/:userId/addFollow/:followedUserId", addFollowToUser);
    app.put("/api/user/:userId/unFollow/:followedUserId", deleteFollowFromUser);
    app.delete("/api/userInfo/:userId", deleteUser);
    app.post ("/api/uploadPortrait", uploadPortrait.single('myFile'), uploadUserPortrait);
    app.post  ('/api/admin/createUser', auth, adminCreateUser);
    app.put   ('/api/admin/userUpdate/:userId', auth, adminUpdateUser);

    app.delete('/api/project/admin/user/:userId', auth, deleteUser);
    app.get   ('/api/project/admin/user', findAllUsers);

    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID_WJL,  //"611979832337834",
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET_WJL, //"c6762ed0f7494e4315202c5269029612",
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL_WJL, //"http://localhost:3000/auth/facebook/callback",
        profileFields: [ 'photos', 'emails']
    };
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/user/profile',
            failureRedirect: '/#/login'
        }));

    app.get   ('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get   ('/google/oauth/callback',
        passport.authenticate('google', {
            successRedirect: '/project/#/user/profile',
            failureRedirect: '/#/login'
        }));
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var googleConfig = {
        clientID     :  process.env.GOOGLE_CLIENT_ID_WJL, //"524366783277-rbhe5c2b63ktmkn80tf1ej47aqgaus6j.apps.googleusercontent.com",
        clientSecret :  process.env.GOOGLE_CLIENT_SECRET_WJL, //"XY6M2F4exbDkbwGqJiXdtaTg",
        callbackURL  :  process.env.GOOGLE_CALLBACK_URL_WJL//"http://localhost:3000/google/oauth/callback"
    };
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));


    var UserInfoModel = model.UserInfoModel;
    var BookModel = model.BookModel;
    var RequestModel = model.RequestModel;


    function googleStrategy(token, refreshToken, profile, done) {
        UserInfoModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                if (user){
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username:  emailParts[0],
                        email:     email,
                        type: "borrower",
                        google: {
                            id:    profile.id,
                            token: token
                        }
                    };

                    UserInfoModel
                        .createUser(newGoogleUser)
                        .then(function (user) {
                            return user;
                        }, function (err) {
                            return done(err);
                        })
                        .then(function (user) {
                            done(null, user);
                        }, function (err) {
                            return done(err);
                        });
                }
            }, function (err) {
                return done(err);
            });
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        UserInfoModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                if (user){
                    return done(null, user);
                } else {
                    var portrait = profile.photos[0].value;
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newFacebookUser = {
                        username:  emailParts[0],
                        email:     email,
                        type: "borrower",
                        facebook: {
                            id:    profile.id,
                            token: token
                        }
                    };

                    UserInfoModel
                        .createUser(newFacebookUser)
                        .then(function (user) {
                            return user;
                        }, function (err) {
                            return done(err);
                        })
                        .then(function (user) {
                            done(null, user);
                        }, function (err) {
                            return done(err);
                        });
                }
            }, function (err) {
                return done(err);
            });
    }


    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function isAdmin(req, res) {
        res.send(req.isAuthenticated() && req.user.type && req.user.type == "admin");
    }

    function adminCreateUser(req, res) {
        var newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.pwd);
        newUser.portrait = "/uploadUserPortraits/user-default.png";

        UserInfoModel
            .createUser(newUser)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }


    function register(req, res) {
        var newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.pwd);

        UserInfoModel
            .createUser(newUser)
            .then(function (user) {
                return user;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(500).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(500).send(err);
                }
            );
    }

    function localStrategy(username, password, done) {
        UserInfoModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (!user) {
                        return done(null, "0");
                    } else {
                        if(user && bcrypt.compareSync(password, user.password)) {
                            return done(null, user);
                        } else {
                            return done(null, "0");
                        }
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        UserInfoModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function findUsersByIds(req, res) {
        var userIdsStr = req.query.userIds;
        var userIds = userIdsStr.split(',');
        UserInfoModel
            .findUsersByIds(userIds)
            .then(function (users) {
                res.send(users);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function addFollowToUser(req, res) {
        var userId = req.params.userId;
        var followedUserId = req.params.followedUserId;
        UserInfoModel
            .addFollowToUser(userId, followedUserId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function deleteFollowFromUser(req, res) {
        var userId = req.params.userId;
        var followedUserId = req.params.followedUserId;
        UserInfoModel
            .deleteFollowFromUser(userId, followedUserId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
    
    function findAllFollows(req, res) {
        var userId = req.params.userId;
        UserInfoModel
            .findUserById(userId)
            .then(function (user) {
                return user.follows;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (follows) {
               UserInfoModel
                   .findUsersByIds(follows)
                   .then(function (follows) {
                       res.send(follows);
                   }, function (err) {
                       res.sendStatus(500).send(err);
                   });
            });
    }

    function uploadUserPortrait(req, res) {
        var userId        = req.body.userId;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = /uploadUserPortraits/ + filename;
        var oldPortrait;

        UserInfoModel
            .findUserById(userId)
            .then(function (user) {
                oldPortrait = user.portrait;
                user.portrait = url;
                return user;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (user) {
                return UserInfoModel.updateUser(userId, user);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (user) {
                if (oldPortrait != "/uploadUserPortraits/user-default.png") {
                    var fs = require('fs');
                    var filePath = __dirname + "/../../public" + oldPortrait;
                    fs.unlink(filePath);
                }
                res.redirect(301, "/project/#/user/profile");
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }


    function deleteUser(req, res) {
        var userId = req.params.userId;

        UserInfoModel
            .findUserById(userId)
            .then(function (user) {
                return user.portrait;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (portrait) {
                if (portrait != "/uploadUserPortraits/user-default.png") {
                    var fs = require('fs');
                    var filePath = __dirname + "/../../public" + portrait;
                    fs.unlink(filePath);
                }
            });

        BookModel
            .findBookByOwnerId(userId)
            .then(function (books) {
                return books;
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (books) {
                if (books.length == 0) {
                    RequestModel
                        .deleteRequestByBorrower(userId)
                        .then(function (status) {
                            return status;
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                        .then(function (status) {
                            UserInfoModel
                                .deleteUser(userId)
                                .then(function (status) {
                                    res.send(status);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        });

                } else {
                    var bookIds = [];
                    var bookImgs = [];

                    for (var b in books) {
                        bookIds.push(books[b]._id);
                        bookImgs.push(books[b].photo);
                    }

                    for(var p in bookImgs){
                        if (bookImgs[p] != "/uploadBookPhotos/book-default.png"){
                            var fs = require('fs');
                            var filePath = __dirname+ '/../../public' + bookImgs[p];
                            fs.unlink(filePath);
                        }
                    }

                    RequestModel
                        .deleteRequestsByBookIds(bookIds)
                        .then(function (status) {
                            return status;
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                        .then(function (status) {
                            BookModel
                                .deleteBookByOwnerId(userId)
                                .then(function (status) {
                                    return status;
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        })
                        .then(function (status) {
                            RequestModel
                                .deleteRequestByBorrower(userId)
                                .then(function (status) {
                                    return status;
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        })
                        .then(function () {
                            UserInfoModel
                                .deleteUser(userId)
                                .then(function (status) {
                                    res.send(status);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                        });
                }
            });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if(username && password){
            findUserByCredentials(req, res);
        }else if(username){
            findUserByUsername(req, res);
        } else {
            findAllUsers(req, res);
        }
    }

    function findAllUsers(req, res) {
        UserInfoModel
            .findAllUsers()
            .then(function (users) {
                res.send(users);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        UserInfoModel
            .findUserByUsername(username)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function adminUpdateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;

        if (newUser.username){
            newUser.password = bcrypt.hashSync(newUser.username);

            UserInfoModel
                .adminUpdateUser(userId, newUser)
                .then(function (status) {
                    return status;
                }, function (err) {
                    res.sendStatus(500).send(err);
                })
                .then(function (status) {
                    UserInfoModel
                        .adminResetUserCredential(userId, newUser)
                        .then(function (status) {
                            res.send(status);
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                });
        } else {
            UserInfoModel
                .adminUpdateUser(userId, newUser)
                .then(function (status) {
                    res.send(status);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        }
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        UserInfoModel
            .updateUser(userId, newUser)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        UserInfoModel
            .findUserById(userId)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        UserInfoModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                if (user == null){
                    res.sendStatus(500);
                } else {
                    res.send(user);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
};