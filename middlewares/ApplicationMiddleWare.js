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
  const { status, picture, cellPhone, workPhone, gender, citizenship } =
    req.body.application;
  // check status
  if (!checkValidStatus(status)) {
    return res.status(422).send({ message: "Please enter valid status" });
  }
  // check picture
  if (!picture || picture == "") {
    req.body.application.picture = "default placeholder image";
  }
  // check address
  if (!req.body.application.address.buildingAptNum) {
    return res
      .status(422)
      .send({ message: "building/apt # can only be number" });
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
  try {
    if (
      (citizenship === "non-citizen" && !workAuthorization) ||
      (workAuthorization &&
        (!workAuthorization.type ||
          !workAuthorization.startDate ||
          !workAuthorization.endDate))
    ) {
      return res
        .status(422)
        .send({ message: "please submit work authorization document" });
    }
  } catch (err) {
    console.log(err);
  }
  next();
};

const checkIfEmpty = (
  status,
  firstName,
  lastName,
  address,
  cellPhone,
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
  if (!SSN) {
    return { message: "Missing SSN fields" };
  }
  if (!DOB) {
    return { message: "Missing DOB fields" };
  }
  if (!citizenship) {
    return { message: "Missing citizenship fields" };
  }
  if (citizenship === "non-citizen" && !workAuthorization) {
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
  if (
    status === "not start" ||
    status === "approved" ||
    status === "rejected" ||
    status === "pending"
  ) {
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
