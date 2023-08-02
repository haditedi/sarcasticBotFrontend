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
  }, [history]);

  useEffect(() => {
    if (id > 0) {
      fetchData();
    }

    console.log("EFFECT SENDATA", sendData);
    console.log("EFFECT HISTORY", history);
    // setSenddata(!sendData);
  }, [sendData]);

  const fetchData = async () => {
    console.log("FETCH HISTORY", history);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: history }),
      });
      const data = await response.json();
      console.log("FETCH", data.result);
      if (response.status !== 200) {
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
    console.log("SUBMIT ID", id);
    setHistory((prev) => [...prev, { id, role: "user", content: result }]);
    setLoading(true);
    console.log("RESULT", result);
    setResult("");
    console.log("LOADING", loading);
    console.log("SUBMIT HISTORY", history);
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
                    <p
                      key={item.id}
                      ref={bottomRef}
                      className={
                        item.role == "assistant"
                          ? `${styles.assistant} ${styles.fade}`
                          : ""
                      }
                    >
                      {item.content}
                    </p>
                  );
                })}
              {history.length > 3 && (
                <button
                  className={styles.clearAll}
                  onClick={deleteAllConversation}
                >
                  Clear All
                </button>
              )}
              {/* <div ref={bottomRef} /> */}
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
