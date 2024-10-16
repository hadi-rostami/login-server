const { WatchDirectoryFlags } = require("typescript");
const connection = require("../database/Connection");

/**
 * @param {string} query
 * @param { Array } params
 */
async function queryPromise(query, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
}

module.exports = queryPromise;
