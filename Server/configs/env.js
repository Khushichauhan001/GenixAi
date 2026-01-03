import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Required for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Explicit absolute path
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("✅ ENV Loaded:", process.env.DATABASE_URL ? "YES" : "NO");
