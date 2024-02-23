import { Router } from "express";
import { registerUser } from "../Controllers/user.controller.js";

const router= Router()
router.route("/").post(registerUser)


export default router    