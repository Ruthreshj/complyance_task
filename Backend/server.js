import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        
  password: "Swathipapa@05",         
  database: "roi_simulator",
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection failed:", err);
  else console.log("✅ Connected to MySQL");
});

// 🧮 ROI calculation route
app.post("/api/calculate", (req, res) => {
  const { invoices, manualCost, toolCost, hourlyRate } = req.body;

  const manualTotal = invoices * manualCost;
  const automatedTotal = toolCost + invoices * (manualCost * 0.2);
  const monthlySavings = manualTotal - automatedTotal;
  const annualSavings = monthlySavings * 12;
  const roi = (annualSavings / (toolCost * 12)) * 100;
  const payback = monthlySavings > 0 ? (toolCost / monthlySavings).toFixed(2) : null;

  // ✅ Insert record into DB
  const sql = `
    INSERT INTO calculations 
    (invoices, manual_cost, tool_cost, hourly_rate, manual_total, automated_total, monthly_savings, annual_savings, roi, payback)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [invoices, manualCost, toolCost, hourlyRate, manualTotal, automatedTotal, monthlySavings, annualSavings, roi, payback],
    (err, result) => {
      if (err) {
        console.error("❌ DB insert error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        message: "Calculation saved successfully",
        result: { manualTotal, automatedTotal, monthlySavings, annualSavings, roi, payback },
      });
    }
  );
});

// 🧾 Optional: Fetch past calculations
app.get("/api/history", (req, res) => {
  db.query("SELECT * FROM calculations ORDER BY created_at DESC LIMIT 10", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
