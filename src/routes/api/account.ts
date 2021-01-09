import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import { checkRole } from "../../middleware/checkRole";
import bcrypt from "bcryptjs";
import config from "config";
import auth from "../../middleware/auth";
import Account, { IAccount } from "../../models/Account";
import Request from "../../types/Request";
import { IUser } from "../../models/User";
import User from "../../models/User";
import gravatar from "gravatar";
import generatePassword from "password-generator";
import sgMailSender from "../../utils/mailer";

const router: Router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
// router.get("/me", auth, async (req: Request, res: Response) => {
//   try {
//     const profile: IProfile = await Profile.findOne({
//       user: req.userId,
//     }).populate("user", ["avatar", "email"]);
//     if (!profile) {
//       return res.status(HttpStatusCodes.BAD_REQUEST).json({
//         errors: [
//           {
//             msg: "There is no profile for this user",
//           },
//         ],
//       });
//     }

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/", auth, checkRole(["SUPER_ADMIN"]),
  [
    auth,
    check("companyName", "Company Name is required").not().isEmpty(),
    check("adminName", "Admin Name is required").not().isEmpty(),
    check("adminEmail", "Admin Email is required").not().isEmpty(),
    check("adminContactNo", "Admin Contact Number is required").not().isEmpty(),
    check("features", "At least one feature should be selected is required").not().isEmpty(),

  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { companyName, adminName, adminEmail, adminContactNo, features } = req.body;

    // Build profile object based on IProfile
    const accountFields = {
      user: req.userId,
      companyName,
      adminName,
      adminEmail,
      adminContactNo,
      features,
      status: true,
      createdBy: req.userId
    };

    try {
      
      let account: IAccount = await Account.findOne({ adminEmail });
      let user: IUser = await User.findOne({ email: adminEmail });

      if (account || user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Account already exists"
            }
          ]
        });
      }

      account = new Account(accountFields);

      await account.save();

      const options: gravatar.Options = {
        s: "200",
        r: "pg",
        d: "mm"
      };


      const avatar = gravatar.url(adminEmail, options);
      const password = generatePassword(9, false);

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Build user object based on IUser
      const userFields = {
        email: adminEmail,
        password: hashed,
        avatar,
        account: account._id,
        role: config.get("ROLES.ADMIN")
      };


      user = new User(userFields);

      console.log(user);

      await user.save();

      

      const mail = {
        name: adminName,
        email: adminEmail,
        password: password,
        link: "http://localhost:3000/",
        templateId: config.get('mailer.templates.welcome_admin'),
        subject: 'Welcome to Scion Portal'
      }

      await sgMailSender(mail);

      res.status(HttpStatusCodes.CREATED).json(account);

    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   GET api/account
// @desc    Get all accounts
// @access  Public
router.get("/", auth, checkRole(["SUPER_ADMIN"]), async (_req: Request, res: Response) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/account/:accountId
// @desc    Get account by accountId
// @access  Public
router.get("/:accountId", auth, checkRole(["USER", "SUPER_USER"]) , async (req: Request, res: Response) => {
  try {
    const account: IAccount = await Account.findOne({
      _id: req.params.accountId,
    });

    if (!account)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });

    res.json(account);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Account not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
// router.delete("/", auth, async (req: Request, res: Response) => {
//   try {
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.userId });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.userId });

//     res.json({ msg: "User removed" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

export default router;
