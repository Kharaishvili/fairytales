export async function generateStoryFromOpenAI(spec: {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  tone: string;
  length: string;
  age: string;
  moral: string;
}) {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenAI API key.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      instructions:
        "You are a professional children's storyteller. Write magical, safe, and engaging fairy tales.",
      input: `Write a ${spec.length} fairytale for a ${spec.age} year old. Characters: ${spec.mainCharacter} and ${spec.sidekick}. Setting: ${spec.setting}. Tone: ${spec.tone}. Moral: ${spec.moral}.`,
      max_output_tokens: 7000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText);
  }

  const data = await response.json();

  const text = data.output?.[0]?.content?.[0]?.text;

  if (!text) {
    throw new Error("No story returned.");
  }

  return text;
}
