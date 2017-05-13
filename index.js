const path = require('path');
const restify = require('restify');

const server = restify.createServer();

server.use(restify.CORS());

server.get('/echo/:name', (req, res, next) => {
  res.send('echo ' + req.params.name);
  next();
});

// https://github.com/restify/node-restify/issues/535#issuecomment-53646114
server.get(/\/app\/?.*/, (req, res, next) => {
  req.url = req.url.substr('/app'.length);
  req.path = () => req.url;

  restify.serveStatic({
    directory: path.join(__dirname, 'public'),
    default: 'index.html'
  })(req, res, next);
});

server.listen(80, () => {
  console.log('%s listening at %s', server.name, server.url);
});
