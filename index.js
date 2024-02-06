require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { findUrlByProperty, createAndSaveShortUrl } = require("./mongoose");
const { checkUrl, returnError } = require("./helpers");
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
  if (!longUrl) returnError(res);
  try {
    checkUrl(longUrl);
    const data = await createAndSaveShortUrl(longUrl);
    res.json(data);
  } catch (err) {
    console.error("post", err);
    returnError(res);
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
    res.json(data);
  } catch (err) {
    console.error("get", err);
    returnError(res);
  }
});

/**
You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. 
  Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
If you pass an invalid URL that doesn't follow the valid http://www.example.com format, 
 the JSON response will contain { error: 'invalid url' }
 */

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
