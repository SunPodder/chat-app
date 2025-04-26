import express from "express";
import * as messages from "./messages";
import register from "./register";
import login from "./login";
import logout from "./logout";
import contacts from "./contacts";
import * as conversations from "./conversations";
import user from "./user";
import * as me from "./me";
import { Users } from "../schema";
import multer from "multer";

const storage = multer.diskStorage({
	destination: function (_, __, cb) {
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
router.get("/users/:user_id", (req, res) => user(req, res, Users.id));
router.get("/me", me.get);
router.post("/profile/edit", upload.single("avatar"), me.edit);
router.get("/contacts", contacts);
router.get("/conversations", conversations.list);
router.get("/conversations/:buddy_id", conversations.get);

router.get("/messages/:buddy_id", messages.get);

export default router;
