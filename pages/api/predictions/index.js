import { NextResponse } from "next/server";
import Replicate from "replicate";
import { validateRequiredFields } from '../../../utils/validation';


async function getObjectFromRequestBodyStream(body) {
  const input = await body.getReader().read();
  const decoder = new TextDecoder();
  const string = decoder.decode(input.value);
  return JSON.parse(string);
}

import { validateRequiredFields } from '../../../utils/validation';

export default async function handler(req) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const input = await getObjectFromRequestBodyStream(req.body);

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
    const err = validateRequiredFields(req.body, ['prompt', 'name', 'description']);
  if (err) {
    return new Response(
      JSON.stringify({ error: err }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }


  let prediction;

  prediction = await replicate.predictions.create({
    version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    input,
  });

  if (prediction?.error) {
    return NextResponse.json({
      status: 500,
      message: prediction.error.message,
    });
  }

  return NextResponse.json(prediction, { status: 201 });
}

export const config = {
  runtime: "edge",
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
