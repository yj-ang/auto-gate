import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { useEffect, useState } from "react";
import { Status } from "../types";

let pusher = null;

const Home = () => {
  const [status, setStatus] = useState<Status>("Unknown");
  const [channel, setChannel] = useState<PusherTypes.Channel | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY), {
      cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    });

    setChannel(pusher.subscribe("status"));
    checkAlive();

    setIsDarkMode(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
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

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Online" as Status:
        return "#00c451";
      case "Offline" as Status:
        return "#ff4c49";
      default:
        return isDarkMode ? "#ffffff" : "#000000";
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="theme-color" content="#000000" />

        <title>Auto Gate</title>

        <link rel="icon" href={isDarkMode ? "/logo-night.png" : "/logo-light.png"} />
        <link rel="manifest" href="/manifest.json" />
        <link href="/icon-192x192.png" rel="apple-touch-icon" />
      </Head>

      <main className={styles.main}>
        <Image
          src={isDarkMode ? "/logo-night.png" : "/logo-light.png"}
          layout="fixed"
          width={80}
          height={80}
        />

        <h6 className={styles.title}>
          Status:{" "}
          <span style={{ color: getStatusColor(status) }}>{status}</span>
        </h6>

        <button className={styles.toggleButton} onClick={() => toggleGate()}>
          ON / OFF
        </button>
      </main>
    </div>
  );
};

export default Home;
