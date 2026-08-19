// Secure relay: the browser talks to THIS, and this talks to Anthropic.
// Your API key lives only here (as an environment variable) — never in the webpage.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }
  try {
    // Read the raw request body ourselves, so parsing never depends on Vercel's guesswork.
    let raw = "";
    if (req.body && typeof req.body === "object") {
      raw = JSON.stringify(req.body);
    } else if (typeof req.body === "string" && req.body.length) {
      raw = req.body;
    } else {
      raw = await new Promise((resolve) => {
        let d = "";
        req.on("data", (c) => (d += c));
        req.on("end", () => resolve(d));
        req.on("error", () => resolve(""));
      });
    }

    const payload = raw ? JSON.parse(raw) : {};

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
