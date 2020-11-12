import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Pusher, * as PusherTypes from "pusher-js";

import styles from "../styles/Home.module.css";
import { Status } from "../types";

const Home = () => {
  const [status, setStatus] = useState<Status>("Unknown");
  const [channel, setChannel] = useState<PusherTypes.Channel | null>(null);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setPusher(
      new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY), {
        cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
      })
    );
    checkAlive();
    setIsDarkMode(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (pusher) {
      setChannel(pusher.subscribe("status"));
    }
  }, [pusher]);

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

  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          (err) => {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
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

        <link
          rel="icon"
          href={isDarkMode ? "/logo-night.png" : "/logo-light.png"}
        />
        <link rel="manifest" href="/manifest.json" />
        <link href="/icon-192x192.png" rel="apple-touch-icon" />
      </Head>

      <main className={styles.main}>
        <div className={styles.iconWrapper}>
          <Image
            src={isDarkMode ? "/logo-night.png" : "/logo-light.png"}
            layout="fixed"
            width={80}
            height={80}
            alt="Auto Gate Logo"
          />
          <div className={styles.logoTxt}>Auto Gate</div>
        </div>

        <div className={styles.buttonWrapper}>
          <div className={styles.title}>
            Status:{" "}
            <span style={{ color: getStatusColor(status) }}>{status}</span>
          </div>

          <button className={styles.toggleButton} onClick={() => toggleGate()}>
            ON / OFF
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
