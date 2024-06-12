import express from 'express'
import {verifyToken} from '../middlewares/verifyTokens.js'
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller.js'


const router = express.Router()

router.get("/",getUsers)

router.get("/:id",verifyToken,getUser)

router.put("/:id",verifyToken,updateUser)

router.delete("/:id",verifyToken,deleteUser)

export default router