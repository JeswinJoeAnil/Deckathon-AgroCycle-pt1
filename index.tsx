
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { 
  Leaf, 
  Factory, 
  ChevronRight, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  MessageCircle, 
  Search, 
  ArrowLeft, 
  TrendingUp,
  MapPin,
  CheckCircle2,
  Package,
  CreditCard,
  User,
  X,
  Loader2,
  Trash2,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  LogOut,
  UserPlus,
  Sprout,
  TreePine,
  Trees,
  CloudSun
} from 'lucide-react';

// --- Types & Database Structure ---
type UserRole = 'none' | 'farmer' | 'buyer';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clusterName?: string;
  location?: string;
}

interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  registeredBy: string; // User ID
}

interface BiomassListing {
  id: string;
  type: string;
  quantity: number; 
  price: number;
  location: string;
  farmerName: string;
  date: string;
  status: 'available' | 'sold';
  ownerId: string;
}

// --- Mock Database Utility ---
const AgroDB = {
  getUsers: (): UserData[] => JSON.parse(localStorage.getItem('agro_users') || '[]'),
  saveUser: (user: UserData) => {
    const users = AgroDB.getUsers();
    localStorage.setItem('agro_users', JSON.stringify([...users, user]));
  },
  getFarmers: (): FarmerProfile[] => JSON.parse(localStorage.getItem('agro_cluster_farmers') || '[]'),
  saveFarmer: (farmer: FarmerProfile) => {
    const farmers = AgroDB.getFarmers();
    localStorage.setItem('agro_cluster_farmers', JSON.stringify([farmer, ...farmers]));
  },
  getListings: (): BiomassListing[] => JSON.parse(localStorage.getItem('agro_listings') || '[]'),
  saveListing: (listing: BiomassListing) => {
    const listings = AgroDB.getListings();
    localStorage.setItem('agro_listings', JSON.stringify([listing, ...listings]));
  },
  init: () => {
    if (!localStorage.getItem('agro_listings')) {
      localStorage.setItem('agro_listings', JSON.stringify([
        { id: '1', type: 'Paddy Straw', quantity: 45, price: 2500, location: 'Punjab, District A', farmerName: 'Ranjit Singh', date: '2024-10-24', status: 'available', ownerId: 'demo' },
        { id: '2', type: 'Wheat Hay', quantity: 20, price: 3200, location: 'Haryana, District B', farmerName: 'Amit Kumar', date: '2024-10-25', status: 'available', ownerId: 'demo' },
      ]));
    }
    if (!localStorage.getItem('agro_cluster_farmers')) {
      localStorage.setItem('agro_cluster_farmers', JSON.stringify([
        { id: 'f1', name: 'Balvinder Singh', location: 'Section 4, Village North', registeredBy: 'demo' },
        { id: 'f2', name: 'Gurpreet Kaur', location: 'Section 1, Village East', registeredBy: 'demo' }
      ]));
    }
  }
};

AgroDB.init();

// --- Reusable Nature Components ---

const LeafBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
    <Leaf size={240} className="absolute -top-12 -left-12 rotate-[35deg] text-green-900" />
    <Trees size={300} className="absolute -bottom-20 -right-20 text-green-900" />
    <Leaf size={180} className="absolute top-1/3 -left-20 rotate-180 text-green-900" />
    <Sprout size={150} className="absolute bottom-1/4 right-1/4 rotate-12 text-green-900" />
  </div>
);

