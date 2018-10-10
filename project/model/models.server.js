module.exports = function () {
    var connectionString = 'mongodb://127.0.0.1:27017/wjl';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;

    }

    var mongoose = require("mongoose");
    var options = { promiseLibrary: require('bluebird') };
    mongoose.createConnection(connectionString, options);
    mongoose.connect(connectionString);

    var userInfoModel = require('./user/userInfo.model.server')();
    var bookModel = require('./book/book.model.server')();
    var requestModel = require('./request/request.model.server')();

    var model = {
        UserInfoModel: userInfoModel,
        BookModel: bookModel,
        RequestModel: requestModel
    };
    return model;
};