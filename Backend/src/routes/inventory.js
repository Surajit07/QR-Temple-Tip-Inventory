import express from "express";
import { readSheet } from "../services/googleSheets.js";

const router = express.Router();

/*
----------------------------------
GET ALL INVENTORY
GET /api/inventory
----------------------------------
*/

router.get("/", async (req, res) => {

    try {

        const rows = await readSheet("Inventory");

        const inventory = rows.slice(1).map(row => ({

            barcode: row[0],
            uniqueId: row[1],
            tipCode: row[2],
            colour: row[3],
            side: row[4],
            model: row[5],
            printed: row[6],
            qty: Number(row[7]),
            lastUpdated: row[8]

        }));

        res.json(inventory);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

});


/*
----------------------------------
SEARCH INVENTORY
GET /api/inventory/search
----------------------------------
*/

router.get("/search", async (req, res) => {

    try {

        const { uniqueId } = req.query;

        if (!uniqueId) {

            return res.status(400).json({

                success: false,
                message: "uniqueId is required"

            });

        }

        const rows = await readSheet("Inventory");

        const inventory = rows.slice(1);

        const item = inventory.find(row => row[1] === uniqueId);

        if (!item) {

            return res.json({

                exists: false

            });

        }

        return res.json({

            exists: true,

            barcode: item[0],
            uniqueId: item[1],
            tipCode: item[2],
            colour: item[3],
            side: item[4],
            model: item[5],
            printed: item[6],
            qty: Number(item[7]),
            lastUpdated: item[8]

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