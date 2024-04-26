import xss from "xss";

const applicationFieldValidation = (req, _res, next) => {
  for (let key in req.body.application) {
    if (typeof req.body.application[key] == "string") {
      req.body.application[key] = xss(req.body.application[key]);
    }
  }
  next();
};

const inputValidaton = {
  applicationFieldValidation,
};

export default inputValidaton;
