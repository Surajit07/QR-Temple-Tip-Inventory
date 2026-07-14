import { getSheetsClient } from "../config/googleAuth.js";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function readSheet(sheetName) {

    const sheets = await getSheetsClient();

    const response = await sheets.spreadsheets.values.get({

        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,

    });

    return response.data.values || [];

}

export async function appendRow(sheetName, row) {

    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.append({

        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,

        valueInputOption: "USER_ENTERED",

        requestBody: {

            values: [row]

        }

    });

}

export async function updateRow(sheetName, rowNumber, row) {

    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.update({

        spreadsheetId: SPREADSHEET_ID,

        range: `${sheetName}!A${rowNumber}:I${rowNumber}`,

        valueInputOption: "USER_ENTERED",

        requestBody: {

            values: [row]

        }

    });

}

export async function findInventory(uniqueId) {

    const rows = await readSheet("Inventory");

    const inventory = rows.slice(1);

    const index = inventory.findIndex(row => row[1] === uniqueId);

    if (index === -1) {

        return null;

    }

    return {

        rowNumber: index + 2,
        row: inventory[index]

    };

}
export async function findBarcode(barcode) {

    const rows = await readSheet("Inventory");

    const inventory = rows.slice(1);

    const index = inventory.findIndex(row => row[0] === barcode);

    if (index === -1) {

        return null;

    }

    return {

        rowNumber: index + 2,

        row: inventory[index]

    };

}

export async function receiveMaterial(data) {

    const {

        barcode,
        tipCode,
        colour,
        side,
        model,
        printed,
        qty,
        from,
        operator

    } = data;

    const uniqueId = `${tipCode}_${side}_${printed}`;

    const now = new Date();

    const date = now.toLocaleDateString("en-GB");

    const time = now.toLocaleTimeString("en-GB");

    const lastUpdated = `${date} ${time}`;

    let shift = "C";

    const hour = now.getHours();

    if (hour >= 6 && hour < 14)
        shift = "A";

    else if (hour >= 14 && hour < 22)
        shift = "B";

    const inventory = await findInventory(uniqueId);

    /*
    ----------------------------------
    Inventory Exists
    ----------------------------------
    */

    if (inventory) {

        const row = inventory.row;

        row[7] = Number(row[7]) + Number(qty);

        row[8] = lastUpdated;

        await updateRow(

            "Inventory",

            inventory.rowNumber,

            row

        );

    }

    /*
    ----------------------------------
    New Inventory
    ----------------------------------
    */

    else {

        await appendRow("Inventory", [

            barcode,
            uniqueId,
            tipCode,
            colour,
            side,
            model,
            printed,
            qty,
            lastUpdated

        ]);

    }

    /*
    ----------------------------------
    Transaction History
    ----------------------------------
    */

    await appendRow("FROM", [

        date,
        time,
        shift,
        barcode,
        uniqueId,
        tipCode,
        colour,
        side,
        model,
        printed,
        qty,
        from,
        operator

    ]);

    return {

        success: true,

        message: "Material Received Successfully"

    };

}

export async function issueMaterial(data) {

    const {

        barcode,
        tipCode,
        colour,
        side,
        model,
        printed,
        qty,
        to,
        operator

    } = data;

    const uniqueId = `${tipCode}_${side}_${printed}`;

    const now = new Date();

    const date = now.toLocaleDateString("en-GB");

    const time = now.toLocaleTimeString("en-GB");

    const lastUpdated = `${date} ${time}`;

    let shift = "C";

    const hour = now.getHours();

    if (hour >= 6 && hour < 14)
        shift = "A";

    else if (hour >= 14 && hour < 22)
        shift = "B";

    const inventory = await findInventory(uniqueId);

    if (!inventory) {

        return {

            success: false,

            message: "Inventory not found."

        };

    }

    const row = inventory.row;

    const availableQty = Number(row[7]);

    if (availableQty < Number(qty)) {

        return {

            success: false,

            message: "Insufficient Stock."

        };

    }

    row[7] = availableQty - Number(qty);

    row[8] = lastUpdated;

    await updateRow(

        "Inventory",

        inventory.rowNumber,

        row

    );

    await appendRow("TO", [

        date,

        time,

        shift,

        barcode,

        uniqueId,

        tipCode,

        colour,

        side,

        model,

        printed,

        qty,

        to,

        operator

    ]);

    return {

        success: true,

        message: "Material Issued Successfully"

    };

}