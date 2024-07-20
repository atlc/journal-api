import dotenv from "dotenv";
dotenv.config();

interface ConfigObject {
    [key: string]: string | undefined;
}

const jwt = {
    access_key: process.env.JWT_ACCESS_SECRET as string,
    refresh_key: process.env.JWT_REFRESH_SECRET as string,
    access_expiration: process.env.JWT_ACCESS_EXPIRATION as string,
    refresh_expiration: process.env.JWT_REFRESH_EXPIRATION as string,
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
