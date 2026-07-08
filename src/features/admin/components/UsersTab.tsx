import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Search, Trash2, User } from "lucide-react";

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: "error" | "success", text: string} | null>(null);

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, "users"));
      if (!q.empty) {
        setUsers(q.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Gagal get users:", err);
      showMessage("error", "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((u) => u.id !== id));
      showMessage("success", "Data user berhasil dihapus!");
      setDeletingId(null);
    } catch (error: any) {
      console.error("Gagal menghapus user:", error);
      showMessage("error", "Gagal menghapus data user: " + error.message);
      setDeletingId(null);
    }
  };

  const filtered = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      {message && (
        <div className={`mb-6 p-4 rounded-xl font-bold border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">Data User</h1>
          <p className="text-slate-500 font-serif">Melihat data user yang sudah mendaftar</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Cari email / username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button onClick={fetchUsers} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">Belum ada user yang terdaftar atau cocok dengan pencarian.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-slate-800">{user.username || "Tidak ada nama"}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.email || "-"}</td>
                    <td className="p-4 text-center">
                      {deletingId === user.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-slate-500">Yakin?</span>
                          <button onClick={() => handleDeleteUser(user.id)} className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors">Ya</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors">Batal</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeletingId(user.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex"
                          title="Hapus Data User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
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
