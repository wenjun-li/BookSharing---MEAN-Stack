module.exports = function (app) {
    var model = require('./model/models.server')();

    require('./services/userInfo.service.server.js')(app, model);
    require('./services/book.service.server')(app, model);
    require('./services/request.service.server')(app, model);
};