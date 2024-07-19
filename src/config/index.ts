import dotenv from "dotenv";
dotenv.config();

interface ConfigObject {
    [key: string]: string | undefined;
}

const jwt = {
    key: process.env.JWT_SECRET as string,
    expiration: process.env.JWT_EXPIRATION as string,
};

const mongo = {
    url: process.env.MONGO_URL as string,
};

function validateConfigObject(confObject: ConfigObject, name: string) {
    Object.entries(confObject).forEach(([key, val]) => {
        if (typeof val === "undefined") {
            console.log(`\n\n\nERROR: Environment variable in ${name} object has missing value for ${key}\n\n\n`);
            throw new Error(`Missing environment variables for ${name} object`);
        }
    });
}

validateConfigObject(jwt, "jwt");
validateConfigObject(mongo, "mongo");

export default {
    jwt,
    mongo,
};
