import Application from "../models/Application.js";

// Allows HR to see a summary of each employee’s profile
const application_getAll = async (req, res) => {
  try {
    const applications = await Application.find();

    res.status(200).json({
      length: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// search for employees by first name, last name or preferred name
const application_filter = async (req, res) => {
  try {
    const { firstName, lastName, preferredName } = req.query;

    // Build the search query based on provided query params
    const searchQuery = {};
    if (firstName) {
      searchQuery["firstName"] = { $regex: firstName, $options: "i" };
    }
    if (lastName) {
      searchQuery["lastName"] = { $regex: lastName, $options: "i" };
    }
    if (preferredName) {
      searchQuery["preferredName"] = { $regex: preferredName, $options: "i" };
    }
    const filteredApplications = await Application.find({ ...searchQuery });
    res.status(200).json({
      length: filteredApplications.length,
      filteredApplications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
  application_getAll,
  application_filter,
  application_get,
  application_create,
  application_update,
  application_hr_update,
};

export default applicationController;
