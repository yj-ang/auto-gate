// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Pusher from "pusher";

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      const pusher = new Pusher({
        appId: String(process.env.PUSHER_APP_ID),
        key: String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY),
        secret: String(process.env.PUSHER_APP_SECRET),
        cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
        useTLS: true,
      });

      await pusher.trigger("gate", "toggle", new Date());

      res.statusCode = 200;
      res.json({ status: "ok" });
    } else {
      res.statusCode = 404;
      res.json({ status: "notok" });
    }
  } catch (error) {
    res.statusCode = 500;
    res.json({ status: "notok" });
  }
};
