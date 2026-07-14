import { useEffect, useState } from "react";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import api from "../services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {

    try {

      const response = await api.get("/inventory");

      setInventory(response.data);

    }

    catch (error) {

      console.error(error);

    }

  }

  const filteredInventory = inventory.filter((item) => {

    const value = search.toLowerCase();

    return (

      item.barcode?.toLowerCase().includes(value) ||

      item.tipCode?.toLowerCase().includes(value) ||

      item.side?.toLowerCase().includes(value) ||

      item.printed?.toLowerCase().includes(value)

    );

  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-5xl mx-auto mt-6">
              <BackButton />  
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Inventory</h2>

        <div className="flex gap-4 mb-6">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Barcode / Tip Code"
            className="flex-1 border rounded-lg p-3"
          />

          <div className="w-40">

            <PrimaryButton
              title="Refresh"
              onClick={loadInventory}
            />

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-4 font-semibold">Barcode</th>
                <th className="p-4 font-semibold">Tip Code</th>
                <th className="p-4 font-semibold">Side</th>
                <th className="p-4 font-semibold">Printed</th>
                <th className="p-4 font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (

                <tr>

                  <td
                    className="p-4 text-slate-500"
                    colSpan={5}
                  >

                    No inventory data available.

                  </td>

                </tr>

              ) : (

                filteredInventory.map((item, index) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="p-4">{item.barcode}</td>

                    <td className="p-4">{item.tipCode}</td>

                    <td className="p-4">{item.side}</td>

                    <td className="p-4">{item.printed}</td>

                    <td className="p-4">{item.qty}</td>

                  </tr>

                ))

              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
