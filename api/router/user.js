const router = require("express").Router();
require("dotenv").config();
const {
  login,
  verifyOtp,
  sendOtp,
  resendOtp,
  changePassword,
  getUserProfile,
  updateUserProfile,
  logOut,
  deactivateAccount
} = require("../controller/user.controller");
const {
  validator,
  queryValidator,
} = require("../middleware/validator.middlewares");
const { scopeValidator } = require("../middleware/scope.middlewares");
const { authentication } = require("../middleware/authentication.middlewares");
const {
  sendOtpSchema,
  loginSchema,
  resedOtpSchema,
  verifyOTP,
  changePasswordSchema,
  updateProfileSchema
} = require("../schema/user.schema");

router.post("/login" , validator(loginSchema), login);
router.post("/send-otp" , validator(sendOtpSchema), sendOtp);
router.post("/verify-otp", validator(verifyOTP), verifyOtp);
router.post("/resend-otp",  validator(resedOtpSchema), resendOtp);
router.post("/logout",  authentication,scopeValidator(), logOut);
router.post("/deactivate-account",  authentication,scopeValidator(), deactivateAccount);


router.post(
  "/change-password",
  authentication,
  scopeValidator(),
  validator(changePasswordSchema),
  changePassword
);

router.get("/profile", authentication, scopeValidator(), getUserProfile);
router.patch(
  "/profile",
  authentication,
  scopeValidator(),
  validator(updateProfileSchema),
  updateUserProfile
);


module.exports = router;
