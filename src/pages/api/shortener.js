import { Client } from "@notionhq/client";
import { nanoid } from "nanoid";

const ALIAS_PROPERTY = "Alias";
const URL_PROPERTY = "URL";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

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
      const properties = {
        URL: { url },
        Alias: { title: [{ text: { content: alias } }] },
      };
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
      });
      res.status(200).json(setLinkResponse(response));
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
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  const links = response.results.map((link) => {
    return setLinkResponse(link);
  });
  return links;
}

async function getLink(alias) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: ALIAS_PROPERTY,
      title: {
        equals: alias,
      },
    },
  });
  return response.results[0] ? setLinkResponse(response.results[0]) : null;
}

function setLinkResponse(link) {
  return {
    alias: link.properties[ALIAS_PROPERTY].title[0].plain_text,
    url: link.properties[URL_PROPERTY].url,
  };
}
