import Housing from '../models/Housing.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

const ShowUserHousing = async (req, res) => {
    const housingId = req.params.housingId;
    try {
        const houseInfo = await Housing.findById(housingId).populate('facilityReportsIds');
        if(!houseInfo){
            return res.status(404).send({ message: "housing does noe exist"})
        }
        const residents = []
        for(const residentId of houseInfo.residentIds){
            const profile = await Application.findOne({userId:residentId}).select("userId firstName middleName lastName prefferedName cellPhone email car")
            residents.push(profile)
        }
        return res.status(200).send({ houseInfo, residents})
    } catch (error) {
        return res.status(401).send({
            message: error.message
        });
    }
}

const CreateHousing = async (req, res) => {
    const userId = req.body.userId;

    try {
        const userInfo = await User.findById(userId);
        const isHR = userInfo.isHR;
        if (isHR) {
            const newHousing = await Housing.create(req.body)
            return res.status(200).send({message: "house created", newHousing});
        } else {
            return res.status(401).send({
                message: "You are not authorized to create new housing."
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

const DeleteHousing = async (req, res) => {
    const housingId = req.params.housingId;
    const userId = req.body.userId;
    // console.log(userId);
    try {
        const userInfo = await User.findById(userId);
        const isHR = userInfo.isHR;
        if (isHR) {
            const newHousingList = await Housing.findByIdAndDelete(housingId);
            if (!newHousingList) {
                return res.status(404).send({
                    message: "Housing not found."
                });
            }

            return res.status(200).send({
                message: "Housing has been deleted."
            })
        } else {
            return res.status(401).send({
                message: "You are not authorized to delete this housing."
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const ShowAllHousing = async (req, res) => {
    const userId = req.body.userId;
    try {
        const userInfo = await User.findById(userId);
        const isHR = userInfo.isHR;
        if (isHR) {
            const allHousing = await Housing.find();
            return res.status(200).send({allHousing});
        } else {
            return res.status(401).send({
                message: "You are not authorized to view all housing."
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}



export { 
    ShowUserHousing, 
    CreateHousing,
    DeleteHousing,
    ShowAllHousing,
};