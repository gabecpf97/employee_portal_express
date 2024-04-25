import validator from "validator";

const applicationValidator = (req, res, next) => {
  if (!req.body.application) {
    return res.status(422).send({ message: "Please submit the application" });
  }
  const emptyCheck = checkIfEmpty(
    req.body.application.status,
    req.body.application.firstName,
    req.body.application.lastName,
    req.body.application.address,
    req.body.application.cellPhone,
    req.body.application.email,
    req.body.application.SSN,
    req.body.application.DOB,
    req.body.application.citizenship,
    req.body.application.workAuthorization,
    req.body.application.reference,
    req.body.application.emergency
  );
  // check empty field
  if (emptyCheck.code) {
    return res.status(422).send({ message: emptyCheck.message });
  }
  const { status, picture, cellPhone, workPhone, email, gender, citizenship } =
    req.body.application;
  // check status
  if (!checkValidStatus(status)) {
    return res.status(422).send({ message: "Please enter valid status" });
  }
  // check picture
  if (!picture) {
    req.body.picture = "default placeholder image";
  }
  // check phone valid
  if (!checkPhone(cellPhone)) {
    return res
      .status(422)
      .send({ message: "Please enter a valid cellphone number" });
  }
  if (workPhone && !checkPhone(workPhone)) {
    return res
      .status(422)
      .send({ message: "Please enter a valid workphone number" });
  }
  // check email address
  if (!validator.isEmail(email)) {
    return res
      .status(422)
      .send({ message: "Please enter a valid email address" });
  }
  // check gender
  if (gender !== "male" && gender !== "female" && gender !== "") {
    return res
      .status(422)
      .send({ message: "Please enter a valid gender or leave empty" });
  }
  // check citizenship
  if (
    citizenship !== "green card" &&
    citizenship !== "citizen" &&
    citizenship !== "non-citizen"
  ) {
    return res
      .status(422)
      .send({ message: "Please enter a valid citizenship status" });
  }
  next();
};

const checkIfEmpty = (
  status,
  firstName,
  lastName,
  address,
  cellPhone,
  email,
  SSN,
  DOB,
  citizenship,
  workAuthorization,
  reference,
  emergency
) => {
  if (!status) {
    return { message: "Missing status fields" };
  }
  if (!firstName) {
    return { message: "Missing firstName fields" };
  }
  if (!lastName) {
    return { message: "Missing lastName fields" };
  }
  if (!address) {
    return { message: "Missing address fields" };
  }
  if (!cellPhone) {
    return { message: "Missing cellPhone fields" };
  }
  if (!email) {
    return { message: "Missing email fields" };
  }
  if (!SSN) {
    return { message: "Missing SSN fields" };
  }
  if (!DOB) {
    return { message: "Missing DOB fields" };
  }
  if (!citizenship) {
    return { message: "Missing citizenship fields" };
  }
  if (!workAuthorization) {
    return { message: "Missing workAuthorization fields" };
  }
  if (!reference) {
    return { message: "Missing referenee fields" };
  }
  if (!emergency | (emergency.length < 1)) {
    return { message: "Missing emergency fields" };
  }
  return false;
};

const checkValidStatus = (status) => {
  if (status === "approved" || status === "rejected" || status === "pending") {
    return true;
  }
  return false;
};

const checkPhone = (phoneNum) => {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneNum)) {
    return false;
  }
  return true;
};

export default applicationValidator;
