import { useState } from "react";
import Header from "../components/Header";
import SearchableSelect from "../components/SearchableSelect";
import PrimaryButton from "../components/PrimaryButton";
import BackButton from "../components/BackButton";

import { useEffect } from "react";
import api from "../services/api";

export default function Receive() {

  const [from, setFrom] = useState<any>(null);

  const [tipOptions, setTipOptions] = useState<any[]>([]);
  const [tip, setTip] = useState<any>(null);
  const [colour, setColour] = useState("");

  const [modelOptions, setModelOptions] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);
  const [side, setSide] = useState<any>(null);
  const [printed, setPrinted] = useState<any>(null);
  const [printedOptions, setPrintedOptions] = useState<any[]>([]);

  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState("");
  const [operator, setOperator] = useState("");
  const [currentQty, setCurrentQty] = useState(0);
  const [boxExists, setBoxExists] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadTips();
    loadModels();
  }, []);

  useEffect(() => {

  if (model) {

    loadPrinted(model.value);

  }

}, [model]);

  // ==========================
  // FUNCTIONS
  // ==========================

  // async function loadTips() {
  //   try {

  //     const response = await api.get("", {
  //       params: {
  //         action: "tips",
  //       },
  //     });

  //     console.log("Response:", response.data);

  //     const options = response.data.map((item: any) => ({
  //       value: item.tipCode,
  //       label: item.tipCode,
  //       colour: item.colour,
  //     }));

  //     setTipOptions(options);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function loadPrinted(modelNo: string) {

  try {

    const response = await api.get(`/models/pids/${modelNo}`);

    const options = [

      {
        value: "Blank",
        label: "Blank"
      },
      {
        value: "VC",
        label: "VC",
      },

      ...response.data.map((item: any) => ({

        value: item.pid,
        label: item.pid

      }))

    ];

    setPrintedOptions(options);

  }

  catch (error) {

    console.error(error);

  }

}

  async function loadTips() {

  try {

    const response = await api.get("/tips");

    const options = response.data.map((item: any) => ({

      value: item.tipCode,
      label: item.tipCode,
      colour: item.colour

    }));

    setTipOptions(options);

  }

  catch (error) {

    console.error(error);

  }

}

  // async function loadModels() {

  // try {

  //   const response = await api.get("", {
  //     params: {
  //       action: "models",
  //     },
  //   });

  //   const options = response.data.map((item: any) => ({
  //     value: item,
  //     label: item,
  //   }));

  //   setModelOptions(options);

  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

