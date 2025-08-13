import pkg from "svix";
const { Webhook } = pkg;

import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const clerkWebhooks = async (req, res) => {
  try {
    // Get the raw body as string
    const payload = req.body;
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    console.log("Webhook received:", { headers, payloadLength: payload.length });

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    const { data, type } = evt;
    console.log("Webhook event:", { type, userId: data.id });

    switch (type) {
      case "user.created":
        const newUser = await User.create({
          _id: data.id, // string ID is fine
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        });
        console.log("User created:", newUser);
        return res.status(200).json({});

      case "user.updated":
        const updatedUser = await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        });
        console.log("User updated:", updatedUser);
        return res.status(200).json({});

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        return res.status(200).json({});

      default:
        console.log("Unhandled webhook event:", type);
        return res.status(200).json({ message: "Unhandled event" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    console.error("Full error:", error);
    return res
      .status(400)
      .json({ success: false, message: "Webhook verification failed" });
  }
};
