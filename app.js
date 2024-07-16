import dotenv from "dotenv";
import express from "express";
//using fs for storing data 
import bodyParser from "body-parser";
import fs from "fs";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createStream } from "rotating-file-stream";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rate limiting is enabled by default
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
});
app.use(limiter);

// logs and output directories
const logsDir = path.join(__dirname, "logs"); // storing access logs for debugging
const outputDir = path.join(__dirname, "output"); // for writing output files
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir); // check for existing directory
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Morgan is used for logging with rotating file stream for keeping files short.
const accessLogStream = createStream("access.log", {
  interval: "1d", // rotate daily
  path: logsDir,
});
app.use(morgan("combined", { stream: accessLogStream }));

let files = {
  A: [],
  B: [],
  C: [],
  D: [],
};

app.get("/", (req, res) => {
  res.send("Server is up & working!!");
});

app.post("/input", (req, res, next) => {
  try {
    const { number } = req.body;
    if (number < 1 || number > 25) {
      return res
        .status(400)
        .send("Number must be between 1 and 25 and must be a valid number");
    }

    let result = number * 7;
    if (result > 140) {
      files.A.push(result);
    } else if (result > 100) {
      files.B.push(result);
    } else if (result > 60) {
      files.C.push(result);
    } else {
      files.D.push(result);
    }

    if (files.A.length && files.B.length && files.C.length && files.D.length) {
      fs.writeFileSync(path.join(outputDir, "A.json"), JSON.stringify(files.A));
      fs.writeFileSync(path.join(outputDir, "B.json"), JSON.stringify(files.B));
      fs.writeFileSync(path.join(outputDir, "C.json"), JSON.stringify(files.C));
      fs.writeFileSync(path.join(outputDir, "D.json"), JSON.stringify(files.D));
      return res.send("All files are filled. Process is complete.");
    }

    res.send("Number processed and saved.");
  } catch (error) {
    next(error);
  }
});

app.get("/files", (req, res) => {
  res.json(files);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
