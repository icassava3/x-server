const Tunnel = require('./lib/Tunnel');

module.exports = function localtunnel(arg1, arg2, arg3) {
  // arg1={ host, port, subdomain }
  const options = typeof arg1 === 'object' ? arg1 : { ...arg2, port: arg1 };


  const client = new Tunnel(options);
  const callback = typeof arg1 === 'object' ? arg2 : arg3;


  // if (callback) {
  //   client.open(err => (err ? callback(err) : callback(null, client)));
  //   return client;
  // }
  return new Promise((resolve, reject) =>
    client.open(err => (err ? reject(err) : resolve(client)))
  );
};
