const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/content/all", [authJwt.verifyToken], controller.allAccess);

  app.get(
    "/content/student",
    [authJwt.verifyToken, authJwt.isStudentOrAdmin],
    controller.studentBoard
  );

  app.get(
    "/content/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};