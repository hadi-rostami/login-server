const axios = require("axios").default;

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {string} code
 */
const forgot = async (email, password = null, code = null) => {
  let data = {
    email,
  };

  if (password && code) {
    data = { ...data, password, code };
  }

  const result = await axios.post(
    "http://localhost:5000/api/forgot-pass",
    data
  );

  console.log(result.data);
};

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {string} code
 */

// Send forgot Code
forgot("hadyrostami1385@gmail.com");

// change pass
forgot("hadyrostami1385@gmail.com", "123456789", "468752");
