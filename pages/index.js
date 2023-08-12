import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const [id, setId] = useState(0);
  const [sendData, setSenddata] = useState(false);
  const [showConv, setShowConv] = useState(false);

  const scrollToTarget = (param) => {
    const targetElement = param;
    const padding = 100; // Adjust the padding value as needed

    if (targetElement) {
      const offset =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        padding;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    bottomRef.current && scrollToTarget(bottomRef.current);
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    const url = process.env.NEXT_PUBLIC_API_URL;
    // const url = "/api/generate";
    // const url = "https://massive-capsule-395408.nw.r.appspot.com/";
    // console.log("URL", url);

    // console.log("FETCH HISTORY", history);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: history, key: "123456" }),
      });
      const data = await response.json();
      // console.log("FETCHED DATA", data);
      if (response.status !== 200) {
        console.log(data);
        setLoading(false);
        deleteAllConversation();
        alert(data.error);
        return;
      }
      setId(id + 1);
      setHistory((prev) => [...prev, { id, ...data.result }]);
      // console.log("HISTORY FETCH", history);
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
    setShowConv(true);
  }

  const deleteAllConversation = () => {
    setHistory([]);
    setResult([]);
    setShowConv(false);
  };

  const onStateChange = (e) => {
    setResult(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Chatbot AI</title>
        <link rel="icon" href="/femaleico.ico" />
      </Head>

      <div className={styles.main}>
        <AnimatePresence>
          {showConv && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className={styles.conversation}
            >
              {history.length > 0 && (
                <div className={styles.aiResponse}>
                  {history &&
                    history.map((item) => {
                      return (
                        <motion.div
                          key={item.id}
                          className={styles.chatContainer}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {item.role == "user" ? (
                            <img
                              className={styles.chatIconEmoji}
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
                              item.role == "assistant" ? styles.assistant : ""
                            }
                          >
                            {item.content}
                          </p>
                        </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.chatbot}>
          <div className={styles.image}>
            <img src="/female chatbot300px.png" className={styles.icon} />
            <h3>Hi, Iam an AI</h3>
            <p>Powered by ChatGPT</p>
          </div>

          <div className={styles.query}>
            <form onSubmit={onSubmit}>
              <input
                required
                type="text"
                name="animal"
                placeholder="Enter your query"
                value={result}
                onChange={onStateChange}
              />
              {/* {loading ? (
                <div className={styles.ldsEllipsis}>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : ( */}

              <button className={styles.clearAll} type="submit">
                Submit
                <img src="/mailicon50px.png" className={styles.mailIcon} />
              </button>
              {/* )} */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
