import fs from "fs";
import path from "path";

const linksFilePath = path.join(process.cwd(), "links.json");

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  const links = JSON.parse(fs.readFileSync(linksFilePath));
  const link = links.find((link) => link.id === slug);
  if (!link) {
    return { notFound: true };
  }
  return {
    redirect: {
      destination: link.url,
      permanent: false,
    },
  };
}

export default function Link() {
  // This component is never actually rendered, because the server-side redirect
  // is triggered by `getServerSideProps`. We include this component just to satisfy
  // the requirements of Next.js.
  return null;
}
