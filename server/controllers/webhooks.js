import svix from 'svix'; // Default import of the svix module
import User from '../models/UserModel.js'; 

const { webhook } = svix; // Destructure 'webhook' from the default export

// API Controller function to manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new webhook(process.env.CLERK_WEBHOOK_SECRET);

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
                    _id: data.id,  // `id` comes from Clerk, but it's treated as _id in MongoDB
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: '',  // Empty resume
                };

                // Use Mongoose to create the user in the database
             
                await User.create(userData);

                // Respond back to indicate success
                res.json({ success: true, message: "User Created using Clerk", User});

                // Optional: Log the user data
                console.log("User created:", User);
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                };

                // Use Mongoose to update the user in the database
                await User.findByIdAndUpdate(data.id, userData);

                // Respond back to indicate success
                res.json({ success: true, Message: "User Created Succesfully", User});
                break;
            }

            case 'user.deleted': {
                // Use Mongoose to delete the user from the database
                await User.findByIdAndDelete(data.id);

                // Respond back to indicate success
                res.json({ success: true, message: "User Deleted"});
                break;
            }

            default:
                res.json({ success: false, message: "Unknown event type" });
                break;
        }

    } catch (error) {
        console.log("Error occurred:", error); // Log the error object
        res.json({ success: false, message: "Webhook error", error: error.message });
    }
};
