import { ObjectId } from "mongodb";
import { BaseEntry, Entry } from "../../types";
import { client } from "../connection";

const journals = client.db().collection<BaseEntry>("journals");

const create = (newJournal: BaseEntry) => journals.insertOne({ ...newJournal, created_at: new Date().toISOString() });
const profile = (user_id: string) => journals.find({ user_id }).toArray();

export default {
    create,
    profile,
};
