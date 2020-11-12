import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: String(process.env.PUSHER_APP_ID),
  key: String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY),
  secret: String(process.env.PUSHER_APP_SECRET),
  cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  useTLS: true,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      await pusher.trigger("status", "alive", new Date());

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
