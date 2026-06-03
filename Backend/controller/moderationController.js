// controllers/moderationController.js

const { moderateImage } = require("../services/moderationServices.js");

const checkImage = async (req, res) => {
  try {
    const result = await moderateImage(req.file.path);

    let safe = true;
    let reasons = [];

    // Nudity
    if (
      result.nudity?.sexual_activity > 0.5 ||
      result.nudity?.sexual_display > 0.5 ||
      result.nudity?.erotica > 0.5
    ) {
      safe = false;
      reasons.push("Nudity detected");
    }

    // Weapons
    if (
      result.weapon?.classes?.knife > 0.5 ||
      result.weapon?.classes?.firearm > 0.5
    ) {
      safe = false;
      reasons.push("Weapon detected");
    }

    // Violence
    if (
      result.violence?.prob > 0.5 ||
      result.violence?.classes?.physical_violence > 0.5
    ) {
      safe = false;
      reasons.push("Violence detected");
    }

    res.status(200).json({
      safe,
      reasons,
      scores: {
        sexual_activity: result.nudity?.sexual_activity,
        sexual_display: result.nudity?.sexual_display,
        erotica: result.nudity?.erotica,
        knife: result.weapon?.classes?.knife,
        firearm: result.weapon?.classes?.firearm,
        violence: result.violence?.prob,
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { checkImage };