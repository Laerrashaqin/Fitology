import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { LogOut, Package, ShieldCheck, Users } from "lucide-react";
import { type Language } from "../../../types";
import MarketplaceTab from "./MarketplaceTab";
import AksesAdminTab from "./AksesAdminTab";
import UsersTab from "./UsersTab";

export default function AdminDashboard({ lang }: { lang: Language }) {
  const [activeTab, setActiveTab] = useState<"marketplace" | "akses" | "users">("marketplace");

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-10 shrink-0">
        <div className="p-6 border-b border-slate-100 mb-6 bg-emerald-50/30">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">DASHBOARD</div>
          <div className="font-black text-xl tracking-tighter text-emerald-700">FITOLOGY<span className="text-orange-500">.</span> Admin</div>
        </div>
        <div className="p-4 flex-grow space-y-2">
          <button onClick={() => setActiveTab("marketplace")} className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'marketplace' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Package className="w-5 h-5" />
            Marketplace
          </button>
          <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'users' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Users className="w-5 h-5" />
            Data User
          </button>
          <button onClick={() => setActiveTab("akses")} className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'akses' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <ShieldCheck className="w-5 h-5" />
            Akses Admin
          </button>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all cursor-pointer">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto max-h-screen">
        {activeTab === "marketplace" && <MarketplaceTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "akses" && <AksesAdminTab />}
      </div>
    </div>
  );
}
