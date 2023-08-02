import { Application } from "express";
import "express-async-errors";
import multer from "multer";
import { detectText } from "./services/ocr";
import { convertToSpeech } from "./services/tts";

const upload = multer({ storage: multer.memoryStorage() });

export const registerRoutes = (app: Application) => {
  app.post("/", upload.single("image"), async (req, res) => {
    const image = req.file?.buffer;
    if (!image) {
      res.sendStatus(400).json({ error: "Missing image" });
      return;
    }
    // TODO: Validate image?

    const text = await detectText(image);
    const audio = await convertToSpeech(text);

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-disposition": "attachment;filename=audio.mp3",
      "Content-Length": audio.length,
    });
    res.end(audio);
  });
};
