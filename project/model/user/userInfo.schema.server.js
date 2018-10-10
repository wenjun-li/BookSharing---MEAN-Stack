module.exports = function () {
    var mongoose = require('mongoose');

    var UserInfoSchema = mongoose.Schema({
        username: String,
        password: String,
        type: {type: String, enum: ['borrower', 'librarian', 'admin']},
        email: String,
        personalInfo: String,
        portrait: {type: String, default: "/uploadUserPortraits/user-default.png"},
        follows: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserInfoModel'}],
        dateCreated: {type: Date, default: Date.now()},
        facebook: {
            id:    String,
            token: String
        },
        google: {
            id: String,
            token: String
        }
    }, {collection: 'userInfo'});
    return UserInfoSchema;
};
