import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV_STRICT;

export const IS_TEST = NODE_ENV === "test";

export const IS_PROD = NODE_ENV === "production";

export const IS_DEV = NODE_ENV === "development";
