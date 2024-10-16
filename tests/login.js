const axios = require("axios").default;

/**
 *
 * @param {string} email
 * @param {string} password
 */
const login = async (email, password) => {
  let data = {
    email,
    password,
  };

  const result = await axios.post("http://localhost:5000/api/login", data);

  console.log(result.headers["access-token"]);
  console.log(result.headers["refresh-token"]);
  console.log(result.data);
};

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {string} code
 */

// login
login("hadyrostami1385@gmail.com", "12345678");
