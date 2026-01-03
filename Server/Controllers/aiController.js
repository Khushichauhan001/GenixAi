
// import OpenAI from "openai";
// import sql from "../configs/db.js";
// import { clerkClient } from "@clerk/express";

// const AI = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });
// export const generateArticle = async (req, res) => {
//   console.log("🔥 CONTROLLER ENTERED");

//   try {
//     console.log("🔥 CONTROLLER REACHED");
//     console.log("BODY:", req.body);

//     const userId = req.userId || "test_user";
//     const plan = req.plan || "free";
//     const free_usage = req.free_usage ?? 0;

//     const { prompt, length } = req.body;



//         if(plan !== 'premium' && free_usage >= 10){
//             return res.json({success: false, message: "Limit reached"})
//         }

//         const response = await AI.chat.completions.create({
//     model: "gemini-1.5-flash",
//     messages: [
//         {
//             role: "user",
//             content: prompt,
//         },
//     ],
//     temperature: 0.7,
//     // max_tokens: length ,
//     max_tokens: Number(length) || 300,

// });
// const content = response.choices[0].message.content;
    
// await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
    
// if(plan !== 'premium'){
//     await clerkClient.users.updateUserMetadata(userId, {
//         privateMetadata: {
//             free_usage: free_usage + 1
//         }
//     });
// }

// res.json({success: true, content});

//     }
//     catch (error) {
//   console.error("AI CONTROLLER ERROR:", error);
//   return res.status(400).json({
//     success: false,
//     message: error.message,
//   });
//     }
// }














import { GoogleGenAI } from "@google/genai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const generateArticle = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER REACHED");
    console.log("BODY:", req.body);

    const { prompt } = req.body;
    const { userId, plan, free_usage } = req;
    console.log("UserId:", userId, "Plan:", plan, "Free Usage:", free_usage);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit reached",
      });
    }

    // ✅ USE gemini-pro (STABLE)
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    console.log("Result:", result.candidates[0].content?.parts?.[0].text);
    // console.log("Result2:",result.text());
    // const result = await model.generateContent(prompt);
    const content = result.candidates[0].content?.parts?.[0].text || "No content generated";

    await sql `
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};











// user_37350l1quyxsBwztrbJlKKxNctW