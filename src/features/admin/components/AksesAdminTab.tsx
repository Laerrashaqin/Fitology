import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../../firebase-applet-config.json";

export default function AksesAdminTab() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: "", email: "", password: "" });
  
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editAdminForm, setEditAdminForm] = useState({ username: "", email: "", password: "" });

  const [message, setMessage] = useState<{type: "error" | "success", text: string} | null>(null);

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchAdmins = async () => {
    try {
      const q = await getDocs(collection(db, "admin_users"));
      if (!q.empty) {
        setAdmins(q.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Gagal get admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSaveAdmin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.email || !adminForm.password) {
        showMessage("error", "Harap lengkapi username, email, dan password!");
        return;
    }
    
    try {
      showMessage("success", "Sedang menambahkan...");
      const secondaryAppUrl = "adminCreationApp" + Date.now();
      const secondaryApp = initializeApp(firebaseConfig, secondaryAppUrl);
      const secondaryAuth = getAuth(secondaryApp);
      await setPersistence(secondaryAuth, inMemoryPersistence);
      
      const res = await createUserWithEmailAndPassword(secondaryAuth, adminForm.email, adminForm.password);
      
      await setDoc(doc(db, "users", res.user.uid), {
        email: adminForm.email,
        username: adminForm.username
      });
      
      await setDoc(doc(db, "admin_users", res.user.uid), {
        email: adminForm.email,
        username: adminForm.username,
        role: "admin",
        createdAt: new Date().toISOString()
      });

      setAdminForm({ username: "", email: "", password: "" });
      setIsAddingAdmin(false);
      await fetchAdmins();
      
      await signOut(secondaryAuth);
      showMessage("success", "Admin berhasil ditambahkan!");
    } catch (error: any) {
      console.error("Gagal menambah admin", error);
      showMessage("error", "Gagal menambah admin: " + error.message);
    }
  };

  const startEditAdmin = (admin: any) => {
    setEditingAdminId(admin.id);
    setEditAdminForm({ username: admin.username, email: admin.email, password: "" });
  };

  const saveEditAdmin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editingAdminId) return;
    if (!editAdminForm.username) {
        showMessage("error", "Username tidak boleh kosong!");
        return;
    }
    try {
      showMessage("success", "Sedang mengupdate...");
      await updateDoc(doc(db, "admin_users", editingAdminId), {
        username: editAdminForm.username
      });
      await updateDoc(doc(db, "users", editingAdminId), {
        username: editAdminForm.username
      });
      setEditingAdminId(null);
      await fetchAdmins();
      showMessage("success", "Admin berhasil diupdate!");
    } catch (err: any) {
      console.error("Gagal menyimpan admin:", err);
      showMessage("error", "Gagal mengupdate admin: " + err.message);
    }
  };

  const cancelEditAdmin = () => {
    setEditingAdminId(null);
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      showMessage("success", "Sedang menghapus...");
      await deleteDoc(doc(db, "admin_users", id));
      await fetchAdmins();
      showMessage("success", "Akses admin berhasil dicabut!");
    } catch (error: any) {
      console.error("Gagal menghapus admin:", error);
      showMessage("error", "Gagal mencabut akses admin: " + error.message);
    }
  };

  return (
    <>
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg font-bold text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">Akses Admin</h1>
          <p className="text-slate-500 font-serif">Kelola admin dengan akses ke dashboard ini</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Cari admin..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button onClick={() => setIsAddingAdmin(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Tambah Admin
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isAddingAdmin && (
                <tr className="bg-emerald-50">
                  <td className="p-4">
                    <input 
                      value={adminForm.username} 
                      onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
                      onChange={(e) => setAdminForm({...adminForm, username: e.target.value})} 
                      placeholder="Username" 
                      className="w-full px-3 py-2 border rounded-lg text-sm select-text" 
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <input 
                        value={adminForm.email} 
                        type="email"
                        onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} 
                        placeholder="Email" 
                        className="w-full px-3 py-2 border rounded-lg text-sm select-text" 
                      />
                      <input 
                        value={adminForm.password} 
                        type="password"
                        onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} 
                        placeholder="Password Baru" 
                        className="w-full px-3 py-2 border rounded-lg text-sm select-text" 
                      />
                    </div>
                  </td>
                  <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Admin
                      </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                      <button type="button" onClick={handleSaveAdmin} className="text-emerald-600 font-bold hover:underline cursor-pointer">Simpan</button>
                      <button type="button" onClick={() => setIsAddingAdmin(false)} className="text-slate-500 font-bold hover:underline cursor-pointer">Batal</button>
                  </td>
                </tr>
              )}
              {admins.filter(a => a.username?.toLowerCase().includes(adminSearchQuery.toLowerCase()) || a.email?.toLowerCase().includes(adminSearchQuery.toLowerCase())).map(admin => {
                if (editingAdminId === admin.id) {
                    return (
                      <tr key={admin.id} className="bg-slate-50">
                        <td className="p-4">
                          <input 
                            value={editAdminForm.username} 
                            onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
                            onChange={(e) => setEditAdminForm({...editAdminForm, username: e.target.value})} 
                            placeholder="Username" 
                            className="w-full px-3 py-2 border rounded-lg text-sm select-text" 
                          />
                        </td>
                        <td className="p-4 text-slate-500 text-xs italic">
                          {admin.email} (Tidak bisa diubah)
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {admin.role || "Admin"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button type="button" onClick={saveEditAdmin} className="text-emerald-600 font-bold hover:underline cursor-pointer">Simpan</button>
                          <button type="button" onClick={cancelEditAdmin} className="text-slate-500 font-bold hover:underline cursor-pointer">Batal</button>
                        </td>
                      </tr>
                    )
                }
                return (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{admin.username}</td>
                  <td className="p-4 text-slate-600">{admin.email}</td>
                  <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {admin.role || "Admin"}
                      </span>
                  </td>
                  <td className="p-4 text-right">
                      {admin.email !== "rozinromdhoni281116@gmail.com" && (
                        <>
                          <button type="button" onClick={() => startEditAdmin(admin)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                          <button type="button" onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
