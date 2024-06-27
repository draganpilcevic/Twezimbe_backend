import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import GroupModel from '../model/group.model';
import RoleModel from '../model/role.model';
import UserGroupModel from '../model/user_group';
import RoleUserModel from '../model/user_role';
import { ValidateToken } from "../utils/password.utils";
export const addGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const existingGroup = await GroupModel.findOne({ name: req.body.name });
    if (existingGroup) {
        return res.status(400).json({ message: "Group already exists" });
    };

    const newGroup = await GroupModel.create(req.body);

    if (newGroup) {
        const Role = await RoleModel.findOne({ role_name: "GroupManager"})
    
        await UserGroupModel.create({
            user_id: req?.body?.created_by,
            group_id: newGroup?._id,
            role_id: Role?.id
        })

        await RoleUserModel.create({
            user_id: req?.body?.created_by,
            role_id: Role?.id
        })
        
        res.status(201).json({ message: "newRole added successfully", group: newGroup });
    };

});


export const getGroupList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const groupList = await GroupModel.find({ del_flag: 0 })
    
    res.status(201).json({ message: "successfully", groupList: groupList });

});

export const getJoinedGroupList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const { userId } = req.query
    
    if (userId) {
        try {

            if (typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid userId: must be a valid ObjectId string');
            }

            const result = await UserGroupModel.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'roles', // collection name in MongoDB (should match the name in your MongoDB)
                        localField: 'role_id',
                        foreignField: '_id',
                        as: 'roleDetails'
                    }
                },
                {
                    $unwind: '$roleDetails'
                },
                {
                    $project: {
                        group_id: 1,
                        role_name: '$roleDetails.role_name'
                    }
                }
            ]);
            res.status(201).json({ message: "successfully", joinedGroupList: result });
            
        } catch (err) {
            throw err;
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
    

});


export const groupUpdate = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const deleteGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});