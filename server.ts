
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let stripeInstance: Stripe | null = null;

function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeInstance = new Stripe(key);
    }
  }
  return stripeInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers for Firebase Auth Popups
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
  });

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { secretKey } = req.body;
    console.log("--- New Checkout Session Request ---");
    console.log("Has manual secretKey:", !!secretKey);
    
    // Use manual key if provided, otherwise use environment key
    const stripe = secretKey ? new Stripe(secretKey) : getStripe();
    
    if (!stripe) {
      console.error("Stripe not configured: No key found in body or environment");
      return res.status(500).json({ 
        error: "Stripe is not configured. Please add your STRIPE_SECRET_KEY to the Secrets in Settings." 
      });
    }

    try {
      let origin = req.headers.origin || `http://${req.headers.host}`;
      // Remove trailing slash if present
      origin = origin.replace(/\/$/, "");
      console.log("Origin for redirect:", origin);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "DryRot Scan - Full Vehicle Report",
                description: "Complete AI-powered tire safety assessment",
              },
              unit_amount: 299, // $2.99 - matching translation
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/?payment=success`,
        cancel_url: `${origin}/?payment=cancel`,
      });

      console.log("Session created successfully:", session.id);
      console.log("Checkout URL:", session.url);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("STRIPE ERROR:", error.message);
      console.error("Full error details:", JSON.stringify(error));
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
