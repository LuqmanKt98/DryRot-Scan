import Stripe from "stripe";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { secretKey } = req.body || {};
  
  // Use manual key if provided, otherwise use environment key
  const stripeKey = secretKey || process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    console.error("Stripe not configured: No key found");
    return res.status(500).json({ 
      error: "Stripe is not configured. Please add your STRIPE_SECRET_KEY to the Environment Variables." 
    });
  }

  const stripe = new Stripe(stripeKey);

  try {
    let origin = req.headers.origin || `https://${req.headers.host}`;
    // Remove trailing slash if present
    origin = origin.replace(/\/$/, "");

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
            unit_amount: 299, // $2.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
}
