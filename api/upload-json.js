// api/upload-json.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const body = await readJson(req);
  
      const pinataResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
          },
          body: JSON.stringify({
            pinataMetadata: { name: "MyJsonUpload" },
            pinataContent: body,
          }),
        }
      );
  
      if (!pinataResponse.ok) {
        const errorText = await pinataResponse.text();
        throw new Error(`Pinata upload failed: ${errorText}`);
      }
  
      const data = await pinataResponse.json();
      res.status(200).json(data);
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
  
  // Helper: read JSON body from request stream
  async function readJson(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    return JSON.parse(buffer.toString("utf8"));
  }
  