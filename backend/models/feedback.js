import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  besoins: {
    type: String,
  },
  Nom_responsable: {
    type: String,
  },
  Tel: {
    type: String,
  },
  Fax: {
    type: String,
  },
  email: {
    type: String,
  },
  Suggestion: {
    type: String,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
