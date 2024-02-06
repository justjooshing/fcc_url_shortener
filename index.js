require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { findUrlByProperty, createAndSaveShortUrl } = require("./mongoose");
const { checkUrl } = require("./helpers");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const longUrl = req?.body?.url;
  if (!longUrl) res.status(400).json({ error: "invalid url" });
  try {
    checkUrl(longUrl);
    const data = await createAndSaveShortUrl(longUrl);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/shorturl/:shorturl?", async (req, res) => {
  const shortUrl = req.url.split("shorturl/")[1];
  // If doesn't exist
  if (!shortUrl) return res.status(404).send("Not found");
  // If not a number
  if (!Number(shortUrl)) return res.status(400).json({ error: "Wrong format" });

  try {
    const data = await findUrlByProperty(shortUrl, "shortUrl");
    if (!data) {
      res.status(404).json({ error: "No short URL found for the given input" });
    }
    res.redirect(data.original_url);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
