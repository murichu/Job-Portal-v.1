import svix from 'svix'; // Default import of the svix module
import prisma from "../config/prisma.js";

const { webhook } = svix; // Destructure 'webhook' from the default export

// API Controller function to manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new webhook(process.env.CLERK_WEBHOOK_SECRET);  // Corrected instantiation

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        // Getting data from the request body
        const { data, type } = req.body;

        // Switch Cases for different Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    id: data.id,  // `id` is the Prisma field, not `_id`
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: '',  // Empty resume
                };

                await prisma.user.create({ data: userData });  // Corrected to use Prisma

                res.json({ success: true });
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                };

                await prisma.user.update({
                    where: { id: data.id },
                    data: userData,
                });

                res.json({ success: true });
                break;
            }

            case 'user.deleted': {
                await prisma.user.delete({
                    where: { id: data.id },
                });

                res.json({ success: true });
                break;
            }

            default:
                res.json({ success: false, message: "Unknown event type" });
                break;
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Webhook error" });
    }
};
