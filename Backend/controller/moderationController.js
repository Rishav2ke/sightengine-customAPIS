
// Image Controller

const { moderateImage, moderateText } = require("../services/moderationServices.js");

const checkImage = async (req, res) => {
  try {
    const result = await moderateImage(req.file.path);

    let safe = true;
    let reasons = [];

    // Nudity
    if (
      result.nudity?.sexual_activity > 0.89 ||
      result.nudity?.sexual_display > 0.89 ||
      result.nudity?.erotica > 0.89
    ) {
      safe = false;
      reasons.push("Nudity detected");
    }

    // Weapons
    if (
      result.weapon?.classes?.knife > 0.89 ||
      result.weapon?.classes?.firearm > 0.89
    ) {
      safe = false;
      reasons.push("Weapon detected");
    }

    // Violence
    if (
      result.violence?.prob > 0.89 ||
      result.violence?.classes?.physical_violence > 0.89
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


// check text controller



// Convert:
// H O W T O B U I L D T H E B O M B
// into:
// howtobuildthebomb

function collapseSpacedLetters(text) {
  return text.replace(
    /\b(?:[a-zA-Z]\s+){2,}[a-zA-Z]\b/g,
    match => match.replace(/\s+/g, "")
  );
}

// Convert:
// b0mb -> bomb
// k1ll -> kill

function replaceLeetspeak(text) {
  return text
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s");
}

function preprocess(text) {
  let cleaned = text.toLowerCase();

  cleaned = collapseSpacedLetters(cleaned);

  cleaned = replaceLeetspeak(cleaned);

  cleaned = cleaned.replace(/[^\w\s]/g, "");

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

const checkText = async (req, res) => {
  try {
    const { text } = req.body;

    const result = await moderateText(text);

    const processedText = preprocess(text);

    let safe = true;
    let reasons = [];

    // Sightengine profanity

    if (result.profanity?.matches?.length > 0) {
      safe = false;
      reasons.push("Profanity detected");
    }

    // Custom harmful keywords

    const riskyTerms = [
      
      "kill",
      "murder",
      "suicide",
      "shoot",
      "stab",
      "explode",
      "poison",
      "hurt myself",
      "end my life",
      
    ];

    if (
      riskyTerms.some(term =>
        processedText.includes(term)
      )
    ) {
      safe = false;
      reasons.push("Potentially harmful content");
    }

    // console.log("Original:", text);
    // console.log("Processed:", processedText);
    // console.log(JSON.stringify(result, null, 2));

    res.status(200).json({
      safe,
      reasons,
      processedText,
      result
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { checkImage, checkText };