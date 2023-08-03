import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  apiEndpoint: "us-vision.googleapis.com",
});

export const detectText = async (image: Buffer): Promise<string> => {
  const [result] = await client.textDetection(image);
  const detections = result.textAnnotations;
  const text = detections?.[0]?.description;
  if (!text) {
    throw new Error("No text detected");
  }
  return text;
};
