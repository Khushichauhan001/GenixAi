


// import { clerkClient } from "@clerk/express";

// export const auth = async (req, res, next) => {
//   try {
//     const { userId, has } = req.auth;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const hasPremiumPlan = await has({ plan: "premium" });
//     const user = await clerkClient.users.getUser(userId);

//     // ✅ FIX 5 HERE
//     req.free_usage = user.privateMetadata?.free_usage ?? 0;

//     req.plan = hasPremiumPlan ? "premium" : "free";
//     req.userId = userId;

//     next();
//   } catch (error) {
//     console.error("AUTH ERROR:", error);
//     res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };










// ...existing code...
import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    console.log("AUTH MIDDLEWARE REACHED");
    const { userId, has } = req.auth || {};
      console.log("AUTH MIDDLEWARE - userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // fetch user metadata from Clerk
    const user = await clerkClient.users.getUser(userId);
    console.log("User:", user);

    // determine free usage (ensure numeric)
    const free_usage = Number(user.privateMetadata?.free_usage ?? 0);

    // determine plan; `has` may be undefined depending on integration
    const hasPremiumPlan =
      typeof has === "function" ? await has({ plan: "premium" }) : false;

    req.userId = userId;
    req.plan = hasPremiumPlan ? "premium" : "free";
    req.free_usage = free_usage;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
//