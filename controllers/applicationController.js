import Application from "../models/Application";

const application_get = async (req, res, next) => {
  try {
    const theApplication = new Application.findById(req.params.id);
    if (!theApplication) {
      console.log("No such application");
    } else {
      res.status(200).send({ application: theApplication });
    }
  } catch (err) {
    console.log(err);
  }
};

const application_create = async (req, res, next) => {
  try {
    const newApplication = new Application(req.body.application);
    await newApplication.save();
    res.status(200);
  } catch (err) {
    console.log(err);
  }
};

const application_update = async (req, res, next) => {
  try {
    const theApplication = await Application.findByIdAndUpdate(
      req.body.applicationId,
      req.body.application,
      {}
    );
    if (!theApplication) {
      console.log("No such application");
    } else {
      res.status(200);
    }
  } catch (err) {
    console.log(err);
  }
};

const applicationController = {
  application_get,
  application_create,
  application_update,
};

export default applicationController;
