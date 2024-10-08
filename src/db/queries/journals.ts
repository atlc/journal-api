import { ObjectId } from "mongodb";
import { BaseEntry } from "../../types";
import { client } from "../connection";

const journals = client.db().collection<BaseEntry>("journals");

const create = (newJournal: BaseEntry) => journals.insertOne({ ...newJournal, created_at: new Date().toISOString() });
const profile = (user_id: string) => journals.find({ user_id }).toArray();
const remove = (id: ObjectId, user_id: string) => journals.deleteOne({ _id: id, user_id });
const toggleNote = (id: ObjectId, is_note: BaseEntry["is_note"]) => journals.updateOne({ _id: id }, { $set: { is_note } });

export default {
    create,
    profile,
    remove,
    toggleNote,
};
