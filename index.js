const path = require('path');
const restify = require('restify');

const ENV = process.argv[2] || 'dev';
const config = require(`./environments/${ENV}.json`);

const server = restify.createServer();

server.use(restify.CORS());

server.get('/echo/:name', (req, res, next) => {
  res.send('echo ' + req.params.name);
  next();
});

if (config.log) {
  server.use((req, res, next) => {
    // TODO : log4js
    console.log(`${req.route.method}: ${req.url}`);
    next();
  });
}

// https://github.com/restify/node-restify/issues/535#issuecomment-53646114
server.get(/\/app\/?.*/, (req, res, next) => {
  req.url = req.url.substr('/app'.length);
  req.path = () => req.url;

  restify.serveStatic({
    directory: path.join(__dirname, 'public'),
    default: 'index.html'
  })(req, res, next);
});

server.listen(config.serverPort, () => {
  console.log('%s listening at %s', server.name, server.url);
});
