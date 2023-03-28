import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ links }) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [allLinks, setAllLinks] = useState(links);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setShortUrl("");
    const response = await fetch("/api/shortener", {
      method: "POST",
      body: JSON.stringify({ url, customAlias }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const newLink = await response.json();
      setShortUrl(`${window.location.origin}/${newLink.alias}`);
      setAllLinks([...allLinks, newLink]);
    } else {
      const errorData = await response.json();
      setError(errorData.error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>URL Shortener</h1>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            URL:
            <input
              className={styles.input}
              type="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
          <label className={styles.label}>
            Custom Alias (optional):
            <input
              className={styles.input}
              type="text"
              value={customAlias}
              onChange={(event) => setCustomAlias(event.target.value)}
            />
          </label>
          <button className={styles.button} type="submit">
            Shorten
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {shortUrl && (
          <p className={styles.shortUrl}>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </p>
        )}
        <h2 className={styles.subtitle}>All Links</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alias</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {allLinks.map((link) => (
              <tr key={link.alias}>
                <td>{link.alias}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${process.env.BASE_URL}/api/shortener`);
  const links = await response.json();
  return { props: { links } };
}
