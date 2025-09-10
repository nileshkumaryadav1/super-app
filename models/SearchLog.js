import mongoose from "mongoose";

const SearchLogSchema = new mongoose.Schema({
  query: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SearchLog ||
  mongoose.model("SearchLog", SearchLogSchema);
