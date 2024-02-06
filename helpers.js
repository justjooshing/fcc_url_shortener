const checkUrl = (string) => {
  let url;

  try {
    url = new URL(string);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("invalid url");
    }
  } catch (error) {
    throw new Error("invalid url");
  }
  return url.href;
};

const stripDetails = ({ longUrl, shortUrl }) => ({
  original_url: longUrl,
  short_url: shortUrl,
});

module.exports = { checkUrl, stripDetails };
