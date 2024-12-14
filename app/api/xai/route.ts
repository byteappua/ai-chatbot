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

  //  let client = aiClient.get(provide);

  //   const { prompt } = await request.json(); // 从请求中获取 prompt
  //   if (request) {
  //     return NextResponse.json("hel");
  //   }
  //   console.log("prompt", prompt);
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + apikey, // 替换为你的 OpenAI API 密钥
    },
    body: JSON.stringify({
      model: "grok-beta", // 或者使用其他模型
      // messages: [{ role: "user", content: prompt }],
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
      stream: true, // 启用流式响应
    }),
  });

  if (!response.ok) {
    return NextResponse.error();
  }

  const stream = response.body;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Transfer-Encoding": "chunked",
    },
  });
}
