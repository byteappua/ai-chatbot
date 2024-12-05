import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});
export const hasDb = () => {
  if (process.env.ENABLE_POSTGRES && process.env.ENABLE_POSTGRES === "false") {
    console.error("ENABLE_POSTGRES is false");
    return false;
  }
  return true;
};
const runMigrate = async () => {
  if (process.env.ENABLE_POSTGRES && process.env.ENABLE_POSTGRES === "false") {
    console.error("ENABLE_POSTGRES is false");
    return;
  }
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
