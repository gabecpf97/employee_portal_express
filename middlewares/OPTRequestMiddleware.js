import validator from "validator";

const optRequestValidator = (req, res, next) => {
  if (req.body.step === "") {
    return res.status(422).send({ message: "Please enter form step" });
  }
  if (
    req.body.step !== "OPTReceipt" &&
    req.body.step !== "OPTEAD" &&
    req.body.step !== "I983" &&
    req.body.step !== "I20"
  ) {
    return res.status(422).send({ message: "Please enter valid form step" });
  }
  next();
};

export default optRequestValidator;
