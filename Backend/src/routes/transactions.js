import express from "express";
import { receiveMaterial, issueMaterial } from "../services/googleSheets.js";

const router = express.Router();

/*
----------------------------------
RECEIVE MATERIAL
POST /api/receive
----------------------------------
*/

router.post("/receive", async (req, res) => {

    try {

        const result = await receiveMaterial(req.body);

        res.json(result);

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

});

/*
----------------------------------
ISSUE MATERIAL
POST /api/issue
----------------------------------
*/

router.post("/issue", async (req, res) => {

    try {

        const result = await issueMaterial(req.body);

        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

export default router;