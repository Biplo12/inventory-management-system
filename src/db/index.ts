import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { Database } from "src/interfaces/Database";

const DEFAULT_DB_DATA: Database = {
  orders: [],
  products: [],
};

const DB_FILE = path.join(__dirname, "db.json");
const adapter = new JSONFile<Database>(DB_FILE);

const db = new Low<Database>(adapter, DEFAULT_DB_DATA);

export default db;
