import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import SearchableSelect from "../components/SearchableSelect";
import BackButton from "../components/BackButton";

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Issue() {
  const [to, setTo] = useState<any>(null);

const [tipOptions, setTipOptions] = useState<any[]>([]);
const [tip, setTip] = useState<any>(null);

const [colour, setColour] = useState("");

const [side, setSide] = useState<any>(null);

const [modelOptions, setModelOptions] = useState<any[]>([]);
const [model, setModel] = useState<any>(null);

const [printedOptions, setPrintedOptions] = useState<any[]>([]);
const [printed, setPrinted] = useState<any>(null);

const [barcode, setBarcode] = useState("");
const [currentQty, setCurrentQty] = useState(0);

const [qty, setQty] = useState("");

const [operator, setOperator] = useState("");

const [boxExists, setBoxExists] = useState(false);
const [searched, setSearched] = useState(false);

useEffect(() => {

    loadTips();

    loadModels();

}, []);

useEffect(() => {

    if(model){

        loadPrinted(model.value);

    }

}, [model]);

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

const destinationOptions = [

    { value:"Laser Printing",label:"Laser Printing" },

    { value:"PAD Printing",label:"PAD Printing" },

    { value:"Assembly",label:"Assembly" }

];

const showModelAndPrinted = to?.value !== "Store";

async function searchBox() {

  try {

    if (!tip || !side) {

      alert("Please select Tip Code and Side.");

      return;

    }

      let printedValue = "Blank";

      // If operator selected Printed, use it.
      // Otherwise assume Blank.
      if (printed?.value) {
        printedValue = printed.value;
      }

    const uniqueId = `${tip.value}_${side.value}_${printedValue}`;
    // console.log("========== SEARCH ==========");
    // console.log("Tip Code :", tip.value);
    // console.log("Side     :", side.value);
    // console.log("Printed  :", printedValue);
    // console.log("Unique ID:", uniqueId);

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

    alert("Search Failed");

  }

}

async function issueMaterial() {

  try {

    if (!boxExists) {

      alert("Inventory not found.");

      return;

    }

    if (!qty || Number(qty) <= 0) {

      alert("Enter a valid quantity.");

      return;

    }

    if (!operator) {

      alert("Enter operator name.");

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

      model: model?.value || "",
      printed: printed?.value || "Blank",

      qty: Number(qty),

      to: to.value,

      operator

    };

    const response = await api.post("/issue", payload);

    alert(response.data.message);

    await searchBox();

    setQty("");
    setOperator("");

  }

  catch (error: any) {

    console.error(error);

    alert(error.response?.data?.message || "Issue Failed");

  }

}

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-5xl mx-auto mt-6">
              <BackButton />  
      </div>

      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Issue Material</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold mb-2 block">To</label>
            <SearchableSelect
              options={destinationOptions}
              value={to}
              onChange={setTo}
              placeholder="Select Destination"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block">Tip Code</label>
            <SearchableSelect
              options={tipOptions}
              value={tip}
              onChange={(selected)=>{

                setTip(selected);

                setColour(selected?.colour || "");

              }}
              placeholder="Select Tip Code"
            />
          </div>

          <div>

            <label className="font-semibold mb-2 block">

              Colour

            </label>

            <input

              value={colour}

              disabled

              className="w-full border rounded-lg p-3 bg-gray-100"

            />

          </div>

          <div>
            <label className="font-semibold mb-2 block">Side</label>
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

          <div>
            <label className="font-semibold mb-2 block">Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter Quantity"
            />
          </div>
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
                      disabled
                      className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
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

                <h3 className="text-red-700 text-xl font-bold">
                  Inventory Not Found
                </h3>

                <p className="mt-2">
                  Material cannot be issued.
                </p>

              </div>

            )}

          </div>

        )}

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
            title="Issue Material"
            onClick={issueMaterial}
          />
        </div>
      </div>
    </div>
  );
}
