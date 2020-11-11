import Head from "next/head";
import styles from "../styles/Home.module.css";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { useEffect, useState } from "react";
import { Status } from "../types";

let pusher = null;

const Home = () => {
  const [status, setStatus] = useState<Status>("Unknown");
  const [channel, setChannel] = useState<PusherTypes.Channel | null>(null);

  useEffect(() => {
    pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY), {
      cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    });

    setChannel(pusher.subscribe("status"));
    checkAlive();
  }, []);

  useEffect(() => {
    channel?.bind("online", () => {
      setStatus("Online");
    });
  }, [channel]);

  const checkAlive = async () => {
    try {
      const res = await fetch("/api/check-alive", {
        method: "POST",
      });

      if (res.status !== 200) {
        throw new Error("Unexpected error");
      }
    } catch {
      alert("Unexpected error");
    }
  };

  const toggleGate = async () => {
    try {
      const res = await fetch("/api/toggle-gate", {
        method: "POST",
      });

      if (res.status !== 200) {
        throw new Error("Unexpected error");
      }
    } catch {
      alert("Unexpected error");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h6 className={styles.title}>Status: {status}</h6>

        <button className={styles.toggleButton} onClick={() => toggleGate()}>
          Toggle
        </button>
      </main>
    </div>
  );
};

export default Home;
