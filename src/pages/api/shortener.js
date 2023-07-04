import { nanoid } from "nanoid";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url, customAlias } = req.body;
    let existingLink = true;
    if (customAlias === "") {
      existingLink = false;
    } else {
      existingLink = await getLink(customAlias);
    }
    if (existingLink) {
      res.status(400).json({
        error: `The custom alias '${customAlias}' is already in use.`,
      });
    } else {
      const alias = customAlias || nanoid(6);
      const { rows } =
        await sql`INSERT INTO url_shortener (alias, url) VALUES (${alias}, ${url}) RETURNING alias, url;`;
      res.status(200).json(setLinkResponse(rows[0]));
    }
  } else if (req.method === "GET") {
    const { alias } = req.query;
    if (alias) {
      const link = await getLink(alias);
      res.status(200).json(link);
    } else {
      const links = await getAllLinks();
      res.status(200).json(links);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

async function getAllLinks() {
  const { rows } = await sql`SELECT * from url_shortener`;
  const links = rows.map((row) => ({
    alias: row.alias,
    url: row.url,
  }));
  return links;
}

async function getLink(alias) {
  const { rows } =
    await sql`SELECT 1 from url_shortener WHERE alias = ${alias}`;
  return rows.length ? setLinkResponse(rows[0]) : null;
}

function setLinkResponse(link) {
  return {
    alias: link.alias,
    url: link.url,
  };
}
