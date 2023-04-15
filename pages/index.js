import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [myboolean, setMyboolean] = useState(false);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: history }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setHistory((prev) => [...prev, data.result]);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    console.log("EFFECT");

    if (myboolean) {
      fetchData();
      setMyboolean(false);
    }
    console.log("HISTORY EFFECT", history);
  }, [history]);

  function onSubmit(event) {
    event.preventDefault();
    // console.log(animalInput);
    // setResult((prev) => {
    //   return [...prev, `Human: ${animalInput}`];
    // });
    // setAnimalInput("");
    setHistory((prev) => [...prev, `Human: ${result}`]);
    setMyboolean(true);
    setResult("");
    console.log("BOOLEAN", myboolean);
    console.log("HISTORY", history);
  }

  const onStateChange = (e) => {
    setResult(e.target.value);
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Hi, Iam an AI</h3>
        <div className={styles.result}>
          <p>
            Powered by ChatGPT. Hadi has instructed me to be a friendly chatbot
            with good knowledge of London.
          </p>
          {history &&
            history.map((item) => {
              return <p key={item}>{item}</p>;
            })}
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter your query"
            value={result}
            onChange={onStateChange}
          />
          <input type="submit" value="Submit" />
        </form>
        <div ref={bottomRef} />
      </main>
    </div>
  );
}
