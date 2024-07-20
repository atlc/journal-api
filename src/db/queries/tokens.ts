import { User } from "../../types";
import { client } from "../connection";

interface TokenPair {
    token: string;
    user_id: User["_id"];
}

const tokens = client.db().collection<TokenPair>("tokens");

const add = async (pair: TokenPair) => {
    await tokens.deleteMany({ user_id: pair.user_id });
    return tokens.insertOne(pair);
};

const get = (token: TokenPair["token"]) => tokens.findOne({ token });

const logout = (user_id: TokenPair["user_id"]) => tokens.deleteMany({ user_id });

export default {
    add,
    get,
    logout,
};
