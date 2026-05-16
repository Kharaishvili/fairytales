type StorySpec = {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  tone: string;
  length: string;
  age: string;
  moral: string;
};

type ResponsePayload = Record<string, unknown>;

export type JudgeDecision = {
  approved: boolean;
  score: number;
  reason: string;
  issues: string[];
};

export type GeneratedStoryResult = {
  story: string;
  judge: JudgeDecision;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readProviderError(errText: string) {
  try {
    const parsed = JSON.parse(errText);
    const message = parsed?.error?.message;
    return typeof message === "string" ? message : errText;
  } catch {
    return errText;
  }
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

async function createResponse(
  apiKey: string,
  payload: ResponsePayload,
  label: string,
) {
  let lastError = "";
  let lastStatus = 0;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response.json();
    }

    const errText = await response.text();
    lastStatus = response.status;
    lastError = readProviderError(errText);

    if (!isRetryableStatus(response.status) || attempt === 2) {
      break;
    }

    await wait(500 * (attempt + 1));
  }

  if (isRetryableStatus(lastStatus)) {
    throw new Error(
      `${label} is temporarily unavailable. Please try again in a moment.`,
    );
  }

  throw new Error(`${label} failed. ${lastError}`);
}

function extractResponseText(data: any): string | null {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const text = data.output?.[0]?.content?.[0]?.text;
  return typeof text === "string" ? text : null;
}

function parseJudgeDecision(text: string): JudgeDecision {
  const jsonText =
    text.match(/```json\s*([\s\S]*?)```/)?.[1] ??
    text.match(/\{[\s\S]*\}/)?.[0] ??
    text;

  const parsed = JSON.parse(jsonText);

  return {
    approved: Boolean(parsed.approved),
    score: Number(parsed.score ?? 0),
    reason:
      typeof parsed.reason === "string"
        ? parsed.reason
        : "The story did not pass review.",
    issues: Array.isArray(parsed.issues)
      ? parsed.issues.filter((issue: unknown) => typeof issue === "string")
      : [],
  };
}

function formatJudgeFailure(decision: JudgeDecision) {
  const issues = decision.issues.length
    ? ` Issues: ${decision.issues.join("; ")}`
    : "";

  return `Story did not pass the quality review. ${decision.reason}${issues}`;
}

async function judgeStoryWithOpenAI(
  apiKey: string,
  spec: StorySpec,
  story: string,
): Promise<JudgeDecision> {
  const systemPrompt = `You are a strict, professional children's content safety and quality judge.
You evaluate fairytales before they are shown to children and parents.

Return ONLY valid JSON matching the provided schema.`;

  const userPrompt = `Evaluate this generated fairytale against the requested specifications.

**Requested Specifications:**
- Main character: ${spec.mainCharacter}
- Sidekick: ${spec.sidekick}
- Setting: ${spec.setting}
- Tone: ${spec.tone}
- Length: ${spec.length}
- Target age: ${spec.age}
- Moral/lesson: ${spec.moral}

**Generated Story:**
"""
${story}
"""

**Evaluation Steps (think carefully):**
1. Does the story fully include the requested characters, setting, tone, length, and moral?
2. Is it completely safe and age-appropriate (no violence, fear, romance, scary themes, etc.)?
3. Is the story coherent, engaging, and well-structured?
4. Any other quality or safety issues?

First think step-by-step about each point above.
Then output only the JSON.`;

  const data = await createResponse(
    apiKey,
    {
      model: "gpt-4o",
      instructions: systemPrompt,
      input: userPrompt,
      max_output_tokens: 700,
      temperature: 0.0,
      text: {
        format: {
          type: "json_schema",
          name: "story_quality_judge",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              approved: { type: "boolean" },
              score: {
                type: "number",
                description:
                  "Score from 1 (unusable/dangerous) to 5 (excellent)",
              },
              reason: {
                type: "string",
                description:
                  "Short paragraph (2-3 sentences max) explaining the score",
              },
              issues: {
                type: "array",
                items: { type: "string" },
                description: "Specific issues found. Empty array if none.",
              },
            },
            required: ["approved", "score", "reason", "issues"],
          },
        },
      },
    },
    "Story review",
  );

  const text = extractResponseText(data);
  if (!text) throw new Error("Story review failed: no result returned.");

  try {
    return parseJudgeDecision(text);
  } catch (e) {
    throw new Error("Story review failed: invalid JSON from judge.");
  }
}

export async function generateStoryFromOpenAI(
  spec: StorySpec,
): Promise<GeneratedStoryResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenAI API key.");
  }

  const data = await createResponse(
    apiKey,
    {
      model: "gpt-4o-mini",
      instructions:
        "You are a professional children's storyteller. Write magical, safe, and engaging fairy tales.",
      input: `Write a ${spec.length} fairytale for a ${spec.age} year old. Characters: ${spec.mainCharacter} and ${spec.sidekick}. Setting: ${spec.setting}. Tone: ${spec.tone}. Moral lesson: ${spec.moral}. End clearly with that moral lesson.`,
      max_output_tokens: 7000,
    },
    "Story generation",
  );

  const text = extractResponseText(data);

  if (!text) {
    throw new Error("No story returned.");
  }

  const judgeDecision = await judgeStoryWithOpenAI(apiKey, spec, text);

  if (!judgeDecision.approved || judgeDecision.score < 4) {
    throw new Error(formatJudgeFailure(judgeDecision));
  }

  return {
    story: text,
    judge: judgeDecision,
  };
}
