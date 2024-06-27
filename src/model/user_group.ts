import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const UserGroupSchema = new Schema({
    user_id: {type: ObjectId,
        ref: 'User'
    },
    group_id: { type: ObjectId,
        ref: 'Group'
    },
    role_id: {type: ObjectId,
        ref: 'Role'
    },

},{
    timestamps: true
});

const UserGroup = model("User_Group", UserGroupSchema);
export default UserGroup;