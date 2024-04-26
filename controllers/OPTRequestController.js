import OPTRequest from "../models/OPTRequest.js";

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
          document: req.body.docLink,
          feedback: "",
        };
        await OPTRequest.findByIdAndUpdate(req.params.id, updateRequest, {});
        res.status(200).send({ id: theOptRequest._id });
      }
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

// send doc to HR frontend
const optrequest_get_id = async (req, res, next) => {
  try {
    const theOptRequest = await OPTRequest.findById(req.params.id);
    if (!theOptRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
      res.status(200).send({
        step: theOptRequest.step,
        formObject: theOptRequest[theOptRequest.step],
      });
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
      res.status(200).send({ requests: theRequests });
    }
  } catch (err) {
    return next({ code: 500, message: err.message });
  }
};

// get all visa request
const optrequest_get_all = async (req, res, next) => {
  try {
    const theRequests = await OPTRequest.find({}).populate({
      path: "userId",
      select: "firstName lastName preferredName",
    });
    if (theRequests.length < 1) {
      return next({ code: 422, message: "No OPT request" });
    } else {
      const result = theRequests.filter(
        (request) =>
          request.userId.firstName === req.query.name ||
          request.userId.lastName === req.query.name ||
          request.userId.preferredName === req.query.name
      );
      res.status(200).send({ requests: result });
    }
  } catch (err) {
    return next({ err: 500, message: err.message });
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
        feedback: req.body.feedback,
      };
      await OPTRequest.findByIdAndUpdate(req.params.id, updateRequest, {});
      res.status(200).send({ id: updateRequest._id });
    }
  } catch (err) {
    return next({ err: 500, message: err.message });
  }
};

const optrequest_hr_send_noti = async (req, res, next) => {
  try {
    const theRequest = await OPTRequest.findById(req.params.id);
    if (!theRequest) {
      return next({ code: 422, message: "No such OPT request" });
    } else {
    }
  } catch (err) {
    return next({ err: 500, message: err.message });
  }
};

const optController = {
  optrequest_update_doc,
  optrequest_get_id,
  optrequest_get_inProgress,
  optrequest_get_all,
  optrequest_hr_action,
};

export default optController;
