import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const linksFilePath = path.join(process.cwd(), "links.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { url, customId } = req.body;
    let id = customId || nanoid(6);
    const links = JSON.parse(fs.readFileSync(linksFilePath));
    if (links.some((link) => link.id === id)) {
      res.status(400).json({ error: "Custom ID already exists" });
      return;
    }
    links.push({ id, url });
    fs.writeFileSync(linksFilePath, JSON.stringify(links));
    res.status(200).json({ id });
  } else if (req.method === "GET") {
    const { id } = req.query;
    const links = JSON.parse(fs.readFileSync(linksFilePath));
    const link = links.find((link) => link.id === id);
    if (link) {
      res.redirect(link.url);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  }
}
