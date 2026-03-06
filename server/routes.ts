import type { Express } from "express";
import type { Server } from "http";
// import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import express from "express";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
//  app.get(api.analyze.list.path, async (req, res) => {
//    const history = await storage.getAnalyses();
//    res.json(history);
//  });

  // Ensure large image payloads can be parsed
  app.post(api.analyze.create.path, express.json({ limit: "10mb" }), async (req, res) => {
    try {
      const { image } = api.analyze.create.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "You are a professional golf caddie. Analyze this image of a golf green. Identify the slope direction (left, right, up, down, flat), the severity of the slope (mild, moderate, severe), and provide a short advice for the putt line. Return ONLY a JSON object with keys: slopeDirection, slopeSeverity, advice." },
              {
                type: "image_url",
                image_url: {
                  url: image.startsWith("data:image") ? image : `data:image/jpeg;base64,${image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" }
      });

      const resultText = response.choices[0]?.message?.content || "{}";
      const result = JSON.parse(resultText);

//      const analysis = await storage.createAnalysis({
//        imageBase64: image,
//        slopeDirection: result.slopeDirection || "unknown",
//        slopeSeverity: result.slopeSeverity || "unknown",
//        advice: result.advice || "Unable to analyze.",
//      });

//      res.status(200).json(analysis);
      // ★ DBなし → AIの結果をそのまま返す
      res.status(200).json({
        slopeDirection: result.slopeDirection || "unknown",
        slopeSeverity: result.slopeSeverity || "unknown",
        advice: result.advice || "Unable to analyze.",
      })

    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  return httpServer;
}
