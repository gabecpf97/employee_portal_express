import xss from "xss";

const applicationFieldValidation = (req, _res, next) => {
  for (let key in req.body.application) {
    if (typeof req.body.application[key] == "string") {
      req.body.application[key] = xss(req.body.application[key]);
    }
  }
  next();
};

const bodyInputValid = (req, _res, next) => {
  loopthroughAllInput(req.body);
  next();
};

const loopthroughAllInput = (target) => {
  for (let field in target) {
    if (typeof field === "object") {
      loopthroughAllInput(field);
    } else {
      if (typeof field === "string") {
        field = xss(field);
      }
    }
  }
};

const inputValidaton = {
  applicationFieldValidation,
  bodyInputValid,
};

export default inputValidaton;