const ProfileModal = ({ user, isOpen, onClose, onLogout }: { user: UserData, isOpen: boolean, onClose: () => void, onLogout: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#fdfcf9] w-full max-w-sm rounded-[56px] shadow-2xl overflow-hidden animate-slide border-8 border-white/50">
        <div className="bg-[#1a8a44] p-10 text-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20} /></button>
          <div className="w-24 h-24 rounded-[36px] bg-white/20 flex items-center justify-center mb-6 border border-white/30 shadow-inner">
            <User size={48} className="drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-white/70 text-xs uppercase tracking-[0.2em] font-black mt-1">{user.role === 'farmer' ? 'Cluster Manager' : 'Supply Partner'}</p>
        </div>
        <div className="p-10 space-y-8">
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700"><Mail size={22} /></div>
              <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email Identity</p><p className="text-sm font-bold text-gray-800">{user.email}</p></div>
            </div>
            {user.clusterName && (
               <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700"><Sprout size={22} /></div>
                 <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Cluster</p><p className="text-sm font-bold text-gray-800">{user.clusterName}</p></div>
               </div>
            )}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700"><ShieldCheck size={22} /></div>
              <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Trust Rating</p><p className="text-sm font-bold text-gray-800">High Reliability</p></div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-[28px] bg-red-50 text-red-600 font-black hover:bg-red-100 transition-all active:scale-95 shadow-lg shadow-red-900/5"
          >
            <LogOut size={20} /> Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Pages ---

const AuthPage = ({ role, defaultIsLogin = true, onAuthSuccess, onBack }: { role: UserRole, defaultIsLogin?: boolean, onAuthSuccess: (user: UserData) => void, onBack: () => void }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clusterName, setClusterName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const users = AgroDB.getUsers();
    
    if (isLogin) {
      const user = users.find(u => u.email === email && u.role === role);
      if (user) onAuthSuccess(user);
      else setError('Invalid credentials or role mismatch.');
    } else {
      if (users.find(u => u.email === email)) setError('Email already exists in our ecosystem.');
      else {
        const newUser: UserData = { 
          id: Math.random().toString(36).substr(2, 9), 
          name, 
          email, 
          role,
          clusterName: role === 'farmer' ? clusterName : undefined
        };
        AgroDB.saveUser(newUser);
        onAuthSuccess(newUser);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f2] flex flex-col items-center justify-center p-6 relative">
      <LeafBackground />
      <div className="w-full max-w-[440px] bg-white rounded-[64px] shadow-2xl overflow-hidden animate-slide border-[12px] border-green-50/30">
        <div className={`${role === 'farmer' ? 'bg-[#1a8a44]' : 'bg-stone-800'} p-12 text-white relative`}>
          <button onClick={onBack} className="absolute top-10 left-10 p-2.5 hover:bg-white/10 rounded-2xl transition-colors"><ArrowLeft size={20} /></button>
          <div className="flex flex-col items-center pt-4">
            <div className="bg-white/20 p-5 rounded-[32px] mb-6 shadow-2xl"><Sprout size={40} className="drop-shadow-lg" /></div>
            <h2 className="text-4xl font-bold tracking-tight text-center">{isLogin ? 'Welcome Back' : (role === 'farmer' ? 'Cluster Startup' : 'Join Supply')}</h2>
            <p className="text-white/70 text-sm mt-2 font-medium text-center">{role === 'farmer' ? 'Cultivating wealth from harvest residue.' : 'Securing bulk biomass for industrial scale.'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 text-[11px] font-black rounded-2xl border border-red-100 uppercase tracking-widest">{error}</div>}
          
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Personal Name</label>
                <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input required type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[28px] outline-none text-sm transition-all shadow-inner" /></div>
              </div>
              {role === 'farmer' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Cluster Identity</label>
                  <div className="relative"><Trees className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input required type="text" placeholder="Green Valley Punjab" value={clusterName} onChange={e => setClusterName(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[28px] outline-none text-sm transition-all shadow-inner" /></div>
                </div>
              )}
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input required type="email" placeholder="manager@agrocycle.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[28px] outline-none text-sm transition-all shadow-inner" /></div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
            <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[28px] outline-none text-sm transition-all shadow-inner" /></div>
          </div>
          <button type="submit" disabled={loading} className={`w-full py-6 rounded-[32px] font-black text-white shadow-2xl flex items-center justify-center gap-3 transition-all ${role === 'farmer' ? 'bg-[#1a8a44] hover:bg-[#146d35] shadow-green-900/20' : 'bg-stone-800 shadow-stone-900/20'} active:scale-95 disabled:opacity-70 text-lg uppercase tracking-widest`}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'Authenticate' : 'Launch Profile')}
          </button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-xs font-black text-green-800 hover:underline tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">{isLogin ? "Need a new portal? Register here" : "Already have access? Log in"}</button>
        </form>
      </div>
    </div>
  );
};

const RoleSelector = ({ onSelect }: { onSelect: (role: UserRole, isRegistering?: boolean) => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f7f9f7] relative">
      <LeafBackground />
      <div className="w-full max-w-[460px] space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-10">
          <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto shadow-2xl border-4 border-green-50 mb-6 group hover:rotate-6 transition-transform">
            <Leaf size={56} className="text-[#1a8a44]" fill="currentColor" />
          </div>
          <h1 className="text-6xl font-black text-green-950 tracking-tighter">AgroCycle</h1>
          <p className="text-green-800/60 font-bold uppercase tracking-[0.4em] text-xs">Circular Bio-Economy</p>
        </div>

        <div className="space-y-4">
          <button onClick={() => onSelect('farmer', false)} className="w-full bg-white hover:bg-green-50 p-8 rounded-[48px] flex items-center gap-6 group transition-all shadow-xl shadow-green-900/5 border border-green-50/50 hover:border-green-300">
            <div className="w-20 h-20 rounded-[32px] bg-green-100 flex items-center justify-center text-green-700 group-hover:scale-110 transition-transform"><User size={36} /></div>
            <div className="text-left flex-1"><h3 className="font-black text-green-950 text-xl tracking-tight">Login Cluster</h3><p className="text-xs text-green-800/50 font-bold uppercase tracking-widest">Existing Farmer Groups</p></div>
            <ChevronRight className="text-green-200 group-hover:text-green-500 group-hover:translate-x-1 transition-all" size={28} />
          </button>

          <button onClick={() => onSelect('buyer', false)} className="w-full bg-white hover:bg-stone-50 p-8 rounded-[48px] flex items-center gap-6 group transition-all shadow-xl shadow-stone-900/5 border border-stone-50/50 hover:border-stone-300">
            <div className="w-20 h-20 rounded-[32px] bg-stone-100 flex items-center justify-center text-stone-700 group-hover:scale-110 transition-transform"><Factory size={36} /></div>
            <div className="text-left flex-1"><h3 className="font-black text-stone-950 text-xl tracking-tight">Buyer Portal</h3><p className="text-xs text-stone-800/50 font-bold uppercase tracking-widest">Industrial Sourcing</p></div>
            <ChevronRight className="text-stone-200 group-hover:text-stone-500 group-hover:translate-x-1 transition-all" size={28} />
          </button>

          <div className="relative py-4 flex items-center justify-center">
             <div className="h-[1px] w-full bg-green-900/10 absolute"></div>
             <span className="bg-[#f7f9f7] px-6 text-[10px] font-black text-green-900/30 uppercase tracking-[0.5em] relative">Network Expansion</span>
          </div>

          <button onClick={() => onSelect('farmer', true)} className="w-full bg-[#1a8a44] hover:bg-[#146d35] p-8 rounded-[48px] flex items-center gap-6 group transition-all shadow-2xl shadow-green-900/20 border border-green-400/20">
            <div className="w-20 h-20 rounded-[32px] bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform"><PlusCircle size={36} /></div>
            <div className="text-left flex-1"><h3 className="font-black text-white text-xl tracking-tight">Register New Cluster</h3><p className="text-xs text-white/50 font-bold uppercase tracking-widest">Start a new Bio-Hub</p></div>
            <ChevronRight className="text-white/40 group-hover:text-white group-hover:translate-x-2 transition-all" size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FarmerDashboard = ({ user, onLogout }: { user: UserData, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'farmers' | 'chat'>('dashboard');
  const [farmers, setFarmers] = useState<FarmerProfile[]>(AgroDB.getFarmers());
  const [showAddListing, setShowAddListing] = useState(false);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [listings, setListings] = useState<BiomassListing[]>(AgroDB.getListings());

  const handleAddListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newListing: BiomassListing = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.get('type') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      location: user.clusterName || 'Regional Hub',
      farmerName: formData.get('farmer') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'available',
      ownerId: user.id
    };
    AgroDB.saveListing(newListing);
    setListings([newListing, ...listings]);
    setShowAddListing(false);
  };

  const handleAddFarmer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFarmer: FarmerProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      registeredBy: user.id
    };
    AgroDB.saveFarmer(newFarmer);
    setFarmers([newFarmer, ...farmers]);
    setShowAddFarmer(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f7f9f7] flex flex-col relative overflow-hidden">
      <LeafBackground />
      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} />

      <div className="bg-[#1a8a44] p-10 text-white pt-16 rounded-b-[72px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Sprout size={120} /></div>
        <div className="flex justify-between items-center mb-10 relative z-10">
          <button onClick={onLogout} className="p-3.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all shadow-lg active:scale-95"><LogOut size={20} /></button>
          <div className="text-center"><h2 className="font-black tracking-[0.2em] text-[10px] uppercase opacity-70">AgroCycle Hub</h2><p className="font-black text-sm tracking-tight">{user.clusterName || 'Active Cluster'}</p></div>
          <button onClick={() => setIsProfileOpen(true)} className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all shadow-xl"><User size={28} /></button>
        </div>
        <div className="pb-8 relative z-10">
          <p className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em] mb-2 flex items-center gap-2"><CloudSun size={12} /> Live Cluster Portal</p>
          <h1 className="text-4xl font-bold tracking-tight">Namaste, <span className="underline decoration-green-300 underline-offset-8">{user.name.split(' ')[0]}</span></h1>
        </div>
      </div>

      <div className="px-6 -mt-10 flex-1 pb-36 overflow-y-auto relative z-20">
        {activeTab === 'dashboard' && (
          <div className="animate-slide space-y-8 pt-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-green-900/5 border border-green-50/50 flex flex-col justify-between h-40">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Ready MT</p>
                <div className="flex items-end justify-between">
                  <h2 className="text-4xl font-black text-green-700 tracking-tighter">12.4</h2>
                  <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-700"><Zap size={20} /></div>
                </div>
              </div>
              <div className="bg-[#1a8a44] p-8 rounded-[48px] shadow-2xl shadow-green-900/20 border border-green-400/20 flex flex-col justify-between h-40 text-white">
                <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Earnings</p>
                <div className="flex items-end justify-between">
                  <h2 className="text-3xl font-black tracking-tighter">₹4.2k</h2>
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white"><TrendingUp size={20} /></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-green-950 text-2xl tracking-tight">Market Board</h3>
              <button onClick={() => setShowAddListing(true)} className="bg-green-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-800 shadow-xl shadow-green-900/20 active:scale-95 transition-all"><PlusCircle size={16} /> List</button>
            </div>

            <div className="space-y-5">
              {listings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-green-50">
                  <Package size={48} className="mx-auto text-green-50 mb-4" />
                  <p className="text-green-900/30 text-[10px] font-black uppercase tracking-widest">No Active Stock</p>
                </div>
              ) : listings.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[48px] shadow-sm border border-green-50 flex items-center gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="w-20 h-20 rounded-[32px] bg-[#f8fbf8] flex items-center justify-center text-green-700 shadow-inner group-hover:rotate-6 transition-transform"><Sprout size={32} /></div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-green-950 tracking-tight">{item.type}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1"><User size={10} /> {item.farmerName}</p>
                    <p className="text-xs font-bold text-green-600 mt-2 bg-green-50 w-fit px-3 py-1 rounded-full">{item.quantity} Metric Tons</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'farmers' && (
          <div className="animate-slide pt-6 space-y-6">
             <div className="flex items-center justify-between px-1 mb-2">
               <h3 className="font-black text-green-950 text-2xl tracking-tight">Farm Registry</h3>
               <button onClick={() => setShowAddFarmer(true)} className="text-[10px] font-black uppercase tracking-widest text-green-700 flex items-center gap-2 hover:underline"><UserPlus size={16} /> Register</button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {farmers.map(f => (
                 <div key={f.id} className="bg-white p-7 rounded-[48px] shadow-sm border border-green-50 flex items-center gap-6 hover:shadow-lg transition-all">
                   <div className="w-16 h-16 bg-amber-50 rounded-[24px] flex items-center justify-center text-amber-700 shadow-inner"><User size={28} /></div>
                   <div><h4 className="font-black text-green-950 text-lg tracking-tight">{f.name}</h4><p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5"><MapPin size={12} className="text-green-500" /> {f.location}</p></div>
                 </div>
               ))}
               
               <button onClick={() => setShowAddFarmer(true)} className="w-full border-4 border-dashed border-green-100 p-12 rounded-[56px] text-green-200 text-sm font-black uppercase tracking-widest hover:border-green-300 hover:text-green-600 flex flex-col items-center gap-4 transition-all hover:bg-white group">
                 <div className="w-20 h-20 rounded-[32px] bg-green-50 flex items-center justify-center text-green-200 group-hover:text-green-600 transition-colors"><UserPlus size={40} /></div>
                 Expand Cluster Registry
               </button>
             </div>
          </div>
        )}

        {activeTab === 'chat' && <div className="pt-6 h-[600px]"><AgroChat role="farmer" /></div>}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl flex justify-around p-8 rounded-t-[64px] shadow-[0_-15px_60px_rgba(26,138,68,0.15)] z-[100] border-t border-green-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'text-green-700 scale-125' : 'text-gray-300'}`}><LayoutDashboard size={26} strokeWidth={3} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'dashboard' ? 'Board' : ''}</span></button>
        <button onClick={() => setActiveTab('farmers')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'farmers' ? 'text-green-700 scale-125' : 'text-gray-300'}`}><Trees size={26} strokeWidth={3} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'farmers' ? 'Registry' : ''}</span></button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'chat' ? 'text-green-700 scale-125' : 'text-gray-300'}`}><MessageCircle size={26} strokeWidth={3} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'chat' ? 'AI Hub' : ''}</span></button>
      </nav>

      {/* Forms Overlay */}
      {showAddListing && (
        <div className="fixed inset-0 bg-green-950/50 backdrop-blur-md z-[200] flex items-end sm:items-center p-0 sm:p-6 animate-in fade-in duration-300">
          <form onSubmit={handleAddListing} className="bg-white w-full max-w-md mx-auto rounded-t-[64px] sm:rounded-[64px] p-12 animate-slide shadow-2xl border-8 border-white/50">
            <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black text-green-950 tracking-tight">Market Listing</h2><button type="button" onClick={() => setShowAddListing(false)} className="p-3 bg-gray-50 rounded-2xl"><X /></button></div>
            <div className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Source Farmer</label><select name="farmer" required className="w-full bg-gray-50 p-5 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold">{farmers.map(f => <option key={f.id}>{f.name}</option>)}</select></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Material Type</label><select name="type" required className="w-full bg-gray-50 p-5 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold"><option>Paddy Straw</option><option>Wheat Hay</option><option>Coconut Husk</option><option>Sugarcane Bagasse</option></select></div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Volume (MT)</label><input name="quantity" required type="number" step="0.1" placeholder="0.0" className="w-full bg-gray-50 p-5 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Base Rate (₹)</label><input name="price" required type="number" placeholder="₹" className="w-full bg-gray-50 p-5 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold" /></div>
              </div>
              <button type="submit" className="w-full bg-green-700 text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-green-900/20 text-lg mt-6 active:scale-95 transition-all">Authenticate & Post</button>
            </div>
          </form>
        </div>
      )}

      {showAddFarmer && (
        <div className="fixed inset-0 bg-green-950/50 backdrop-blur-md z-[200] flex items-end sm:items-center p-0 sm:p-6 animate-in fade-in duration-300">
          <form onSubmit={handleAddFarmer} className="bg-white w-full max-w-md mx-auto rounded-t-[64px] sm:rounded-[64px] p-12 animate-slide shadow-2xl border-8 border-white/50">
            <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black text-green-950 tracking-tight">Register Farmer</h2><button type="button" onClick={() => setShowAddFarmer(false)} className="p-3 bg-gray-50 rounded-2xl"><X /></button></div>
            <div className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Legal Name</label><div className="relative"><User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} /><input required name="name" type="text" placeholder="Ramesh Chandra" className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold shadow-inner" /></div></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Farm Location Detail</label><div className="relative"><MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} /><input required name="location" type="text" placeholder="Village North, Plot 42" className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-[28px] outline-none border-2 border-transparent focus:border-green-500 font-bold shadow-inner" /></div></div>
              <button type="submit" className="w-full bg-amber-700 text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-amber-900/20 text-lg mt-6 active:scale-95 transition-all">Secure Entry</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const BuyerMarketplace = ({ user, onLogout }: { user: UserData, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'history' | 'assistant'>('market');
  const [checkoutItem, setCheckoutItem] = useState<BiomassListing | null>(null);
  const [purchased, setPurchased] = useState<BiomassListing[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [listings] = useState<BiomassListing[]>(AgroDB.getListings());

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col pb-32 relative overflow-hidden">
      <LeafBackground />
      <ProfileModal user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} />

      <header className="glass-nav sticky top-0 z-40 px-8 py-6 flex items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-5">
          <button onClick={onLogout} className="w-12 h-12 flex items-center justify-center bg-stone-50 rounded-[20px] hover:bg-stone-100 transition-all shadow-sm"><LogOut size={20} className="text-stone-600" /></button>
          <div><h1 className="text-2xl font-black text-stone-900 tracking-tight">Sourcing Desk</h1><p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em]">{user.name}</p></div>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="w-14 h-14 rounded-[24px] bg-stone-900 flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-all border-4 border-white"><Factory size={24} /></button>
      </header>

      <div className="max-w-7xl mx-auto w-full px-8 pt-12">
        {activeTab === 'market' && (
          <div className="animate-slide grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map(item => (
              <div key={item.id} className="bg-white rounded-[56px] p-10 shadow-xl shadow-stone-900/5 border border-stone-50 hover:shadow-2xl hover:border-blue-100 transition-all group relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] -mr-6 -mt-6 rotate-12"><Sprout size={140} /></div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 rounded-[32px] bg-blue-50 flex items-center justify-center text-blue-700 transition-transform group-hover:rotate-12 shadow-inner"><Zap size={36} /></div>
                  <span className="text-[10px] font-black px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full uppercase tracking-widest shadow-sm">{item.type}</span>
                </div>
                <h3 className="text-3xl font-black text-stone-950 mb-2 tracking-tight">{item.quantity} MT Volume</h3>
                <p className="text-sm text-stone-400 font-bold flex items-center gap-2 mb-8"><MapPin size={18} className="text-stone-200" /> {item.location}</p>
                <div className="border-t border-stone-50 pt-8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-stone-300 font-black uppercase tracking-widest mb-1">Contract Total</p>
                    <p className="text-3xl font-black text-stone-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setCheckoutItem(item)} className="bg-stone-900 text-white px-10 py-4 rounded-[24px] font-black text-sm shadow-2xl hover:bg-stone-800 transition-all uppercase tracking-widest">Secure</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
           <div className="animate-slide max-w-3xl mx-auto space-y-8 pt-6">
             <h2 className="text-4xl font-black text-stone-950 tracking-tight flex items-center gap-4">Procurement History <div className="h-[2px] flex-1 bg-stone-100 rounded-full"></div></h2>
             {purchased.length === 0 ? (
               <div className="text-center py-40 bg-white rounded-[64px] border-4 border-dashed border-stone-50 shadow-inner">
                 <Package size={80} className="mx-auto text-stone-50 mb-6" />
                 <p className="text-stone-200 font-black tracking-[0.3em] uppercase text-xs">Awaiting First Contract</p>
               </div>
             ) : purchased.map((p, idx) => (
               <div key={idx} className="bg-white p-10 rounded-[48px] shadow-xl shadow-stone-900/5 border border-stone-50 flex justify-between items-center hover:border-blue-200 transition-all group">
                 <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-[32px] bg-green-50 flex items-center justify-center text-green-500 shadow-inner group-hover:scale-105 transition-transform"><CheckCircle2 size={40} /></div>
                   <div><h4 className="font-black text-2xl text-stone-950 tracking-tight">{p.type}</h4><p className="text-xs text-stone-300 font-black tracking-widest uppercase">MANIFEST #{p.id}</p></div>
                 </div>
                 <div className="text-right"><p className="text-3xl font-black text-stone-950 tracking-tighter">₹{(p.price * p.quantity).toLocaleString()}</p><span className="text-[10px] font-black text-green-600 tracking-[0.2em] uppercase bg-green-50 px-3 py-1 rounded-full">Cleared</span></div>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'assistant' && <div className="max-w-4xl mx-auto h-[700px] pt-4"><AgroChat role="buyer" /></div>}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-stone-100 flex justify-center gap-20 p-8 rounded-t-[72px] shadow-[0_-20px_80px_rgba(28,25,23,0.1)] z-[100]">
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'market' ? 'text-blue-700 scale-125' : 'text-stone-300'}`}><Search size={28} strokeWidth={4} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'market' ? 'Explore' : ''}</span></button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'history' ? 'text-blue-700 scale-125' : 'text-stone-300'}`}><History size={28} strokeWidth={4} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'history' ? 'Ledger' : ''}</span></button>
        <button onClick={() => setActiveTab('assistant')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'assistant' ? 'text-blue-700 scale-125' : 'text-stone-300'}`}><MessageCircle size={28} strokeWidth={4} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{activeTab === 'assistant' ? 'AI Guide' : ''}</span></button>
      </nav>

      {checkoutItem && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[72px] p-14 animate-slide shadow-2xl border-[12px] border-white/50">
             <h2 className="text-4xl font-black mb-10 text-stone-950 tracking-tight">Final Procurement</h2>
             <div className="space-y-6 mb-12 bg-[#fdfcf9] p-10 rounded-[48px] border border-stone-50">
               <div className="flex justify-between text-sm"><span className="text-stone-400 font-black uppercase tracking-widest">Bio-Material Cost</span><span className="font-black text-stone-950">₹{(checkoutItem.price * checkoutItem.quantity).toLocaleString()}</span></div>
               <div className="flex justify-between text-sm"><span className="text-stone-400 font-black uppercase tracking-widest">Network Logistics</span><span className="font-black text-stone-950">₹4,000</span></div>
               <div className="flex justify-between text-3xl border-t border-stone-200 pt-8 mt-4"><span className="font-black tracking-tight">Net Payable</span><span className="font-black text-blue-700 tracking-tighter">₹{(checkoutItem.price * checkoutItem.quantity + 4000).toLocaleString()}</span></div>
             </div>
             <div className="flex gap-6">
               <button onClick={() => setCheckoutItem(null)} className="flex-1 bg-stone-50 py-6 rounded-[32px] font-black text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all uppercase tracking-widest">Abort</button>
               <button onClick={() => { setPurchased([checkoutItem, ...purchased]); setCheckoutItem(null); setActiveTab('history'); }} className="flex-[2] bg-stone-950 text-white py-6 rounded-[32px] font-black shadow-2xl hover:bg-stone-800 transition-all uppercase tracking-[0.2em]">Authorize</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AgroChat = ({ role }: { role: UserRole }) => {
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([
    { role: 'model', text: `Greetings! I'm the AgroCycle Intelligence Core. How can I optimize your ${role === 'farmer' ? 'cluster residue management' : 'industrial biomass procurement'} operations today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey:"AIzaSyDxARHPAhUC5aIn080RqerJJC5FoF00DcM" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: `Nature-themed authoritative expert on bio-economy for ${role}s. Deeply knowledgeable on agriculture, logistics, and carbon offsets.` }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Connection glitch in the network." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Bio-intelligence core is recalibrating. Try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-[64px] overflow-hidden border border-green-50 shadow-2xl animate-slide relative">
      <div className="absolute top-0 right-0 p-12 opacity-[0.06] pointer-events-none rotate-12"><Trees size={120} /></div>
      <div className="bg-[#1a8a44] p-8 text-white font-black text-sm flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4"><Sprout size={24} className="drop-shadow-md" /> AgroCycle Intelligence</div>
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-8">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-7 rounded-[40px] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-green-700 text-white rounded-br-none' : 'bg-[#fdfcf9] text-gray-800 rounded-bl-none border border-green-50'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-green-900/30 font-black uppercase tracking-[0.4em] px-4 animate-pulse flex items-center gap-3"><Sprout size={14} className="animate-bounce" /> Processing Neural Data...</div>}
      </div>
      <div className="p-8 bg-[#fdfcf9] border-t border-green-50 flex gap-4">
        <input type="text" placeholder="Query the Bio-Intelligence Hub..." className="flex-1 bg-white p-5 rounded-[28px] border-none outline-none shadow-inner focus:ring-4 focus:ring-green-500/10 font-bold" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <button onClick={handleSend} className="bg-green-700 text-white p-5 rounded-[24px] shadow-2xl hover:bg-green-800 transition-all active:scale-90"><ChevronRight size={24} /></button>
      </div>
    </div>
  );
};

const App = () => {
  const [viewState, setViewState] = useState<{ role: UserRole, isRegistering: boolean }>({ role: 'none', isRegistering: false });
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('agro_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('agro_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setViewState({ role: 'none', isRegistering: false });
    localStorage.removeItem('agro_session');
  };

  useEffect(() => {
    if (user) {
      setViewState({ role: user.role, isRegistering: false });
    }
  }, [user]);

  return (
    <div className="min-h-screen font-sans selection:bg-green-200 text-stone-900 antialiased">
      {!user && viewState.role === 'none' && <RoleSelector onSelect={(role, isRegistering) => setViewState({ role, isRegistering: !!isRegistering })} />}
      {!user && viewState.role !== 'none' && <AuthPage role={viewState.role} defaultIsLogin={!viewState.isRegistering} onAuthSuccess={handleAuthSuccess} onBack={() => setViewState({ role: 'none', isRegistering: false })} />}
      {user && user.role === 'farmer' && <FarmerDashboard user={user} onLogout={handleLogout} />}
      {user && user.role === 'buyer' && <BuyerMarketplace user={user} onLogout={handleLogout} />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
