/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Heart, 
  Play, 
  ArrowRight, 
  Fingerprint, 
  Box,
  Video,
  Phone,
  X
} from 'lucide-react';
import { TUICallKit, TUICallKitServer } from '@tencentcloud/call-uikit-react';
import { genTestUserSig } from './debug/GenerateTestUserSig';

/**
 * Aura Digital - Artistic Portfolio
 * Integrated with TRTC Call UIKit for real-time communication.
 */

const TABS = ['STORY', 'DATA', 'NODES'] as const;
type Tab = typeof TABS[number];

const SDK_APP_ID = Number(import.meta.env.VITE_TRTC_SDK_APP_ID);
const SDK_SECRET_KEY = import.meta.env.VITE_TRTC_SDK_SECRET_KEY;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('STORY');
  const [isLiked, setIsLiked] = useState(false);
  const [isCallInitialized, setIsCallInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [userID, setUserID] = useState(`user_${Math.floor(Math.random() * 10000)}`);
  const [remoteUserID, setRemoteUserID] = useState('');
  const [showCallUI, setShowCallUI] = useState(false);

  const initCall = async (): Promise<boolean> => {
    if (isCallInitialized) return true;
    if (isInitializing) return false;

    if (!SDK_APP_ID || !SDK_SECRET_KEY) {
      alert('Please configure VITE_TRTC_SDK_APP_ID and VITE_TRTC_SDK_SECRET_KEY in your environment.');
      return false;
    }

    setIsInitializing(true);
    try {
      const userSig = genTestUserSig(userID, SDK_APP_ID, SDK_SECRET_KEY);
      await TUICallKitServer.init({
        SDKAppID: SDK_APP_ID,
        userID: userID,
        userSig: userSig,
      });
      setIsCallInitialized(true);
      console.log('TRTC Call UIKit initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize TRTC Call UIKit:', error);
      alert('Failed to initialize TRTC Call UIKit. Check console for details.');
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  // Auto-initialize if keys are present
  useEffect(() => {
    if (SDK_APP_ID && SDK_SECRET_KEY && !isCallInitialized && !isInitializing) {
      initCall();
    }
  }, []);

  const startCall = async (type: number) => {
    if (!isCallInitialized) {
      const success = await initCall();
      if (!success) return;
    }
    
    if (!remoteUserID) {
      alert('Please enter a remote User ID to call.');
      return;
    }

    try {
      await TUICallKitServer.call({
        userID: remoteUserID,
        type: type, // 1: audio, 2: video
      });
      setShowCallUI(true);
    } catch (error) {
      console.error('Failed to start call:', error);
      // If it fails with "init not complete", it might be a race condition or internal SDK state
      if (typeof error === 'string' && error.includes('init is not complete')) {
        alert('Call system is still warming up. Please try again in a moment.');
      } else {
        alert('Failed to start call. Check console for details.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-[#137fec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path 
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
          <h1 className="text-lg font-black tracking-[0.2em] uppercase">Aura Digital</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ID: {userID}
          </div>
          <button className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-full transition-all ${isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Left Side: Cinematic Cover / TRTC Call Exhibit */}
        <section className="relative w-full lg:w-[60%] bg-slate-900 overflow-hidden group">
          <AnimatePresence mode="wait">
            {!showCallUI ? (
              <motion.div 
                key="exhibit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQfZjciLikYSdqrHeTCF5S1oCWYDDdDVNj6FzGZE6_uGryVfQgJS1NnO363DLmKrjMxrPOIuQLJTfTQ72Y74Gxy_Mg7i9YoZCMdJlr1xMF-OKRCalVxoqmswZEssvIEa0xPqCD_DcGDGkbGj41Zk-cWQmpcCTfDs1UfvgzNdBdpZuD8-uSqYlslDkECYnOu0JjWpx511WqEO9-w2ZeA3GAo6ephhQOPyXZRLG0FBDECOsF2syK6fyiFkSevVGHoDsrxSEvSCZU6723" 
                  alt="Abstract Digital Art"
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* TRTC Call Controls Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#137fec] flex items-center justify-center text-white">
                        <Video size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Digital Presence</h3>
                        <p className="text-white/60 text-xs uppercase tracking-widest">TRTC Call Exhibit</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Remote User ID</label>
                        <input 
                          type="text" 
                          placeholder="Enter ID to call..."
                          value={remoteUserID}
                          onChange={(e) => setRemoteUserID(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#137fec]/50 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                          onClick={() => startCall(2)}
                          className="flex flex-col items-center justify-center gap-3 py-6 bg-[#137fec] text-white rounded-2xl hover:brightness-110 transition-all group"
                        >
                          <Video size={24} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Video Call</span>
                        </button>
                        <button 
                          onClick={() => startCall(1)}
                          className="flex flex-col items-center justify-center gap-3 py-6 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all group"
                        >
                          <Phone size={24} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Audio Call</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="call-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black"
              >
                <TUICallKit />
                <button 
                  onClick={() => setShowCallUI(false)}
                  className="absolute top-6 right-6 z-[9999] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <X size={24} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-10 left-10 z-10">
            <span className="px-4 py-1.5 bg-[#137fec] text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm shadow-lg">
              Featured Exhibit
            </span>
          </div>
        </section>

        {/* Right Side: Content Area */}
        <section className="w-full lg:w-[40%] bg-white flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto">
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <motion.header 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-[#137fec] font-bold tracking-[0.3em] text-[11px] uppercase mb-4">
                Studio V Presents
              </p>
              <h2 className="text-slate-900 text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6">
                Ethereal<br />Echoes
              </h2>
              <div className="h-1.5 w-14 bg-[#137fec] mb-8" />
              <p className="text-slate-500 text-xl font-light leading-relaxed italic">
                A digital journey through sound, light, and the architecture of the void.
              </p>
            </motion.header>

            {/* Tabs Navigation */}
            <nav className="mb-10 border-b border-slate-100">
              <div className="flex gap-10">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors ${
                      activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#137fec]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Tab Content */}
            <div className="min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-slate-600 leading-relaxed text-lg"
                >
                  {activeTab === 'STORY' && (
                    <>
                      <p>
                        A minimalist exploration of sound and vision, designed to evoke a sense of calm and wonder. This digital booklet serves as a companion to the auditory experience, featuring high-fidelity visuals and curated typography.
                      </p>
                      <p>
                        Every interaction is a note. Every transition is a movement. Experience the intersection of art and interface in a medium that breathes with your presence.
                      </p>
                    </>
                  )}
                  {activeTab === 'DATA' && (
                    <p>
                      The exhibit utilizes real-time generative algorithms to synthesize visual patterns based on ambient sound frequencies. Each session is unique, responding to the specific acoustic environment of the viewer.
                    </p>
                  )}
                  {activeTab === 'NODES' && (
                    <p>
                      Distributed across a global network of creative servers, Ethereal Echoes leverages decentralized rendering to ensure low-latency interactions regardless of geographic location.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Technical Specs */}
            <div className="mt-16 pt-12 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Release Date</p>
                  <p className="text-sm font-semibold text-slate-800">October 2024</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Duration</p>
                  <p className="text-sm font-semibold text-slate-800">12m 44s</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Resolution</p>
                  <p className="text-sm font-semibold text-slate-800">8K Interactive</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">License</p>
                  <p className="text-sm font-semibold text-slate-800">CC-BY-NC 4.0</p>
                </div>
              </div>
            </div>

                <div className="mt-16">
                  <motion.button 
                    whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => initCall()}
                    disabled={isInitializing}
                    className={`w-full py-5 text-white font-bold rounded-lg uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group shadow-xl transition-all ${
                      isInitializing ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#137fec] shadow-blue-200'
                    }`}
                  >
                    {isInitializing ? 'Initializing...' : isCallInitialized ? 'Call System Ready' : 'Initialize Call System'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-10 py-6 bg-slate-50 border-t border-slate-200/60 flex justify-between items-center">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.4em]">
          © 2024 Studio V Creative
        </p>
        <div className="flex gap-5 text-slate-300">
          <Fingerprint size={16} />
          <Box size={16} />
        </div>
      </footer>
    </div>
  );
}
