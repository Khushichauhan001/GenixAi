// // 🔥 MUST BE FIRST LINE
// import "./configs/env.js";
// import dotenv from "dotenv";

// import express from "express";
// import cors from "cors";
// import { clerkMiddleware, requireAuth } from "@clerk/express";
// import aiRouter from "./Routes/aiRoutes.js";
// import "./configs/db.js"; // AFTER env

// dotenv.config();
// const app = express();
// app.post("/ping", (req, res) => {
//   console.log("🔥 PING HIT");
//   res.json({ pong: true });
// });
// app.use((req, res, next) => {
//   console.log("➡️ HIT:", req.method, req.url);
//   next();
// });

// app.use(cors());
// app.use(express.json());
// // app.use(clerkMiddleware());

// app.get("/", (req, res) => {
//   res.send("Hello World! Server is working ✅");
// });

// app.use("/api", requireAuth());
// app.use("/api/ai", aiRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




// 🔥 MUST BE FIRST
import "./configs/env.js";

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "./Routes/aiRoutes.js";
import "./configs/db.js"; // AFTER env

const app = express();

// 🔍 logger (optional but useful)
app.use((req, res, next) => {
  console.log("➡️ HIT:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// 🔐 Clerk middleware (enabled now)
app.use(clerkMiddleware());

// ✅ health check
app.get("/", (req, res) => {
  res.send("Hello World! Server is working ✅");
});

// 🔥 AI routes
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
