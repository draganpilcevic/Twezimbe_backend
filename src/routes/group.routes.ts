import express from "express";
import { addGroup, getGroupList, getJoinedGroupList } from "../controller/group.controllers";
const roleRouter = express.Router();

roleRouter.post('/add', addGroup);
roleRouter.get('/list', getGroupList);
roleRouter.get('/findByUserId', getJoinedGroupList);
// roleRouter.put('/update', roleUpdate);

export default roleRouter;