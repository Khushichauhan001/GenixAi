import { clerkClient } from "@clerk/express";

export const attachPlanInfo = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await clerkClient.users.getUser(userId);

    req.plan = user.publicMetadata?.plan || "free";
    req.free_usage = user.privateMetadata?.free_usage || 0;

    next();
  } catch (err) {
    console.error("PLAN FETCH ERROR:", err);
    res.status(401).json({ success: false, message: "Auth failed" });
  }
};
