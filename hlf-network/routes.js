//SPDX-License-Identifier: Apache-2.0

var cannabis = require("./controller.js");

module.exports = function(app) {
  app.get("/get_cannabis/:id", function(req, res) {
    cannabis.get_cannabis(req, res);
  });
  app.get("/add_cannabis/:cannabis", function(req, res) {
    cannabis.add_cannabis(req, res);
  });
  app.get("/get_all_cannabis", function(req, res) {
    cannabis.get_all_cannabis(req, res);
  });
  app.get("/change_holder/:holder", function(req, res) {
    cannabis.change_holder(req, res);
  });
};
