module.exports = function () {
    var mongoose = require('mongoose');

    var widgetSchema = mongoose.Schema({
        _page: {type: mongoose.Schema.Types.ObjectId, ref: 'PageModel'},
        type: {type: String, enum: ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'TEXT']},
        name: String,
        text: String,
        placeholder: {type: String, default: "placeholder"},
        description: {type: String, default: "description"},
        url: String,
        width: {type: String, default: "100%"},
        height: {type: String},
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: 'widgets'});

    return widgetSchema;
};
