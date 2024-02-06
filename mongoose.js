const mongoose = require("mongoose");
const { stripDetails } = require("./helpers");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI);

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
});

const URL = mongoose.model("URL", urlSchema);

const findUrlByProperty = async (url, property) => {
  try {
    const data = await URL.findOne({ [property]: url });
    // don't strip if null
    return data ? stripDetails(data) : data;
  } catch (err) {
    throw err;
  }
};

const createAndSaveShortUrl = async (url) => {
  try {
    const data = await findUrlByProperty(url, "longUrl");
    // already exists in db
    if (data) {
      // already stripped
      return data;
    } else {
      const count = await URL.countDocuments();
      const savedEntry = await URL.create({
        longUrl: url,
        shortUrl: count + 1,
      });
      return stripDetails(savedEntry);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { findUrlByProperty, createAndSaveShortUrl };
