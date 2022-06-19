if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const axios = require("axios");
const qs = require("qs");
const Base64 = require("js-base64").Base64;
const { forEach } = require("lodash");

exports.handler = (event, context, callback) => {
  axios.defaults.baseURL = process.env.YD_API;
  axios.defaults.headers.common["Authorization"];

  authenticateUser(process.env.YD_USERNAME, process.env.YD_PASSWORD)
    .then((data) => {
      if (!data.token) throw new Error(data.message);
      axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;

      console.log("Login success!");

      console.log("Getting inactive users...");
      return getUnverifiedMobileAccounts();
    })
    .then((mobileNumbers) => {
      console.log("Notify people...");

      forEach(mobileNumbers, (mobile) => {
        sendReminder("automated", mobile);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });

  async function authenticateUser(username, password) {
    return axios
      .post(
        "/account/user/authenticate",
        qs.stringify({
          username: username,
          password: Base64.encode(password),
        })
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

  async function getUnverifiedMobileAccounts() {
    return axios
      .get("/account/unverified/mobile")
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

  async function sendReminder(uid, mobile) {
    return axios
      .post(
        `/account/user/request/mobile/activation/${uid}`,
        qs.stringify({
          mobile: mobile,
        })
      )
      .then(function (response) {
        console.log(`Message sent to: ${mobile}`);
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        throw error;
      });
  }
};
