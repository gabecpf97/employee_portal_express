import transporter from "../config/email.js";
import OPTRequest from "../models/OPTRequest.js";
import Application from "../models/Application.js";
import containsIgnoreCase from "../utils/regularExpression.js";

const get_optId_by_applicationId = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const application = await Application.findOne({ userId: userId });
    const opt_request = await OPTRequest.findOne({ appId: application._id });

    if (!opt_request) {
      return res
        .status(400)
        .send({ message: "User does not have OPT request submitted" });
    }

    return res.status(200).json({
      requestId: opt_request._id,
    });
  } catch (error) {
    return next({ code: 500, message: error.message });
  }
};

// receive document from employee frontend to update status and return status
const optrequest_update_doc = async (req, res, next) => {
  try {
    const theOptRequest = await OPTRequest.findById(req.params.id);
    if (!theOptRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
      if (theOptRequest.step !== req.body.step) {
        return next({
          code: 401,
          message: "Please submit correct document for your current stage",
        });
      } else {
        const updateRequest = theOptRequest;
        updateRequest[theOptRequest.step] = {
          status: "pending",
          document: req.body.document, // link to the doc handle from file middleware
          feedback: "",
        };
        await OPTRequest.findByIdAndUpdate(req.params.id, updateRequest, {});
        return res.status(200).send({ visa: updateRequest });
      }
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

// send request by id
const optrequest_get_id = async (req, res, next) => {
  try {
    const theOptRequest = await OPTRequest.findById(req.params.id);
    if (!theOptRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
      return res.status(200).send({ request: theOptRequest });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

// get all request that is in progress
const optrequest_get_inProgress = async (req, res, next) => {
  try {
    const theRequests = await OPTRequest.find({
      "I20.status": { $ne: "approved" },
    });
    if (theRequests.length < 1) {
      return next({ code: 422, message: "No such OPT requests" });
    } else {
      return res.status(200).send({ requests: theRequests });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

// get all visa request
const optrequest_get_all = async (req, res, next) => {
  try {
    const theRequests = await OPTRequest.find({}).populate({
      path: "appId",
      select: "firstName lastName prefferedName workAuthorization",
    });
    if (theRequests.length < 1) {
      return res.status(200).send({ requests: [] });
    } else {
      if (!req.query.all) {
        const result = theRequests.filter((request) => {
          if (!request.appId) {
            return false;
          }
          if (
            req.query.firstName &&
            containsIgnoreCase(request.appId.firstName, req.query.firstName)
          ) {
            return true;
          }
          if (
            req.query.lastName &&
            containsIgnoreCase(request.appId.lastName, req.query.lastName)
          ) {
            return true;
          }
          if (
            request.appId.preferredName &&
            req.query.preferredName &&
            containsIgnoreCase(
              request.appId.preferredName,
              req.query.preferredName
            )
          ) {
            return true;
          }
          return false;
        });
        return res.status(200).send({ requests: result });
      } else {
        return res.status(200).send({ requests: theRequests });
      }
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const optrequest_hr_action = async (req, res, next) => {
  try {
    const theRequest = await OPTRequest.findById(req.params.id);
    if (!theRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
      const updateRequest = theRequest;
      updateRequest[theRequest.step] = {
        status: req.body.status,
        document: theRequest[theRequest.step].document,
        feedback: req.body.feedback ? req.body.feedback : "",
      };
      if (req.body.status === "approved") {
        updateRequest.step = nextStep(theRequest.step);
      }
      await OPTRequest.findByIdAndUpdate(req.params.id, updateRequest, {});
      res.status(200).send({ id: updateRequest._id });
    }
  } catch (err) {
    return next({ err: 500, message: err.message });
  }
};

const optrequest_hr_send_noti = async (req, res, next) => {
  try {
    const theRequest = await OPTRequest.findById(req.params.id).populate({
      path: "appId",
      select: "email",
    });
    if (!theRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
      if (theRequest[theRequest.step].status === "unuploaded") {
        const mailOption = {
          from: process.env.HR_EMAIL,
          to: theRequest.appId.email,
          subject: "HR portal notification",
          text: `Please upload form for ${theRequest.step}`,
        };
        const info = await transporter.sendMail(mailOption);
        if (info.response) {
          return res
            .status(200)
            .send({ message: `sent id: ${info.messageId}` });
        } else {
          return next({ code: 422, message: "Sent email failed" });
        }
      } else {
        return next({
          code: 400,
          message:
            "File already exists for current step / previous step not approved",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return next({ err: 500, message: err.message | err.response });
  }
};

const nextStep = (curStep) => {
  switch (curStep) {
    case "OPTReceipt":
      return "OPTEAD";

    case "OPTEAD":
      return "I983";

    case "I983":
      return "I20";

    default:
      return "I20";
  }
};

const optController = {
  optrequest_update_doc,
  optrequest_get_id,
  optrequest_get_inProgress,
  optrequest_get_all,
  optrequest_hr_action,
  optrequest_hr_send_noti,
  get_optId_by_applicationId,
};

export default optController;
