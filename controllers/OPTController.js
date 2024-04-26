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
const optrequest_get_hr = async (req, res, next) => {
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

const optController = {
  optrequest_update_doc,
  optrequest_get_hr,
};

export default optController;
