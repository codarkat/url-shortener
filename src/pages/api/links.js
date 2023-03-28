import fs from "fs";
import path from "path";

const linksFilePath = path.join(process.cwd(), "links.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    const links = JSON.parse(fs.readFileSync(linksFilePath));
    res.status(200).json(links);
  }
}
