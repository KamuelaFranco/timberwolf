exports.save = (req, stats) => {
  stats.push(req.query);
};
