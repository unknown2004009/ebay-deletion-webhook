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

// Privacy Policy
app.get("/privacy", (req, res) => {
res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy</title>
<style>
body {
font-family: Arial, sans-serif;
max-width: 800px;
margin: 40px auto;
padding: 0 20px;
line-height: 1.6;
color: #222;
}

h1, h2 {
color: #111;
}
</style>
</head>

<body>

<h1>Privacy Policy</h1>

<p><strong>Last updated:</strong> August 2026</p>

<p>
This Privacy Policy explains how this application handles information
when you authorize it to access your eBay account.
</p>

<h2>Information We May Access</h2>

<p>
When you authorize this application through eBay, the application may
receive information permitted by the eBay OAuth permissions that you
approve.
</p>

<h2>How We Use Information</h2>

<p>
Information accessed through eBay is used only to provide the functions
of this application and to perform the services requested by the user.
We do not sell eBay user information.
</p>

<h2>Data Security</h2>

<p>
We take reasonable technical and organizational measures to protect
information accessed through the application against unauthorized
access, disclosure, alteration, or destruction.
</p>

<h2>Data Retention and Deletion</h2>

<p>
We retain information only for as long as reasonably necessary to
provide the application's services or where retention is required by
law.
</p>

<p>
Where applicable, information associated with an eBay user will be
deleted when required by eBay's Marketplace Account Deletion
requirements.
</p>

<h2>Third-Party Services</h2>

<p>
This application uses eBay APIs and services. Your use of eBay remains
subject to eBay's own terms and privacy policies.
</p>

<h2>Changes to This Privacy Policy</h2>

<p>
We may update this Privacy Policy from time to time. Any updated
version will be published on this page.
</p>

<h2>Contact</h2>

<p>
If you have questions about this Privacy Policy or the handling of your
information, please contact the application owner.
</p>

</body>
</html>
`);
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