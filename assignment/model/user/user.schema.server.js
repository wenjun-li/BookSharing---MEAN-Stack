module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        // username: {type: String, required: true},
        // password: {type: String, required: true},
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: 'users'});
    return UserSchema;
};
