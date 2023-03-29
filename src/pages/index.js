import { useState } from "react";
import Head from "next/head";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

function AllLinksModal(props) {
  const { links, baseUrl, ...modalProps } = props;
  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
      className="modal-glassmorphism"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">All Links</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped>
          <thead>
            <tr>
              <th>Alias</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.alias}>
                <td>
                  <a
                    href={baseUrl.concat("/", link.alias)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {baseUrl.concat("/", link.alias)}
                  </a>
                </td>
                <td>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Home({ links }) {
  const [url, setUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [allLinks, setAllLinks] = useState(links);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
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
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url("https://picsum.photos/1920/1080")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: "0.8",
          zIndex: "-1",
        }}
      >
        <div
          className="position-absolute w-100 h-100 bg-dark"
          style={{ opacity: "0.2" }}
        />
      </div>

      <main className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg p-3 bg-glassmorphism">
                <div className="card-body text-center">
                  <h1 className="h2 mb-4 fw-bold text-uppercase text-white">
                    Shorten your URL
                  </h1>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {shortUrl && (
                    <div className="alert alert-success">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortUrl}
                      </a>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label
                        htmlFor="url"
                        className="form-label visually-hidden"
                      >
                        URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        id="url"
                        className="form-control"
                        placeholder="Enter your URL"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="alias"
                        className="form-label visually-hidden"
                      >
                        Custom alias (optional)
                      </label>
                      <input
                        type="text"
                        name="alias"
                        id="alias"
                        className="form-control"
                        placeholder="Custom alias (optional)"
                        value={customAlias}
                        onChange={(event) => setCustomAlias(event.target.value)}
                      />
                    </div>
                    <div className="d-grid">
                      {loading ? (
                        <>
                          <Button disabled variant="secondary">
                            Loading
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button type="submit" variant="primary">
                            Shorten
                          </Button>
                          <Button
                            variant="primary"
                            className="mt-3"
                            onClick={() => {
                              setModalShow(true);
                              setBaseUrl(window.location.origin);
                            }}
                          >
                            All links
                          </Button>
                        </>
                      )}
                      {/* <button type="submit" className="btn btn-primary">
                        Shorten
                      </button>
                      <Button
                        variant="primary"
                        className="mt-3"
                        onClick={() => {
                          setModalShow(true);
                          setBaseUrl(window.location.origin);
                        }}
                      >
                        All links
                      </Button> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AllLinksModal
        show={modalShow}
        links={allLinks}
        baseUrl={baseUrl}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${process.env.BASE_URL}/api/shortener`);
  const links = await response.json();
  return { props: { links } };
}
