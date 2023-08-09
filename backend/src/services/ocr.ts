import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  apiEndpoint: "us-vision.googleapis.com",
});

export const detectText = async (
  image: Buffer,
  confidenceThreshold: number
): Promise<string> => {
  const [result] = await client.documentTextDetection(image);
  const text = result.fullTextAnnotation?.pages?.[0].blocks
    ?.filter(
      (b) => b.blockType === "TEXT" && (b.confidence ?? 0) > confidenceThreshold
    )
    .map((b) =>
      b.paragraphs
        ?.map((p) =>
          p.words
            ?.map((w) => w?.symbols?.map((s) => s.text).join(""))
            .join(" ")
            .replace(/ ([^a-zA-Z0-9])/g, "$1")
        )
        .join("\n")
    )
    .join("\n");
  if (!text) {
    throw new Error("No text detected");
  }
  return text;
};
