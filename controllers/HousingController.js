import Housing from '../models/Housing.js';
import User from '../models/User.js';

const ShowUserHousing = async (req, res) => {
    const housingrId = req.params.housingId;
    try {
        const houseInfo = await Housing.findById(housingrId);
        return res.status(200).send({ houseInfo})
    } catch (error) {
        return res.status(401).send({
            message: error.message
        });
    }
}

const CreateHousing = async (req, res) => {
    try {
        const newHousing = await Housing.create(req.body)
        return res.status(200).send({message: "house created", newHousing});
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

export { ShowUserHousing, CreateHousing};