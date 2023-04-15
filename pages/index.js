import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState([
    "AI: Hi, I am an AI powered by openAI",
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  async function onSubmit(event) {
    event.preventDefault();
    console.log(animalInput);
    setResult((prev) => {
      return [...prev, `Human: ${animalInput}`];
    });
    console.log("RESULT", result);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setAnimalInput("");
      setResult((prev) => [...prev, data.result]);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>MY AWESOME HOTEL</h3>
        <div className={styles.result}>
          {result &&
            result.map((item) => {
              return <p key={item}>{item}</p>;
            })}
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter your query"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        <div ref={bottomRef} />
      </main>
    </div>
  );
}
