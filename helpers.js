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
  short_url: shortUrl,
});

module.exports = { checkUrl, stripDetails };
