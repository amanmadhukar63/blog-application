import { responseHandler } from "../utils/helper.js";

function login(req, res){
  return responseHandler(res, {
    msg: "Login successful",
    status: "success",
    statusCode: 200
  });
}

export {
  login
};