import express from "express";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Serve static frontend files
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

// Catch-all route to serve index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Example API route (keep your existing routes)
import apiRoutes from "./routes";
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
