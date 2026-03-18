import express from "express";
import { signup,test,login,logout,updateProfile,checkAuth} from "../controllers/authController";

const router =express.Router();

router.get("/test", test)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", updateProfile)
router.get("/checkAuth", checkAuth)


export default router;
