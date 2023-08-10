import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const [id, setId] = useState(0);
  const [sendData, setSenddata] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //delete conversation if more than 20 chats
    if (history.length > 20) {
      deleteAllConversation();
    }
  }, [history]);

  useEffect(() => {
    if (id > 0) {
      fetchData();
    }

    // console.log("EFFECT SENDATA", sendData);
    // console.log("EFFECT HISTORY", history);
    // setSenddata(!sendData);
  }, [sendData]);

  const fetchData = async () => {
    // const url = "https://massive-capsule-395408.nw.r.appspot.com/";
    // const url = "/api/generate";
    const url = "http://localhost:5000";
    console.log("URL", url);

    console.log("FETCH HISTORY", history);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: history, key: "123456" }),
      });
      const data = await response.json();
      console.log("FETCHED DATA", data);
      if (response.status !== 200) {
        console.log(data);
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setId(id + 1);
      setHistory((prev) => [...prev, { id, ...data.result }]);
      console.log("HISTORY FETCH", history);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert(error.message);
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    setId(id + 1);
    setHistory((prev) => [...prev, { id, role: "user", content: result }]);
    setLoading(true);
    setResult("");
    setSenddata(!sendData);
  }

  const deleteAllConversation = () => {
    setHistory([]);
    setResult([]);
  };

  const onStateChange = (e) => {
    setResult(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Chatbot AI</title>
        <link rel="icon" href="/female chatbot300px.png" />
      </Head>

      <div className={styles.main}>
        <div className={styles.conversation}>
          {history.length > 0 && (
            <div className={styles.aiResponse}>
              {history &&
                history.map((item) => {
                  return (
                    <div key={item.id} className={styles.chatContainer}>
                      {item.role == "user" ? (
                        <img
                          className={styles.chatIcon}
                          src="/emoji200px.png"
                        />
                      ) : (
                        <img
                          className={styles.chatIcon}
                          src="/female_chaticon.png"
                        />
                      )}
                      <p
                        ref={bottomRef}
                        style={{ whiteSpace: "pre-wrap" }}
                        className={
                          item.role == "assistant"
                            ? `${styles.assistant} ${styles.fade}`
                            : ""
                        }
                      >
                        {item.content}
                      </p>
                    </div>
                  );
                })}
              {history.length > 1 && (
                <button
                  className={styles.clearAll}
                  onClick={deleteAllConversation}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.chatbot}>
          <div className={styles.image}>
            <img src="/female chatbot300px.png" className={styles.icon} />
            <h3>Hi, Iam an AI</h3>
            <p>Powered by ChatGPT</p>
          </div>

          <div className={styles.query}>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="animal"
                placeholder="Enter your query"
                value={result}
                onChange={onStateChange}
              />

              {loading ? (
                <div className={styles.ldsEllipsis}>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <input type="submit" value="Submit" />
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
