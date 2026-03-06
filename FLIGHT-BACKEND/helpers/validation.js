const { check } = require('express-validator');

exports.emailpassword = [
   check("email", "Email id is required").not().isEmpty(),
   check("email", "Enter vaild Email").isEmail(),
   check("password", "Password is required").not().isEmpty(),
];
exports.sendOtpValidation = [
   check("mobile_no", "Mobile no is required").not().isEmpty(),
   check("mobile_no", "Mobile no must be numeric").isNumeric(),
];


exports.verifyOtpValidation = [
   check('mobile_no', 'Mobile no is required').not().isEmpty(),
   check('mobile_no', 'Mobile no must be numeric').isNumeric(),

   check('otp', 'otp no must be numeric').isNumeric(),
   check('otp', 'otp is required').not().isEmpty(),
]

exports.loginv = [
   check('email', 'Email is required').not().isEmpty(),
   check('password', 'Password is required').not().isEmpty(),
]

exports.updateprofile = [
   check('name', 'Name is required').not().isEmpty(),
]


exports.otp_sendmail = [
   check('email', 'Email is required').isEmail().withMessage('Must be a valid email'),
]


exports.verifymail = [
   check('email', 'Email is required').isEmail().withMessage('Must be a valid email'),
   check('otp', 'verification code is required').not().isEmpty(),
   check('otp', 'verification code must be exactly 6 digits long').isLength({ min: 6, max: 6 }),
]



exports.support = [
   check('name', 'Name is required').not().isEmpty(),
   check('email', 'Email is required').not().isEmpty(),
   check('phone', 'Mobile_no is required').not().isEmpty(),
   check('subject', 'Subject is required').not().isEmpty(),
   check('message', 'Message is required').not().isEmpty(),
]

exports.feedback = [
  check("name", "Name is required").not().isEmpty(),
  check("designation", "Designation is required").not().isEmpty(),
  check("message", "Message is required").not().isEmpty(),
];
exports.update_support = [
   check('id', 'Id is required').not().isEmpty(),
   check('status', 'Status is required').not().isEmpty(),
]


exports.Del = [
   check('id', 'Id is required').not().isEmpty(),
]
exports.pagnation = [
   check('page', 'page is required').not().isEmpty(),
   check('limit', 'limit is required').not().isEmpty(),
]
exports.status = [
   check('id', 'id is required').not().isEmpty(),
   check('status', 'status is required').not().isEmpty(),
]

exports.add_language = [
   check('name', 'name is required').not().isEmpty(),
]


exports.add_report = [
   check('r_user_id', 'Reported User Id is required').not().isEmpty(),
]

exports.newvisa = [
   check('going_from', 'Going from is required').not().isEmpty(),
   check('going_to', 'Going to is required').not().isEmpty(),
   check('entry', 'Entry is required').not().isEmpty(),
   check('validity', 'Validity is required').not().isEmpty(),
   check('duration', 'Duration is required').not().isEmpty(),
   check('documents', 'Documents is required').not().isEmpty(),
   check('processing_time', 'Processing time is required').not().isEmpty(),
   check('amount', 'Amount is required').not().isEmpty(),
]


exports.searchvisa = [
   check('going_from', 'Going from is required').not().isEmpty(),
   check('going_to', 'Going to is required').not().isEmpty()
]

exports.newoktb = [
   check('user_id', 'User id is required').not().isEmpty(),
   check('country', 'Country to is required').not().isEmpty(),
   check('name', 'Name is required').not().isEmpty(),
   check('pnr', 'Pnr is required').not().isEmpty(),
   check('dob', 'Dob is required').not().isEmpty(),
   check('airlines', 'Airlines is required').not().isEmpty(),
   check('amount', 'Amount is required').not().isEmpty(),
   check('otb_type', 'OTB type is required').not().isEmpty(),
]

exports.update_wallet = [
   check('id', 'Id is required').not().isEmpty(),
   check('amount', 'Status is required').not().isEmpty(),
]