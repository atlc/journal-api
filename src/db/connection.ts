import mongo, { ServerApiVersion } from "mongodb";
import config from "../config";

export const client = new mongo.MongoClient(config.mongo.url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

await client.connect();
