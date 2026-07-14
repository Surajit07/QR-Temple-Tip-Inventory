import { APPS_SCRIPT_URL } from "../config/appConfig.js";

// export async function callAppsScript(params) {

//   const url =
//     APPS_SCRIPT_URL +
//     "?" +
//     new URLSearchParams(params).toString();

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error("Apps Script Request Failed");
//   }

//   return await response.json();
// }

export async function callAppsScript(params) {
  const url =
    APPS_SCRIPT_URL +
    "?" +
    new URLSearchParams(params).toString();

  console.log("Calling:", url);

  const response = await fetch(url, {
    redirect: "follow",
  });

  console.log("Status:", response.status);
  console.log("Content-Type:", response.headers.get("content-type"));

  const text = await response.text();

  console.log(text.substring(0, 500));

  return JSON.parse(text);
}