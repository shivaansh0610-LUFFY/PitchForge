import { Router } from "express";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const client = new OAuth2Client();

// This endpoint verifies the Google token sent from the frontend
router.post("/google", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "No credential provided" });
  }

  try {
    // Optionally: verify against the specific CLIENT_ID using: audience: process.env.GOOGLE_CLIENT_ID
    const ticket = await client.verifyIdToken({
      idToken: credential,
    });
    
    const payload = ticket.getPayload();
    // In a real app, you would find or create the user in your database here
    
    // We'll just return the user profile info to the client
    return res.status(200).json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error("[/auth/google] Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
