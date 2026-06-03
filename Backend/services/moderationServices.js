// services/sightengineService.js

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const moderateImage = async (filePath) => {

    const form = new FormData();

    form.append("media", fs.createReadStream(filePath));

    form.append(
        "models",
        "nudity-2.1,weapon,violence"
    );

    form.append(
        "api_user",
        process.env.API_USER
    );

    form.append(
        "api_secret",
        process.env.API_SECRET
    );

    const response = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        form,
        {
            headers: form.getHeaders()
        }
    );

    return response.data;
};

module.exports = {
    moderateImage
};