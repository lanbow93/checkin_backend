"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const user_1 = __importDefault(require("../models/user"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
dotenv_1.default.config();
const router = express_1.default.Router();
const SECRET = process.env.SECRET || "";
router.get("/", async (request, response) => {
    console.log(request.body);
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    });
});
router.post("/signup", async (request, response) => {
    try {
        request.body.name = request.body.name.toLowerCase().replace(/(?:^|\s|')\w/g, (m) => m.toUpperCase());
        request.body.password = await bcryptjs_1.default.hash(request.body.password, await bcryptjs_1.default.genSalt(10));
        const userObject = {
            username: request.body.username.toLowerCase(),
            password: request.body.password,
            email: request.body.email.toLowerCase(),
            resetToken: "",
            resetTokenExpiry: new Date()
        };
        const user = await user_1.default.create(userObject);
        const userAccountDetails = {
            name: request.body.name,
            badgeName: request.body.badgeName,
            email: request.body.email.toLowerCase(),
            groupNames: [],
            currentTask: ["Contact Manager To Be Added To Group", "System"],
            adminOf: [],
            isSiteAdmin: false,
            isGroupAdmin: false,
            isScheduleAdmin: false
        };
        const newUserAccount = await userAccount_1.default.create(userAccountDetails);
        response.status(200).json({ message: "User Created", data: { user: user, accountData: newUserAccount } });
    }
    catch (error) {
        response.status(400).json({
            message: "User Creation Failed",
            data: error
        });
    }
});
router.post("/login", async (request, response) => {
    try {
        request.body.username = request.body.username.toLowerCase();
        const { username, password } = request.body;
        const user = await user_1.default.findOne({ username });
        if (user) {
            const passwordCheck = await bcryptjs_1.default.compare(password, user.password);
            if (passwordCheck) {
                const payload = { username };
                const token = await jsonwebtoken_1.default.sign(payload, SECRET);
                response.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: request.hostname === "localhost" ? false : true
                }).json({ payload, status: "logged in" });
            }
            else {
                response.status(400).json({
                    message: "Username/Password is incorrect",
                    status: "Failed Pass Check"
                });
            }
        }
        else {
            response.status(400).json({
                message: "Username/Password is incorrect",
                status: "Failed User Check"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            message: "Failed to Login",
            data: error
        });
    }
});
router.post("/forgotpassword", async (request, response) => {
    try {
        request.body.email = request.body.email.toLowerCase();
        const user = await user_1.default.findOne({ email: request.body.email });
        if (user) {
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY || "");
            const msg = {
                to: request.body.email,
                from: "speedycheckin.automated@gmail.com",
                subject: "Speedy CheckIn Password Reset",
                text: "Password Reset Email",
                html: `<table class="m_nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffcb00"><tbody><tr><td><table class="m_row m_row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><table class="m_row-content m_stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fed149;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="m_column m_column-1" width="100%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="m_text_block m_block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="word-break:break-word"><tbody><tr><td class="m_pad"><div style="font-family:sans-serif"><div style="font-size:14px;font-family:Tahoma,Verdana,Segoe,sans-serif;color:#555;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center"><strong><span style="font-size:30px">Speedy Check-In Password Reset</span></strong>
                </p></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table class="m_row m_row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fed149"><tbody><tr><td><table class="m_row-content m_stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="m_column m_column-1" width="100%" style="font-weight:400;text-align:left;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="m_image_block m_block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tbody><tr><td class="m_pad" style="width:100%"><div class="m_alignment" align="center" style="line-height:10px"><img src="https://ci4.googleusercontent.com/proxy/XW7Tekh8vLrqtlb4tmWE8pxGu5s2-EzeB9gmYgUB4MOwZeTYnnCFZtW2Twxa0jNN6JLmq8or4G7e_vt5X4kefVfdJjM8D64ikCMrLR_5hepvWaahxdP_elTq9_OrtkIjhZ26bPus3pwLseE8jjH-hmsaYzXtaDGdUmBUawvL61aU6TKER1pwIHufNtEcNOoU9QOC1N-VG2ZZHo9iponrULGuijCWG6Wn0YLcyT8lQcxjKceyoQ83QOjfXGRnaFeLd4kVd8qAn9yzHuL4-v9L79Xc66VojOM47aZnPGD4DuesdBw_=s0-d-e1-ft#https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/Email%20Templates%20Assets%20Folder/PRTS01/promotion_tech_banner_01.jpg" style="display:block;height:auto;border:0;max-width:600px;width:100%" width="600" alt="Alternate text" title="Alternate text"></div></td></tr></tbody></table><table class="m_text_block m_block-2" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="word-break:break-word"><tbody><tr><td class="m_pad"><div style="font-family:sans-serif"><div style="font-size:12px;font-family:Tahoma,Verdana,Segoe,sans-serif;color:#555;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center">
                <strong><span style="font-size:30px">FORGOT</span></strong><br><strong><span style="font-size:30px">YOUR PASSWORD?</span></strong></p></div></div></td></tr></tbody></table><table class="m_text_block m_block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="word-break:break-word"><tbody><tr><td class="m_pad" style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:10px"><div style="font-family:sans-serif"><div style="font-size:12px;font-family:Tahoma,Verdana,Segoe,sans-serif;color:#555;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center"><span style="font-size:16px">Not to worry, we got you! Let’s get you a new password.</span></p></div></div></td></tr></tbody></table><table class="m_button_block m_block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                <tbody><tr><td class="m_pad"><div class="m_alignment" align="center">
                <a style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3aaee0;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;text-align:center;word-break:keep-all" rel="noreferrer" target="_blank" href="http:/localhost:7777/user"><span style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;letter-spacing:normal"><span style="word-break:break-word;line-height:28px">RESET PASSWORD</span></span></a>
                </div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table class="m_row m_row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><table class="m_row-content m_stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fed149;border-radius:0;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="m_column m_column-1" width="100%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="m_divider_block m_block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation"><tbody><tr><td class="m_pad"><div class="m_alignment" align="center"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td class="m_divider_inner" style="font-size:1px;line-height:1px;border-top:1px solid #bbb"><span>&hairsp;</span></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>`
            };
            await mail_1.default.send(msg);
            response.status(200).json({
                message: "Successfully found email and email sent",
                data: user
            });
        }
        else {
            response.status(200).json({
                message: "Email Does Not Exist",
                status: "Email Check Failed"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            message: "Email Does Not Exist",
            data: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map