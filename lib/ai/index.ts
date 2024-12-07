import { openai, createOpenAI } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

export const customModel = (apiIdentifier: string) => {
  const groq = createOpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY,
  });
  return wrapLanguageModel({
    model: groq.languageModel(apiIdentifier),
    middleware: customMiddleware,
  });
};
