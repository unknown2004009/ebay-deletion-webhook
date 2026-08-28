const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;
const ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL;
const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN;


// Health check
app.get("/", (req, res) => {
res.status(200).json({
status: "online",
service: "eBay Marketplace Account Deletion Webhook"
});
});


// eBay endpoint verification
app.get("/ebay/account-deletion", (req, res) => {

const challengeCode = req.query.challenge_code;

if (!challengeCode) {
return res.status(400).json({
error: "Missing challenge_code"
});
}

if (!VERIFICATION_TOKEN || !ENDPOINT_URL) {
console.error("Missing eBay environment variables");

return res.status(500).json({
error: "Webhook configuration incomplete"
});
}

const hash = crypto.createHash("sha256");

hash.update(challengeCode);
hash.update(VERIFICATION_TOKEN);
hash.update(ENDPOINT_URL);

const challengeResponse = hash.digest("hex");

console.log("eBay challenge received");

return res
.status(200)
.type("application/json")
.json({
challengeResponse
});
});


// eBay deletion notification
app.post("/ebay/account-deletion", (req, res) => {

console.log("eBay deletion notification received");

console.log(JSON.stringify(req.body, null, 2));

return res.status(200).json({
status: "received"
});
});


// 404 handler
app.use((req, res) => {
res.status(404).json({
error: "Not found"
});
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
console.log(`Server running on port ${PORT}`);
});