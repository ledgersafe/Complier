//SPDX-License-Identifier: Apache-2.0

var asset = require("./controller.js");

module.exports = function(app) {
  app.get("/get_asset/:id", function(req, res) {
    asset.get_asset(req, res);
  });
  app.get("/add_asset/:asset", function(req, res) {
    asset.add_asset(req, res);
  });
  app.get("/get_all_asset", function(req, res) {
    asset.get_all_asset(req, res);
  });
  app.get("/change_holder/:holder", function(req, res) {
    asset.change_holder(req, res);
  });
};
