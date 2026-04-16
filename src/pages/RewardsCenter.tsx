import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BackButton from '../components/BackButton';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { motion } from 'framer-motion';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  type: 'discount' | 'freebie' | 'upgrade';
}

const AVAILABLE_REWARDS: Reward[] = [
  {
    id: '1',
    title: '10% Off Next Visit',
    description: 'Get 10% discount on your next booking',
    points: 100,
    icon: '🎫',
    type: 'discount'
  },
  {
    id: '2',
    title: 'Free Hair Wash',
    description: 'Complimentary hair wash with any service',
    points: 150,
    icon: '💆',
    type: 'freebie'
  },
  {
    id: '3',
    title: '20% Off Next Visit',
    description: 'Get 20% discount on your next booking',
    points: 200,
    icon: '🎁',
    type: 'discount'
  },
  {
    id: '4',
    title: 'Priority Booking',
    description: 'Skip the queue for your next visit',
    points: 250,
    icon: '⚡',
    type: 'upgrade'
  },
  {
    id: '5',
    title: 'Free Beard Trim',
    description: 'Complimentary beard trim service',
    points: 180,
    icon: '✂️',
    type: 'freebie'
  },
  {
    id: '6',
    title: '30% Off Next Visit',
    description: 'Get 30% discount on your next booking',
    points: 300,
    icon: '🏆',
    type: 'discount'
  }
];

export default function RewardsCenter() {
  const { customerProfile, t } = useApp();
  const nav = useNavigate();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const userPoints = customerProfile?.loyaltyPoints || 0;
  const currentStreak = customerProfile?.currentStreak || 0;

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.points) {
      setSelectedReward(reward);
      setShowRedeemModal(true);
    }
  };

  const confirmRedeem = () => {
    // TODO: Implement actual redemption logic
    alert(`Redeemed: ${selectedReward?.title}`);
    setShowRedeemModal(false);
    setSelectedReward(null);
  };

  return (
    <ResponsiveContainer variant="customer">
      <div className="min-h-screen bg-bg text-text pb-24">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <BackButton to="/customer/home" />
            <h1 className="text-2xl font-black">Rewards Center</h1>
            <div className="w-10" />
          </div>

          {/* Points Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/10 border border-gold/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-gold/70 mb-2">Your Balance</p>
              <p className="text-5xl font-black text-gold mb-4">{userPoints}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-text-dim mb-1">Current Streak</p>
                  <p className="text-2xl font-black text-primary">{currentStreak} days 🔥</p>
                </div>
                <button 
                  onClick={() => nav('/customer/loyalty')}
                  className="px-4 py-2 rounded-xl bg-gold/20 border border-gold/30 text-gold text-xs font-bold"
                >
                  Earn More
                </button>
              </div>
            </div>
          </motion.div>

          {/* How to Earn Points */}
          <div className="mb-8 p-5 rounded-3xl bg-card border border-white/5">
            <h3 className="text-sm font-black text-text mb-4">💡 How to Earn Points</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🎫</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text">Complete a Visit</p>
                  <p className="text-xs text-text-dim">+50 points per visit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-lg">⭐</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text">Leave a Review</p>
                  <p className="text-xs text-text-dim">+25 points per review</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg">🔥</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text">Daily Streak</p>
                  <p className="text-xs text-text-dim">+10 points per day</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-lg">👥</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text">Refer a Friend</p>
                  <p className="text-xs text-text-dim">+100 points per referral</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rewards */}
          <div>
            <h2 className="text-lg font-black text-text mb-4">🎁 Available Rewards</h2>
            <div className="grid grid-cols-1 gap-4">
              {AVAILABLE_REWARDS.map((reward, index) => {
                const canAfford = userPoints >= reward.points;
                return (
                  <motion.button
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => canAfford && handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`p-5 rounded-3xl border text-left transition-all ${
                      canAfford
                        ? 'bg-card border-white/5 hover:border-primary/40 active:scale-95'
                        : 'bg-card/50 border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-card-2 flex items-center justify-center text-3xl flex-shrink-0">
                        {reward.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-text mb-1">{reward.title}</p>
                        <p className="text-xs text-text-dim mb-3">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-gold text-lg">💎</span>
                            <span className="text-sm font-black text-gold">{reward.points} points</span>
                          </div>
                          {canAfford ? (
                            <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold">
                              Redeem
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-lg bg-white/5 text-text-dim text-xs font-bold">
                              Need {reward.points - userPoints} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Redeem Confirmation Modal */}
        {showRedeemModal && selectedReward && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-3xl p-6 max-w-sm w-full border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-5xl mx-auto mb-4">
                  {selectedReward.icon}
                </div>
                <h3 className="text-xl font-black text-text mb-2">Redeem Reward?</h3>
                <p className="text-sm text-text-dim mb-4">{selectedReward.title}</p>
                <div className="p-4 rounded-2xl bg-card-2 border border-white/5">
                  <p className="text-xs text-text-dim mb-1">Cost</p>
                  <p className="text-2xl font-black text-gold">{selectedReward.points} points</p>
                  <p className="text-xs text-text-dim mt-2">
                    Remaining: {userPoints - selectedReward.points} points
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-card-2 border border-white/5 text-text font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gold to-primary text-white font-bold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
}
