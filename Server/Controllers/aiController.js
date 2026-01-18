

import { GoogleGenAI } from "@google/genai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from "form-data";
import fs from 'fs';
// import pdf from 'pdf-parse/lib/pdf-parse.js'
// import pdf from "pdf-parse";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");


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

    if (plan !== "premium" && free_usage >= 30) {
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













export const generateBlogTitle = async (req, res) => {
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

    if (plan !== "premium" && free_usage >= 30) {
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
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
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
      content: String(content),
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};









//image 

export const generateImage = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER REACHED");
    console.log("BODY:", req.body);

    const { prompt,publish } = req.body;
    const { userId, plan, free_usage } = req;
    console.log("UserId:", userId, "Plan:", plan, "Free Usage:", free_usage);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (plan !== "premium" && free_usage >= 30) {
      return res.json({
        success: false,
        message: "Free usage limit reached",
      });
    }

    // // ✅ USE gemini-pro (STABLE)
    // const result = await genAI.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: prompt
    // });
    // console.log("Result:", result.candidates[0].content?.parts?.[0].text);
    // // console.log("Result2:",result.text());
    // // const result = await model.generateContent(prompt);
    // const content = result.candidates[0].content?.parts?.[0].text || "No content generated";


    // send prompt as JSON (Clipdrop accepts JSON for text-to-image) and ensure axios can handle large binary responses
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
 
    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
    const {secure_url} = await cloudinary.uploader.upload(base64Image)



    await sql `
      INSERT INTO creations (user_id, prompt, content, type , publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image' , ${publish ?? false})
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
      content : secure_url,
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












export const removeImageBackground = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER REACHED");
    console.log("BODY:", req.body);

    
    const { image } = req.file;
    const { userId, plan, free_usage } = req;
    console.log("UserId:", userId, "Plan:", plan, "Free Usage:", free_usage);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "Feature is only for premium users",
      });
    }


    const {secure_url} = await cloudinary.uploader.upload(image.path, {
      transformation: [{
        effect: 'background_removal',
        background_removal: 'remove_the_background'

      }]
    })



    await sql `
      INSERT INTO creations (user_id, prompt, content, type )
      VALUES (${userId}, 'Remove bg from image'  , ${secure_url}, 'image' )
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
      content : secure_url,
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








    
export const removeImageObject = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER REACHED");
    console.log("BODY:", req.body);

    const { object } = req.body;
    const { image } = req.file;
    const { userId, plan, free_usage } = req;
    console.log("UserId:", userId, "Plan:", plan, "Free Usage:", free_usage);

   

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "Feature is only for premium users",
      });
    }


    const {public_id} = await cloudinary.uploader.upload(image.path)

    const imageUrl = cloudinary.url(public_id,{
      transformation: [{
        effect: `gen_remove: ${object}`
      }],
      resource_type: 'image'
    })



    await sql `
      INSERT INTO creations (user_id, prompt, content, type )
      VALUES (${userId}, ${` Removed ${object} from image`}  , ${imageUrl}, 'image' )
    `;

    // if (plan !== "premium") {
    //   await clerkClient.users.updateUserMetadata(userId, {
    //     privateMetadata: {
    //       free_usage: free_usage + 1,
    //     },
    //   });
    // }

    res.json({
      success: true,
      content : imageUrl
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};









// RESUME REVIEW   4:50:40

    
export const resumeReview = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER REACHED");
    console.log("BODY:", req.body);

    
    const resume = req.file;
    const { userId, plan, free_usage } = req;
    console.log("UserId:", userId, "Plan:", plan, "Free Usage:", free_usage);

   

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "Feature is only for premium users",
      });
    }


    if(resume.size > 5 * 1024 *1024){
      return res.json({
        success: false ,
        message: "File size exceeds 5MB limit"
      })
    }
    
    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)

    const prompt = `Review my resume and suggest improvements . Here is the content : \n\n${pdfData.text}`



    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    console.log("Result:", result.candidates[0].content?.parts?.[0].text);
    // console.log("Result2:",result.text());
    // const result = await model.generateContent(prompt);
    const content = result.candidates[0].content?.parts?.[0].text || "No content generated";




    await sql `
      INSERT INTO creations (user_id, prompt, content, type )
      VALUES (${userId}, 'Review my uploaded resume' , ${content}, 'Resume_review' )
    `;


    res.json({
      success: true,
      content 
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//4:59:20 tkk h yha then aiRoutes.js