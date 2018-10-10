module.exports = function () {
    var mongoose = require('mongoose');

    var BookSchema = mongoose.Schema({
        owner: {type: mongoose.Schema.Types.ObjectId, ref: 'UserInfoModel'},
        name: {type: String, text: true},
        author: {type: String, text: true},
        ISBN: {type: String, text: true},
        photo: {type: String, default: "/uploadBookPhotos/book-default.png"},
        description: String,
        availability: {type: Boolean, default: true},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: 'book'});
    return BookSchema;
};
