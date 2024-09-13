import Feedback from "../models/feedback.js";

const createfeedback = async (req, res) => {
  //get date from req
  let email = req.body.email;
  let besoins = req.body.besoins;
  let Nom_responsable = req.body.Nom_responsable;
  let Tel = req.body.Tel;
  let Fax = req.body.Fax;
  let Suggestion = req.body.Suggestion;

  //create feedback
  const feedback = new Feedback({
    email: email,
    besoins: besoins,
    Nom_responsable: Nom_responsable,
    Tel: Tel,
    Fax: Fax,
    Suggestion: Suggestion,
  });
  await feedback.save();
  res.send({
    message: "compte success",
  });
};

const getAllfeedback = async (req, res) => {
  try {
    // Find all comptes in the database
    const feedback = await Feedback.find();

    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export { createfeedback, getAllfeedback };
