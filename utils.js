// utils.js
// ========
module.exports = {
  //we'll use this to pass data to templates
  createEJSTemplateDataDictionary : function (req, res) {
    return { session: req.session, activeRoute: req.activeRoute };
  },

};

var other = function () {
}
