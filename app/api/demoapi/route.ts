// app/api/stream-from-external/route.js
import { NextResponse, NextRequest } from "next/server";

// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function GET() {
  const completion = await openai.chat.completions.create({
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
  });

  console.log(completion.choices[0].message);
  // const response = await fetch(externalStreamUrl);

  // if (!response.ok) {
  //   return NextResponse.error();
  // }

  // const stream = response.body;

  // return new NextResponse(stream, {
  //   headers: {
  //     "Content-Type": response.headers.get("Content-Type"),
  //     "Transfer-Encoding": "chunked",
  //   },
  // });
  return NextResponse.json("hel");
}

export async function POST(request: NextRequest) {
  const { prompt } = await request.json(); // 从请求中获取 prompt
  console.log("prompt", prompt);
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + process.env.XAI_API_KEY, // 替换为你的 OpenAI API 密钥
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
