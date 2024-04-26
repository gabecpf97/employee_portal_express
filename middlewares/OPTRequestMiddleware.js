const step_validator = (req, res, next) => {
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

const hr_action_validator = (req, res, next) => {
  const theStatus = req.body.status;
  if (theStatus === "" || !theStatus) {
    return res
      .status(422)
      .send({ message: "Please enter a status for update" });
  }
  if (theStatus !== "rejected" && theStatus !== "approved") {
    return res
      .status(422)
      .send({ message: "Please enter a valid status (rejected/approved)" });
  }
  next();
};

const optRequestValidator = {
  step_validator,
  hr_action_validator,
};

export default optRequestValidator;
