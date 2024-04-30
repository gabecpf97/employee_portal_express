import Housing from '../models/Housing.js';
import User from '../models/User.js';
import FacilityReport from '../models/FacilityReport.js';

// Create facility report
const CreateFacilityReport = async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findById(userId);
        const housingInfo = await Housing.findById(user.housingId)

        // check if the user exists or not
        if (!user) {
            return res.status(401).json({
                message: "User doesn't exist!",
            });
        }

        //create a new facility report
        const { title, description } = req.body;
        if(!title || !description){
            res.status(400).send({
                message: "Facility report needs title and description!",
            });
        }
        const newFacilityReport = new FacilityReport({
            housingId : user.housingId,
            title: title,
            description: description,
            createdBy: userId,
            timestamp: Date.now(),
            status: "open",
            comments: []
        });
        newFacilityReport.save();
        
        // update user's housing's facilityReportsIds list
        const updateHousing = await Housing.updateOne(
            {_id: user.housingId },
            { $push: { facilityReportsIds: newFacilityReport._id } }
        )
        if (!updateHousing) {
            return res.status(404).send({ message: "Housing not found. "});
        }
        return res.status(200).send({
            message: "Facility report created successfully!",
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const ShowUserFacilityReports = async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    try {
        const reports = await FacilityReport.find({ createdBy: userId });
        return res.status(200).send({
            reports,
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}


const GetSingleFacilityReport = async (req, res) => {
    // const userId = req.body.userId;
    const reportId = req.params.reportId;
    try{
        const report = await FacilityReport.findById(reportId);
        if (!report) {
            return res.status(404).send({
                message: "Facility report not found."
            });
        }
        return res.status(200).send({
            report,
        });
    } catch {
        return res.status(500).send({
            message: error.message
        });
    }
}

//Comments controllers
const PostCommentToReport = async (req, res) => {
    const reportId = req.params.reportId;
    const userId = req.body.userId;
    const description = req.body.description;
    if(!description){
        return res.status(400).send({
            message: "Please input comment description"
        });
    }
    const newComment = {
        description: description,
        createdBy: userId,
        timestamp: Date.now(),
    }
    try {
        const newReport = await FacilityReport.findById(reportId);
        if (!newReport) {
            return res.status(404).send({
                message: "Facility report not found."
            });
        }
        newReport.comments.push(newComment);
        newReport.save();
        return res.status(200).send({
            message: "comment submitted successfully.",
            newReport,
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
}

const GetSingleFacilityComments = async (req, res) => {
    const reportId = req.params.reportId;

    try {
        const report = await FacilityReport.findById(reportId);
        if (!report) {
            return res.status(404).send({
                message: "Facility report not found."
            });
        }
        const comments = report.comments;
        return res.status(200).send({
            comments,
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
}

export {
    CreateFacilityReport,
    ShowUserFacilityReports,
    GetSingleFacilityReport,
    PostCommentToReport,
    GetSingleFacilityComments,
};