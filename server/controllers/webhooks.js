import pkg from "svix";
const { Webhook } = pkg;

import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString(); // convert Buffer to string
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers); // now verification works

    const { data, type } = evt;

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id, // string ID is fine
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        });
        return res.status(200).json({});

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        });
        return res.status(200).json({});

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({});

      default:
        return res.status(200).json({ message: "Unhandled event" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res
      .status(400)
      .json({ success: false, message: "Webhook verification failed" });
  }
};
