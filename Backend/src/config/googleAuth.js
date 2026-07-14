import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function getSheetsClient() {
  const client = await auth.getClient();

  return google.sheets({
    version: "v4",
    auth: client,
  });
}