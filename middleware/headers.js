module.exports = (req, res, next) => {
    res.header('access-control-allow-origin', '*'); // tell browser to allow source
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');  // methodor methods allowed when access server
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');  // in response to pre-flight requests (before access endpoint) - which http headers can be used in a request
    next();
};

