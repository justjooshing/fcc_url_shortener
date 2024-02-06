const returnError = (res) => res.status(400).json({ error: "invalid url" });
const checkUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (error) {
    throw error;
  }
  return url.href;
};

const stripDetails = ({ longUrl, shortUrl }) => ({
  original_url: longUrl,
  shortUrl,
});

module.exports = { returnError, checkUrl, stripDetails };
