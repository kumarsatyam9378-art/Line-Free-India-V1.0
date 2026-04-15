import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaQrcode,
  FaWhatsapp,
  FaBell,
  FaLayerGroup
} from 'react-icons/fa';


export default function Sidebar() {
  const { businessProfile, signOutUser, user } = useApp();
  const nav = useNavigate();
  const loc = useLocation();

  const isBusiness = loc.pathname.startsWith('/barber');
  if (!isBusiness || !user) return null;

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/barber/home', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FaCalendarAlt, label: 'Calendar', path: '/barber/calendar', gradient: 'from-purple-500 to-pink-500' },
    { icon: FaUsers, label: 'Customers', path: '/barber/customers', gradient: 'from-green-500 to-emerald-500' },
    { icon: FaChartBar, label: 'Analytics', path: '/barber/analytics-pro', gradient: 'from-orange-500 to-red-500' },
    { icon: FaLayerGroup, label: 'Staff Hub', path: '/barber/staff', gradient: 'from-indigo-500 to-purple-500' },
    { icon: FaWhatsapp, label: 'Communications', path: '/barber/whatsapp', gradient: 'from-green-400 to-green-600' },
    { icon: FaQrcode, label: 'Digital QR', path: '/barber/qr', gradient: 'from-violet-500 to-fuchsia-500' },
    { icon: FaBell, label: 'Alert Center', path: '/barber/notifications', gradient: 'from-yellow-500 to-orange-500' },
    { icon: FaCog, label: 'Settings', path: '/barber/profile', gradient: 'from-gray-500 to-slate-600' },
  ];

  const handleLogout = async () => {
    await signOutUser();
    nav('/');
  };

  return (
    <div className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-50 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-secondary/30 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center gap-4 mb-10 px-2 group"
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-xl border border-white/20 transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-2xl font-black text-white relative z-10">L</span>
        </motion.div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black text-white tracking-[2px] uppercase whitespace-nowrap leading-none">Line Free India</span>
          <span className="text-[9px] font-black uppercase tracking-[2px] mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Command OS v4.0</span>
        </div>
      </motion.div>

      {/* Navigation Space */}
      <nav className="relative flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const active = loc.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav(item.path)}
              className={`relative w-full flex items-center gap-4 px-5 py-4 transition-all duration-300 rounded-2xl group overflow-hidden ${
                active 
                  ? 'bg-gradient-to-r from-white/20 to-white/10 shadow-lg' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Always visible gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-2xl`} />
              
              {/* Active indicator */}
              {active && (
                <motion.div 
                  layoutId="activePillSide"
                  className={`absolute left-0 w-1.5 h-8 bg-gradient-to-b ${item.gradient} rounded-full shadow-lg`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon with gradient background - ALWAYS VISIBLE */}
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-lg`}
              >
                <item.icon className="text-lg text-white" />
              </motion.div>
              
              <span className={`text-sm font-black tracking-wide transition-colors ${
                active ? 'text-white' : 'text-white/80 group-hover:text-white'
              }`}>
                {item.label}
              </span>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* AI & Profile Footer */}
      <div className="relative mt-auto pt-6 border-t border-white/10">
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 transition-all font-black group overflow-hidden shadow-lg shadow-red-500/20"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity" />
          
          <motion.div
            whileHover={{ rotate: 12 }}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
          >
            <FaSignOutAlt className="text-lg text-white" />
          </motion.div>
          
          <span className="text-xs uppercase tracking-[3px] text-white relative z-10">Sign Out</span>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping opacity-0 group-hover:opacity-100" />
        </motion.button>
      </div>
    </div>
  );
}
