import express from "express";
import { readSheet } from "../services/googleSheets.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const inventory = (await readSheet("Inventory")).slice(1);
        const from = (await readSheet("FROM")).slice(1);
        const to = (await readSheet("TO")).slice(1);

        const totalBoxes = inventory.length;

        const totalInventory = inventory.reduce((sum, row) => {

            return sum + Number(row[7] || 0);

        }, 0);

        const lowStock = inventory.filter(row => Number(row[7] || 0) < 50).length;

        const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

        const todayReceive = from
            .filter(row => row[row.length - 1] === today)
            .reduce((sum, row) => sum + Number(row[7] || 0), 0);

        const todayIssue = to
            .filter(row => row[row.length - 1] === today)
            .reduce((sum, row) => sum + Number(row[7] || 0), 0);

        res.json({

            totalBoxes,
            totalInventory,
            lowStock,
            todayReceive,
            todayIssue

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

});

export default router;