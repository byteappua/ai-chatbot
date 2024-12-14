// app/api/stream-from-external/route.js
import { NextResponse, NextRequest } from "next/server";

// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
// 创建一个字典
const aiClient = new Map();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  // 获取查询参数
  const provide = url.searchParams.get("p"); // 替换 'paramName' 为你的参数名
  const apikey = url.searchParams.get("apikey"); // 替换 'paramName' 为你的参数名
  if (!apikey) {
    return NextResponse.json("hel");
  }
  //  let client = aiClient.get(provide);

  //   const { prompt } = await request.json(); // 从请求中获取 prompt
  //   if (request) {
  //     return NextResponse.json("hel");
  //   }
  //   console.log("prompt", prompt);
  const client = new OpenAI({
    apiKey: apikey,
    baseURL: "https://api.x.ai/v1",
  });
  const completion = await client.chat.completions.create({
    model: "grok-beta",
    messages: [
      {
        role: "system",
        content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
      },
      {
        role: "user",
        content: "What is the meaning of life, the universe, and everything?",
      },
    ],
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        // const text = chunk.choices[0]?.delta?.content || "";
        const payload = `data: ${JSON.stringify(chunk)}\n\n`;
        controller.enqueue(new TextEncoder().encode(payload));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
