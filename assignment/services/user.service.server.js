module.exports = function(app, model){
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user", createUser);

    var UserModel = model.UserModel;

    function deleteUser(req, res) {
        var userId = req.params.userId;
        UserModel
            .deleteUser(userId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;

        UserModel
            .createUser(newUser)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if(username && password){
            findUserByCredentials(req, res);
        }else if(username){
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        UserModel
            .findUserByUsername(username)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        UserModel
            .updateUser(userId, newUser)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserById(req, res) {

        var userId = req.params.userId;
        UserModel
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

        UserModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                //console.log(user);
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