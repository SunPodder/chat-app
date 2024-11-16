import express from "express";
import * as messages from "./routes/messages";
import register from "./routes/register";
import login from "./routes/login";
import logout from "./routes/logout";
import contacts from "./routes/contacts";
import conversations from "./routes/conversations";
import user from "./routes/user";
import * as me from "./routes/me";
import { Users } from "./schema";
import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop();
		cb(null, `${req.user.id}.${ext}`);
	},
});

const upload = multer({ storage });

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/@:username", (req, res) => user(req, res, Users.username));
router.get("/users/:id", (req, res) => user(req, res, Users.id));
router.get("/me", me.get);
router.post("/profile/edit", upload.single("avatar"), me.edit);
router.get("/contacts", contacts);
router.get("/conversations", conversations);

router.get("/messages/:id", messages.get);

export default router;