async function loadModels() {

  try {

    const response = await api.get("/models");

    const options = response.data.map((item: any) => ({

      value: item,
      label: item

    }));

    setModelOptions(options);

  }

  catch (error) {

    console.error(error);

  }

}

  // async function searchBox() {
  //   setSearched(true);
  //   setBoxExists(false);
  //   setBarcode("");
  //   setCurrentQty(0);
  // }
  async function searchBox() {

  try {

    if (!tip || !side) {

      alert("Please select Tip Code and Side.");

      return;

    }

    let printedValue = "Blank";

    if (showModelAndPrinted) {

      if (!printed) {

        alert("Please select Printed.");

        return;

      }

      printedValue = printed.value;

    }

    const uniqueId = `${tip.value}_${side.value}_${printedValue}`;
    console.log("Searching Unique ID:", uniqueId);

    const response = await api.get("/inventory/search", {

      params: {

        uniqueId

      }

    });

    setSearched(true);

    if (response.data.exists) {

      setBoxExists(true);

      setBarcode(response.data.barcode);

      setCurrentQty(response.data.qty);

    }

    else {

      setBoxExists(false);

      setBarcode("");

      setCurrentQty(0);

      }

    }

    catch (error) {

      console.error(error);

      alert("Unable to search inventory.");

    }

  }
  async function receiveMaterial() {

  try {

    if (!tip || !side || !qty || !operator) {

      alert("Please fill all required fields.");

      return;

    }

    let printedValue = "Blank";
    let modelValue = "";

    if (showModelAndPrinted) {

      printedValue = printed?.value || "Blank";
      modelValue = model?.value || "";

    }

    const payload = {

      barcode,

      tipCode: tip.value,

      colour,

      side: side.value,

      model: modelValue,

      printed: printedValue,

      qty: Number(qty),

      from: from.value,

      operator

    };

    const response = await api.post("/receive", payload);

    alert(response.data.message);

    // Refresh inventory
    await searchBox();

    // Clear receive fields
    setQty("");
    setOperator("");

  }

  catch (error: any) {

    console.error(error);

    alert(error.response?.data?.message || "Receive Failed");

  }

}

  const locationOptions = [
    { value: "Store", label: "Store" },
    { value: "Laser Printing", label: "Laser Printing" },
    { value: "PAD Printing", label: "PAD Printing" },
    { value: "Assembly", label: "Assembly" },
  ];

  const showModelAndPrinted = from?.value !== "Store";

  return (
    <div className="min-h-screen bg-slate-100">

      <Header />
      <div className="max-w-5xl mx-auto mt-6">
        <BackButton />  
      </div>

      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-8">
          Receive Material
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {/* FROM */}

          <div>

            <label className="font-semibold mb-2 block">
              From
            </label>

            <SearchableSelect
              options={locationOptions}
              value={from}
              onChange={setFrom}
              placeholder="Select Source"
            />

          </div>

          {/* TIP CODE */}

          <div>

            <label className="font-semibold mb-2 block">
              Tip Code
            </label>

            <SearchableSelect
              options={tipOptions}
              value={tip}
              onChange={(selected) => {
                setTip(selected);
                setColour(selected?.colour || "");
              }}
              placeholder="Select Tip Code"
            />

          </div>

          {/* COLOUR */}

          <div>

            <label className="font-semibold mb-2 block">
              Colour
            </label>

            <input
              value={colour}
              className="w-full border rounded-lg p-3 bg-gray-100"
              disabled
            />

          </div>

          {/* SIDE */}

          <div>

            <label className="font-semibold mb-2 block">
              Side
            </label>

            <SearchableSelect
              options={[
                { value: "Left", label: "Left" },
                { value: "Right", label: "Right" },
              ]}
              value={side}
              onChange={setSide}
              placeholder="Select Side"
            />

          </div>

          {/* MODEL */}

          {showModelAndPrinted && (

            <div>

              <label className="font-semibold mb-2 block">
                Model
              </label>

              <SearchableSelect
                options={modelOptions}
                value={model}
                onChange={setModel}
                placeholder="Select Model"
              />

            </div>

          )}

          {/* PRINTED */}

          {showModelAndPrinted && (

            <div>

              <label className="font-semibold mb-2 block">
                Printed
              </label>

              <SearchableSelect
                options={printedOptions}
                value={printed}
                onChange={setPrinted}
                placeholder="Select Printed"
              />

            </div>

)}

        </div>

        <div className="mt-8">

          <PrimaryButton
            title="Search Box"
            onClick={searchBox}
          />

        </div>

        {searched && (

  <div className="mt-6 rounded-xl border p-5 bg-slate-50">

    {boxExists ? (

      <>

        <h3 className="text-green-700 text-xl font-bold mb-4">
          Existing Box Found
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="font-semibold">
              Barcode
            </label>

            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              disabled
              className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
              placeholder="Scan Barcode"
            />

          </div>

          <div>

            <label className="font-semibold">
              Current Quantity
            </label>

            <input
              value={currentQty}
              disabled
              className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
            />

          </div>

        </div>

      </>

    ) : (

      <div>

        <h3 className="text-blue-700 text-xl font-bold">
          New Box
        </h3>

        <p className="mt-2">
          Inventory not found.
        </p>

        <p>
          A new box will be created after receiving material.
        </p>

      </div>

    )}

  </div>

)}

        <div className="mt-8 grid grid-cols-2 gap-6">

          <div>

            <label className="font-semibold mb-2 block">
              Barcode
            </label>

            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              disabled={boxExists}
              className="w-full border rounded-lg p-3 disabled:bg-gray-100"
              placeholder="Scan Barcode"
            />

          </div>

          <div>

            <label className="font-semibold mb-2 block">
              Quantity
            </label>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter Quantity"
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="font-semibold mb-2 block">
            Operator
          </label>

          <input
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Enter Operator Name"
          />

        </div>

        <div className="mt-8">

          <PrimaryButton
            title="Receive Material"
            onClick={receiveMaterial}
          />

        </div>

      </div>

    </div>
  );

}
