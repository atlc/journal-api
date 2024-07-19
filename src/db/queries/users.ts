import { ObjectId } from "mongodb";
import { BaseUser, User } from "../../types";
import { client } from "../connection";

const users = client.db().collection<BaseUser>("users");
users.createIndex({ email: 1 }, { unique: true });

const find = (email: string) => users.findOne<User>({ email });

const register = (newUser: BaseUser) => users.insertOne(newUser);

const verify = (email: string) => users.updateOne({ email }, { $set: { is_verified: true } });

export default {
    find,
    register,
    verify,
};
