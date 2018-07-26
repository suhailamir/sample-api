var restify = require('restify');

var server = restify.createServer({
    version: '1.0.0'
});

var users = [];

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(cors.actual);
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.post('/api/user/register', function (req, resMain, next) {
    console.log('got request :', req.body);
    if (req.body && req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;

        console.log(req.body.email + ": " + req.body.password);
        var userExists = users.find(function (element) {
            return element.email == req.body.email;
        });
        if (userExists) {
            resMain.send(400, { response: "User already exists" });

        } else {
            users.push({ email: email, password: password })
            resMain.send({ response: "user successfully created" });
        }
    } else {
        resMain.send(400, { response: "Incorrect JSON structure" });
    }
    return next();
});
server.post('/api/user/login', function (req, resMain, next) {
    if (req.body && req.body.email && req.body.password) {
        var email = req.body.email;
        console.log(req.body.email + ": " + req.body.password);
        var userExists = users.find(function (element) {
            return element.email == req.body.email && element.password == req.body.password;
        });
        if (userExists) {
            resMain.send(200, { response: "login successfull" });

        } else {
            resMain.send(400, { response: "Invalid email or passowrd" });

        }
    } else {
        resMain.send(400, { response: "Incorrect JSON structure" });
    }
    return next();
});


// Start the server:
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
