import Application from "../models/Application.js";
import OPTRequest from "../models/OPTRequest.js";
import User from "../models/User.js";

// Allows HR to see a summary of each employee’s profile
const application_getAll = async (req, res) => {
  try {
    const applications = await Application.find({ status: "approved" });

    return res.status(200).json({
      length: applications.length,
      applications,
    });
  } catch (error) {
    return next({ code: 500, message: error.message });
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
    return res.status(200).json({
      length: filteredApplications.length,
      filteredApplications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//search for applications of certain status
const application_status = async (req, res) => {
  try {
    const status = req.query.status;
    console.log(status);

    const filteredApplications = await Application.find({ status: status });
    return res.status(200).json({
      length: filteredApplications.length,
      filteredApplications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const application_getMy = async (req, res, next) => {
  try {
    const theApplication = await Application.findOne({
      userId: req.body.userId,
    });
    if (!theApplication) {
      const theUser = await User.findById(req.body.userId);
      if (!theUser) {
        return next({ code: 422, message: "No such user" });
      }
      if (theUser.status === "not start") {
        return res.status(200).send({
          application: { userId: req.body.userId, status: "not start" },
        });
      }
      return next({ code: 422, message: "No such application" });
    } else {
      return res.status(200).send({ application: theApplication });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_get = async (req, res, next) => {
  try {
    const theApplication = await Application.findById(req.params.id);
    if (!theApplication) {
      return next({ code: 422, message: "No such application" });
    } else {
      return res.status(200).send({ application: theApplication });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_create = async (req, res, next) => {
  try {
    const theApplication = await Application.findOne({
      userId: req.body.userId,
    });
    if (theApplication) {
      return next({ code: 400, message: "Already created application" });
    }
    const theUser = await User.findById(req.body.userId);
    if (!theUser) {
      return next({ code: 422, message: "No such user" });
    }
    req.body.application.userId = req.body.userId;
    req.body.application.email = theUser.email;
    req.body.application.status = "pending";
    const newApplication = new Application(req.body.application);
    // create new opt request if select f1opt
    if (newApplication.workAuthorization.type === "F1(CPT/OPT)") {
      const newOPt = new OPTRequest({
        appId: newApplication._id,
        step: "OPTReceipt",
        OPTReceipt: {
          status: "pending",
          document: newApplication.workAuthorization.document,
          feedback: "",
        },
        OPTEAD: {
          status: "unuploaded",
        },
        I983: {
          status: "unuploaded",
        },
        I20: {
          status: "unuploaded",
        },
      });
      await newOPt.save();
    }
    await newApplication.save();
    await User.findByIdAndUpdate(
      req.body.userId,
      { applicationId: newApplication._id, status: "pending" },
      {}
    );
    return res.status(200).send({ application: newApplication });
  } catch (err) {
    console.log(err);
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
      updatedApplication.status =
        theApplication.status === "approved" ? "approved" : "pending";
      updatedApplication.feedback = theApplication.feedback;

      //Michael: if update request contains no document, use previous ones
      if (
        !updatedApplication.picture ||
        updatedApplication.picture ===
          "https://employee-visa-documents.s3.us-east-2.amazonaws.com/profile.png"
      ) {
        updatedApplication.picture = theApplication.picture;
      }
      if (!updatedApplication.workAuthorization.document) {
        updatedApplication.workAuthorization.document =
          theApplication.workAuthorization.document;
      }
      if (!updatedApplication.driverLicense.document) {
        updatedApplication.driverLicense.document =
          theApplication.driverLicense.document;
      }
      //---------------------------------------
      await Application.findByIdAndUpdate(
        req.params.id,
        updatedApplication,
        {}
      );

      await User.findOneAndUpdate(
        { _id: updatedApplication.userId },
        {
          status: theApplication.status === "approved" ? "approved" : "pending",
        }
      );
      return res.status(200).send({ application: updatedApplication });
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
        {
          feedback: req.body.feedback ? req.body.feedback : "",
          status: req.body.status,
        },
        {}
      );
      await User.findOneAndUpdate(
        { applicationId: req.params.id },
        { status: req.body.status }
      );
      return res.status(200).send({ id: theApplication._id });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const application_get_all = async (req, res, next) => {
  try {
    const theApplications = await Application.find({});
    if (theApplications.length < 1) {
      return next({ code: 422, message: "No application" });
    } else {
      return res.status(200).send({ applications: theApplications });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

const applicationController = {
  application_getAll,
  application_filter,
  application_get,
  application_getMy,
  application_create,
  application_update,
  application_hr_update,
  application_status,
  application_get_all,
};

export default applicationController;
