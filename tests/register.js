const axios = require("axios").default;

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {string} code
 */
const register = async (email, password = null, code = null) => {
  let data = {
    email,
  };

  if (password) data["password"] = password;
  else data["code"] = code;

  const result = await axios.post("http://localhost:5000/api/register", data);

  console.log(result.data);
};


// Send register Code
register("hadyrostami1385@gmail.com", "12345678");

// Login
register("hadyrostami1385@gmail.com", null, "238945");
