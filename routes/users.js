const router = require("express-promise-router")();
const passport = require("passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const UsersController = require("../controllers/users");
require("../passport");

router.post(
  "/signup",
  validateBody(schemas.authSchema),
  UsersController.signUp,
);
router.post(
  "/signin",
  validateBody(schemas.authSchema),
  passport.authenticate("local", { session: false }),
  UsersController.signIn,
);
router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  UsersController.secret,
);

router.post(
  "/oauth/google",
  passport.authenticate("googleToken", { session: false }),
  UsersController.googleOAuth,
);

router.post(
  "/oauth/facebook",
  passport.authenticate("facebookToken", { session: false }),
  UsersController.facebookOAuth,
);

module.exports = router;
