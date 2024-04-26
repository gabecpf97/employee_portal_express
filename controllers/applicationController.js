import Application from "../models/Application.js";

const application_get = async (req, res, next) => {
  try {
    const theApplication = await Application.findById(req.params.id);
    if (!theApplication) {
      return next({ code: 422, message: "No such application" });
    } else {
      res.status(200).send({ application: theApplication });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_create = async (req, res, next) => {
  try {
    const newApplication = new Application(req.body.application);
    await newApplication.save();
    res.status(200).send({ id: newApplication._id });
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_update = async (req, res, next) => {
  try {
    const theApplication = await Application.findById(req.params.id);
    if (!theApplication) {
      return next({ code: 422, message: "No such application" });
    } else {
      const updatedApplication = req.body.application;
      updatedApplication.userId = theApplication.userId;
      updatedApplication.status = theApplication.status;
      updatedApplication.feedback = theApplication.feedback;
      await Application.findByIdAndUpdate(
        req.params.id,
        updatedApplication,
        {}
      );
      res.status(200).send({ id: theApplication._id });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_hr_update = async (req, res, next) => {
  try {
    const theApplication = await Application.findById(req.params.id);
    if (!theApplication) {
      return next({ code: 422, message: "No such application" });
    } else {
      await Application.findByIdAndUpdate(
        req.params.id,
        { feedback: req.body.feedback, status: req.body.status },
        {}
      );
      return res.status(200).send({ id: theApplication._id });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const applicationController = {
  application_get,
  application_create,
  application_update,
  application_hr_update,
};

export default applicationController;
