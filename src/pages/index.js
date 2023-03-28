import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customId, setCustomId] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch("/api/links");
      const data = await response.json();
      setLinks(data);
    };
    fetchLinks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, customId }),
    });
    const data = await response.json();
    if (response.ok) {
      setShortUrl(`${window.location.origin}/${data.id}`);
    } else {
      setError(data.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">URL:</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
        <label htmlFor="customId">Custom ID:</label>
        <input
          id="customId"
          type="text"
          value={customId}
          onChange={(event) => setCustomId(event.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p>{error}</p>}
      {shortUrl && (
        <p>
          Your shortened URL is:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>{link.id}</td>
              <td>
                <a
                  href={`/${link.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
