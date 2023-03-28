export async function getServerSideProps(context) {
  const alias = context.params.alias;
  const response = await fetch(
    `${process.env.BASE_URL}/api/shortener?alias=${alias}`
  );
  const link = await response.json();
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
