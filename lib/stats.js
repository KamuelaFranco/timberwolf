module.exports = exports;

exports.save = function (req, stats) {
	stats.push(req.query);
};