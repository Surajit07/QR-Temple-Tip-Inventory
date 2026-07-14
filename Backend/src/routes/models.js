import express from "express";
import { readSheet } from "../services/googleSheets.js";

const router = express.Router();

/*
----------------------------------
GET ALL MODELS
/api/models
----------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const rows = await readSheet("Frame PIDs");

    const models = [
      ...new Set(
        rows
          .slice(1)
          .map((row) => row[1])
          .filter(Boolean)
      ),
    ].sort();

    res.json(models);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
----------------------------------
GET PID BY MODEL
/api/models/pids/:model
----------------------------------
*/

router.get("/pids/:model", async (req, res) => {
  try {

    const model = req.params.model;

    const rows = await readSheet("Frame PIDs");

    const result = rows
      .slice(1)
      .filter((row) => row[1] === model)
      .map((row) => ({
        pid: row[0],
        side: row[2],
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