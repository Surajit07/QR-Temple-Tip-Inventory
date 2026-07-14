import express from "express";
import { readSheet } from "../services/googleSheets.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rows = await readSheet("Tips Code Library");

    const result = rows.slice(1).map((row) => ({
      tipCode: row[0] || "",
      colour: row[1] || "",
    }));

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
});

export default router;