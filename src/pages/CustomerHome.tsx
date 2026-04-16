import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo, BUSINESS_CATEGORIES } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import NearbyBusinessesMap from '../components/NearbyBusinessesMap';
import { motion } from 'framer-motion';

export default function CustomerHome() {
  const { 
    allSalons, 
    customerProfile, 
    isFavorite, 
    getUserLocation
  } = useApp();
  const nav = useNavigate();
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Haversine formula for distance calculation
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    getUserLocation().then(loc => { 
      if(loc) {
        setUserLoc(loc);
        calculateNearbyBusinesses(loc);
      }
    });
  }, []);

  const calculateNearbyBusinesses = (loc: {lat: number, lng: number}) => {
    const businessesWithDistance = allSalons
      .filter(s => s.lat && s.lng && s.lat !== 0 && s.lng !== 0) // Filter out invalid coordinates
      .map(s => ({
        ...s,
        distance: getDistanceKm(loc.lat, loc.lng, s.lat!, s.lng!)
      }))
      .filter(b => b.distance < 50) // Only show businesses within 50km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50); // Show more businesses
    
    setNearbyBusinesses(businessesWithDistance);
  };

  const getFilteredBusinesses = () => {
    let filtered = nearbyBusinesses;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedCategory);
    }
    return filtered;
  };

  const filteredBusinesses = getFilteredBusinesses();
  const favoriteBusinesses = allSalons.filter(s => isFavorite(s.uid));

  return (
    <ResponsiveContainer variant="customer">
      <div className="min-h-screen bg-bg pb-24">
        {/* Clean Header - Swiggy Style */}
        <div className="sticky top-0 z-50 bg-bg border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-text">
                  {customerProfile?.name || 'Welcome'} 👋
                </h1>
                <p className="text-xs text-text-dim mt-0.5">
                  Discover beauty & wellness near you
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => nav('/customer/rewards')}
                  className="relative p-2 rounded-lg bg-card hover:bg-card-2 transition-colors"
                >
                  <span className="text-lg">🎁</span>
                  {(customerProfile?.loyaltyPoints || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {customerProfile?.loyaltyPoints}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => nav('/customer/notifications')}
                  className="p-2 rounded-lg bg-card hover:bg-card-2 transition-colors"
                >
                  <span className="text-lg">🔔</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Loyalty Banner - Only if points exist */}
          {(customerProfile?.loyaltyPoints || 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => nav('/customer/rewards')}
              className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Your Rewards</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">{customerProfile?.loyaltyPoints} Points</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm font-medium text-text-dim">→</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Pills - Horizontal Scroll */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-card text-text-dim hover:bg-card-2'
                }`}
              >
                All
              </button>
              {BUSINESS_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-text-dim hover:bg-card-2'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Header with View Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-text">Nearby Businesses</h2>
              <p className="text-xs text-text-dim mt-0.5">
                {filteredBusinesses.length} places found
              </p>
            </div>
            <div className="flex items-center gap-2">
              {userLoc && (
                <button 
                  onClick={() => getUserLocation().then(loc => loc && calculateNearbyBusinesses(loc))}
                  className="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Refresh
                </button>
              )}
              <div className="flex bg-card rounded-lg p-0.5 border border-border">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-text-dim hover:text-text'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-primary text-white'
                      : 'text-text-dim hover:text-text'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {!userLoc ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <span className="text-5xl block mb-3">📍</span>
              <h3 className="text-base font-bold text-text mb-2">Enable Location</h3>
              <p className="text-sm text-text-dim mb-4 max-w-sm mx-auto">
                Allow location access to discover services near you
              </p>
              <button 
                onClick={() => getUserLocation().then(loc => loc && calculateNearbyBusinesses(loc))}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
              >
                Enable Location
              </button>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="text-base font-bold text-text mb-2">No Results Found</h3>
              <p className="text-sm text-text-dim">
                Try selecting a different category
              </p>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === 'map' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <NearbyBusinessesMap
                    businesses={filteredBusinesses}
                    userLocation={userLoc}
                    onBusinessClick={(id) => nav(`/customer/salon/${id}`)}
                  />
                </motion.div>
              )}

              {/* List View - Compact Cards */}
              {viewMode === 'list' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredBusinesses.map((business: any, index: number) => {
                    const catInfo = getCategoryInfo(business.businessType);
                    return (
                      <motion.div
                        key={business.uid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => nav(`/customer/salon/${business.uid}`)}
                        className="group cursor-pointer bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                      >
                        {/* Image */}
                        <div className="relative h-32 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                          {business.bannerImageURL ? (
                            <img 
                              src={business.bannerImageURL} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              alt={business.businessName}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">{catInfo.icon}</span>
                            </div>
                          )}
                          {/* Status Badge */}
                          {business.isOpen && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-semibold flex items-center gap-0.5">
                              <span className="w-1 h-1 bg-white rounded-full"></span>
                              Open
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-2">
                          <h3 className="font-bold text-xs text-text mb-0.5 line-clamp-1">
                            {business.businessName}
                          </h3>
                          <p className="text-[9px] text-text-dim mb-1.5 line-clamp-1">{catInfo.label}</p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-1.5 text-[10px] text-text-dim mb-1.5">
                            {business.rating && (
                              <div className="flex items-center gap-0.5">
                                <span className="text-amber-500">★</span>
                                <span className="font-semibold text-text">{business.rating}</span>
                              </div>
                            )}
                            {business.distance !== undefined && (
                              <div className="flex items-center gap-0.5">
                                <span>📍</span>
                                <span>{business.distance.toFixed(1)}km</span>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <button className="w-full py-1 rounded-md bg-primary/10 text-primary font-semibold text-[10px] hover:bg-primary hover:text-white transition-colors">
                            View
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Favorites Section - Only show if user has favorites */}
          {favoriteBusinesses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-text mb-3">Your Favorites</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {favoriteBusinesses.slice(0, 6).map(business => {
                  const catInfo = getCategoryInfo(business.businessType);
                  return (
                    <div
                      key={business.uid}
                      onClick={() => nav(`/customer/salon/${business.uid}`)}
                      className="flex flex-col gap-2 p-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="w-full h-20 rounded-md bg-card-2 flex items-center justify-center overflow-hidden">
                        {business.bannerImageURL ? (
                          <img src={business.bannerImageURL} className="w-full h-full object-cover" alt="" />
                        ) : <span className="text-2xl">{catInfo.icon}</span>}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-text truncate">{business.businessName}</p>
                        <p className="text-[9px] text-text-dim truncate">{catInfo.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
