import { useEffect, useState } from "react";
import Header from "../components/Header";
import PageCard from "../components/PageCard";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
} from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();
  const [summary, setSummary] = useState({

    totalInventory:0,

    totalBoxes:0,

    todayReceive:0,

    todayIssue:0,

    lowStock:0

});

useEffect(()=>{

    loadDashboard();

},[]);

async function loadDashboard(){

    try{

        const response = await api.get("/dashboard");

        setSummary(response.data);

    }

    catch(error){

        console.log(error);

    }

}

  return (

    <div className="min-h-screen bg-slate-100">

      <Header />

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">

          Temple Tip Inventory

        </h1>

        <div className="grid grid-cols-5 gap-4 mb-10">

<div className="bg-white rounded-xl shadow p-5">

<p className="text-gray-500">

Inventory

</p>

<h2 className="text-3xl font-bold">

{summary.totalInventory}

</h2>

</div>

<div className="bg-white rounded-xl shadow p-5">

<p className="text-gray-500">

Boxes

</p>

<h2 className="text-3xl font-bold">

{summary.totalBoxes}

</h2>

</div>

<div className="bg-white rounded-xl shadow p-5">

<p className="text-gray-500">

Today's Receive

</p>

<h2 className="text-3xl font-bold">

{summary.todayReceive}

</h2>

</div>

<div className="bg-white rounded-xl shadow p-5">

<p className="text-gray-500">

Today's Issue

</p>

<h2 className="text-3xl font-bold">

{summary.todayIssue}

</h2>

</div>

<div className="bg-white rounded-xl shadow p-5">

<p className="text-gray-500">

Low Stock

</p>

<h2 className="text-3xl font-bold text-red-600">

{summary.lowStock}

</h2>

</div>

</div>

        <div className="grid lg:grid-cols-3 gap-8">

          <PageCard
            title="Receive Material"
            subtitle="Receive material into fitting inventory"
            icon={<ArrowDownCircle size={60} />}
            onClick={() => navigate("/receive")}
          />

          <PageCard
            title="Issue Material"
            subtitle="Issue material from fitting inventory"
            icon={<ArrowUpCircle size={60} />}
            onClick={() => navigate("/issue")}
          />

          <PageCard
            title="Inventory"
            subtitle="Live inventory status"
            icon={<Boxes size={60} />}
            onClick={() => navigate("/inventory")}
          />

        </div>

      </div>

    </div>

  );

}
