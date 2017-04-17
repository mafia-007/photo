const Webserver = require('./webserver')

let webserver = new Webserver()
webserver.listen(5001);

process.on('SIGINT', function() {
    process.exit();
});
