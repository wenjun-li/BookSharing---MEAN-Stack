module.exports = function () {
    var mongoose = require('mongoose');

    var RequestSchema = mongoose.Schema({
        borrower: {type: mongoose.Schema.Types.ObjectId, ref: 'UserInfoModel'},
        bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'BookModel'},
        requestMessage: String,
        state: {type: String, enum: ['PENDING', 'REJECTED', 'BORROWED', 'RETURNED']},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: 'request'});
    return RequestSchema;
};