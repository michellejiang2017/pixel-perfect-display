type EmbeddingPipeline = (
  inputs: string | string[],
  options?: { pooling?: "mean"; normalize?: boolean },
) => Promise<{ tolist: () => unknown }>;

let extractorPromise: Promise<EmbeddingPipeline> | null = null;
const embeddingCache = new Map<string, number[]>();

async function getExtractor(): Promise<EmbeddingPipeline> {
  if (!extractorPromise) {
    extractorPromise = import("@huggingface/transformers").then(async ({ pipeline }) => {
      const extractor = await pipeline(
        "feature-extraction",
        "onnx-community/all-MiniLM-L6-v2-ONNX",
      );

      return extractor as unknown as EmbeddingPipeline;
    });
  }

  return extractorPromise;
}

function parseVectors(value: unknown): number[][] {
  if (!Array.isArray(value)) {
    throw new Error("Unexpected embedding output.");
  }

  if (value.length === 0) {
    return [];
  }

  if (Array.isArray(value[0])) {
    return value.map((row) => {
      if (!Array.isArray(row)) {
        throw new Error("Unexpected embedding row.");
      }

      return row.map((item) => Number(item));
    });
  }

  return [value.map((item) => Number(item))];
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const normalizedTexts = texts.map((text) => text.trim()).filter(Boolean);
  const missingTexts = [...new Set(normalizedTexts.filter((text) => !embeddingCache.has(text)))];

  if (missingTexts.length > 0) {
    const extractor = await getExtractor();
    const result = await extractor(missingTexts, {
      pooling: "mean",
      normalize: true,
    });
    const vectors = parseVectors(result.tolist());

    if (vectors.length !== missingTexts.length) {
      throw new Error("Embedding count did not match input count.");
    }

    missingTexts.forEach((text, index) => {
      const vector = vectors[index];

      if (!vector) {
        throw new Error("Embedding was missing for an input.");
      }

      embeddingCache.set(text, vector);
    });
  }

  return normalizedTexts.map((text) => {
    const vector = embeddingCache.get(text);

    if (!vector) {
      throw new Error("Embedding was not cached.");
    }

    return vector;
  });
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || left.length === 0) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;

    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}
