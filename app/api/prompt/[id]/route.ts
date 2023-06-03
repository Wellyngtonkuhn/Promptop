import { connectToDB } from "@utils/database";
import Prompt from "@models/promp";
import { NextApiRequest } from "next";

type ParamsProps = {
  params: {
    id: string;
  };
};

export const GET = async (request: NextApiRequest, { params }: ParamsProps) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt not found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};

export const PATCH = async (request: any, { params }: ParamsProps) => {
  const { prompt, tag } = await request.json();
  try {
    await connectToDB();

    const existigPrompt = await Prompt.findById(params.id);
    if (!existigPrompt)
      return new Response("Prompt not found", { status: 404 });

    existigPrompt.prompt = prompt;
    existigPrompt.tag = tag;
    await existigPrompt.save();

    return new Response(JSON.stringify(existigPrompt), { status: 200 });
  } catch (error) {
    return new Response("Failed update to prompt", { status: 500 });
  }
};

export const DELETE = async (
  request: NextApiRequest,
  { params }: ParamsProps
) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndRemove(params.id);

    return new Response("Prompt deleted", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete", { status: 500 });
  }
};
