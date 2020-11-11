// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Pusher from "pusher";

const pusher = new Pusher({
  appId: String(process.env.PUSHER_APP_ID),
  key: String(process.env.NEXT_PUBLIC_PUSHER_APP_KEY),
  secret: String(process.env.PUSHER_APP_SECRET),
  cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  useTLS: true
});

export default (req, res) => {
  res.statusCode = 200
  pusher.trigger("status", "alive", new Date());
  res.json({ status: 'ok' })
}
