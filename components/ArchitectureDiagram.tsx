import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Database, Shield, Lock, UserX, Bug, CheckCircle, Search, FileJson, ShieldAlert, Cloud, AlertTriangle, Unlock } from 'lucide-react';
import { StageStatus } from '../types';
import { PIPELINE_STAGES } from '../constants';

interface Props {
  activeStageId: string;
  pipelineStatus: StageStatus;
  isSecure: boolean;
}

// Reusable Tooltip Component with Framer Motion
const Tooltip = ({ content, children, className = "" }: { content: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <div className={`relative group/tooltip flex justify-center ${className}`}>
    {children}
    <AnimatePresence>
      <div className="absolute bottom-full mb-3 hidden group-hover/tooltip:block z-50 w-max max-w-[200px]">
        <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="px-3 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-slate-200 text-xs rounded-lg shadow-2xl text-center leading-relaxed"
        >
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
        </motion.div>
      </div>
    </AnimatePresence>
  </div>
);

const ArchitectureDiagram: React.FC<Props> = ({ activeStageId, pipelineStatus, isSecure }) => {
  const isScanning = pipelineStatus === StageStatus.RUNNING && ['code', 'build', 'test'].includes(activeStageId);
  const isRuntime = ['deploy', 'monitor'].includes(activeStageId);
  const showAttack = activeStageId === 'monitor' && !isSecure;
  
  // Identify if we are in a state that should visually alarm the user
  const isVulnerableState = !isSecure && (activeStageId === 'code' || activeStageId === 'test' || activeStageId === 'monitor');
  
  const currentStageInfo = PIPELINE_STAGES.find(s => s.id === activeStageId);

  // Helper for node styling
  const getNodeState = (nodeType: 'frontend' | 'api' | 'db') => {
    // Critical Error State
    if (pipelineStatus === StageStatus.ERROR) return 'border-red-500 bg-red-900/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50';
    
    // Vulnerability Specific Highlighting
    if (!isSecure) {
      if (nodeType === 'api' && activeStageId === 'code') return 'border-amber-500 bg-amber-500/10 text-amber-400 animate-pulse ring-1 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
      if (nodeType === 'api' && activeStageId === 'test') return 'border-red-500 bg-red-500/10 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      if (nodeType === 'db' && activeStageId === 'monitor') return 'border-red-500 bg-red-500/10 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
    }

    // Active Processing State
    if (pipelineStatus === StageStatus.RUNNING) {
       if (activeStageId === 'deploy' && nodeType === 'api') return 'border-blue-400 bg-blue-500/10 text-blue-300 shadow-[0_0_25px_rgba(96,165,250,0.3)] animate-pulse';
    }
    
    // Secure Success State
    if (isSecure && pipelineStatus === StageStatus.SUCCESS) return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    
    // Default Idle
    return 'border-slate-700 bg-slate-800/60 text-slate-500 hover:border-slate-600 hover:bg-slate-800/80';
  };

  return (
    <div className={`relative w-full h-[450px] bg-slate-950/50 rounded-xl border overflow-hidden flex flex-col items-center justify-center select-none shadow-inner group/diagram transition-colors duration-700 ${isVulnerableState ? 'border-red-900/30' : 'border-slate-800'}`}>
      
      {/* Dynamic Background Grid & Effects */}
      <div className={`absolute inset-0 bg-[size:40px_40px] pointer-events-none transition-colors duration-700 ${isVulnerableState ? 'bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)]'}`} />
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(30,41,59,0) 0%, rgba(2,6,23,1) 90%) pointer-events-none" />
      
      {/* Vulnerable Ambient Glow */}
      <AnimatePresence>
        {isVulnerableState && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(220,38,38,0.1) 0%, transparent 70%) pointer-events-none z-0"
            />
        )}
      </AnimatePresence>

      {/* Zone Labels */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-2">
         <Cloud size={12} /> Public Internet
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-slate-700"></div> Private VPC
      </div>

      {/* Scanning Laser Effect (SAST/Build/Code) */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ left: '-20%' }}
            animate={{ left: '120%' }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1 bg-indigo-500/50 blur-sm z-0 pointer-events-none shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
             <div className="absolute top-0 bottom-0 -left-12 w-24 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent skew-x-12"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Diagram Layout */}
      <div className="relative z-10 flex items-center gap-8 sm:gap-16 lg:gap-24 px-8 pb-12">

        {/* --- Node: Client --- */}
        <Tooltip content="End-user Browser / Device accessing the application via HTTPS">
          <div className="relative">
            <motion.div 
              className={`w-28 h-28 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 ${getNodeState('frontend')}`}
            >
              <div className="relative">
                 <Globe size={32} strokeWidth={1.5} className="mb-2" />
                 {isRuntime && (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_5px_#4ade80]" />
                 )}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">Client</div>
              <div className="text-[9px] opacity-60 font-mono mt-1">Chrome / Safari</div>
            </motion.div>
            
            {/* HTTPS Security Indicator */}
            {isRuntime && (
              <Tooltip content={isSecure ? "Encrypted Connection (TLS 1.3)" : "Insecure Connection (HTTP)"} className="absolute -top-3 -left-3 z-30">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  className={`p-1.5 rounded-full shadow-lg border-2 border-slate-900 ${isSecure ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                  <Lock size={12} />
                </motion.div>
              </Tooltip>
            )}
          </div>
        </Tooltip>

        {/* --- Connection: Client to API --- */}
        <div className="absolute left-[128px] sm:left-[160px] w-[calc(50%-130px)] lg:w-[calc(50%-140px)] h-[2px] bg-slate-800 flex items-center justify-center">
           
           {/* Data Particles */}
           {isRuntime && (
             <>
                <motion.div 
                  className={`absolute w-8 h-[2px] rounded-full ${isSecure ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-slate-500'}`}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className={`absolute w-1 h-1 rounded-full ${isSecure ? 'bg-white' : 'bg-slate-400'}`}
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
             </>
           )}

           {/* WAF Shield Node */}
           <Tooltip content={isSecure ? "Web Application Firewall (Blocking Attacks)" : "WAF Inactive / Permissive Mode"}>
             <div className={`relative z-20 p-2.5 rounded-full border-2 transition-all duration-500 bg-slate-900 ${isRuntime && isSecure ? 'border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'border-slate-700 text-slate-700'}`}>
                <Shield size={18} />
                {isRuntime && isSecure && (
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-indigo-500 rounded-full -z-10" 
                   />
                )}
             </div>
           </Tooltip>
        </div>

        {/* --- Node: API Server --- */}
        <div className="relative">
          {/* Attacker Vector Animation */}
          <AnimatePresence>
            {showAttack && (
              <Tooltip content="OWASP A03: Injection Attack Simulation" className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col items-center"
                >
                   <div className="w-10 h-10 bg-slate-900 border-2 border-red-500 rounded-lg flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                     <UserX size={20} />
                   </div>
                   <div className="h-6 w-0.5 bg-gradient-to-b from-red-500 to-transparent mt-1"></div>
                   <motion.div 
                      animate={{ y: [0, 5, 0] }} 
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-12 text-red-500"
                   >
                     <AlertTriangle size={12} fill="currentColor" />
                   </motion.div>
                </motion.div>
              </Tooltip>
            )}
          </AnimatePresence>

          <Tooltip content="Backend API Service (Node.js/Express) running business logic">
            <motion.div 
              className={`relative w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 z-10 ${getNodeState('api')}`}
            >
               <div className="relative">
                 <Server size={40} strokeWidth={1.5} className="mb-2" />
                 {/* Processing Spinner */}
                 {isScanning && (
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 text-indigo-400"
                   >
                     <Search size={16} />
                   </motion.div>
                 )}
               </div>
               <div className="text-xs font-bold uppercase tracking-wider">API</div>
               <div className="text-[9px] opacity-60 font-mono mt-1">v1.2.0</div>
            </motion.div>
          </Tooltip>

          {/* Vulnerability Alert Badges */}
          <AnimatePresence>
            {!isSecure && activeStageId === 'code' && (
               <Tooltip content="OWASP A07: Identification and Authentication Failures" className="absolute -top-4 -right-4 z-30">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative">
                    <div className="bg-amber-500 text-slate-900 p-2 rounded-full border-2 border-slate-900 shadow-xl animate-bounce">
                       <FileJson size={16} />
                    </div>
                 </motion.div>
               </Tooltip>
            )}
            {!isSecure && activeStageId === 'test' && (
               <Tooltip content="SAST Scan: OWASP A03 Injection Detected" className="absolute -top-4 -right-4 z-30">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative">
                    <div className="bg-red-500 text-white p-2 rounded-full border-2 border-slate-900 shadow-xl">
                       <Bug size={16} />
                    </div>
                 </motion.div>
               </Tooltip>
            )}
            {isSecure && activeStageId === 'test' && pipelineStatus === StageStatus.SUCCESS && (
               <Tooltip content="All Security Tests Passed" className="absolute -top-4 -right-4 z-30">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-white p-2 rounded-full border-2 border-slate-900 shadow-xl">
                    <CheckCircle size={16} />
                 </motion.div>
               </Tooltip>
            )}
          </AnimatePresence>
        </div>

        {/* --- Connection: API to DB --- */}
        <div className="absolute right-[128px] sm:right-[160px] w-[calc(50%-130px)] lg:w-[calc(50%-140px)] h-[2px] bg-slate-800 flex items-center justify-center">
             {/* Database Traffic */}
             {isRuntime && (
               <motion.div 
                 className={`absolute w-1.5 h-1.5 rounded-full ${isSecure ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-500'}`}
                 animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                 transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
               />
             )}
             
             {/* Malicious Payload Animation */}
             <AnimatePresence>
               {showAttack && (
                 <Tooltip content="Malicious SQL Query Injection detected" className="absolute z-20">
                   <motion.div 
                      className="w-3 h-3 bg-red-500 rounded-sm rotate-45 shadow-[0_0_12px_#ef4444]"
                      animate={{ left: ['0%', '100%'], x: 50 }} 
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                   />
                 </Tooltip>
               )}
             </AnimatePresence>
        </div>

        {/* --- Node: Database --- */}
        <div className="relative">
          <Tooltip content="Primary Database (PostgreSQL) storing user credentials">
            <motion.div 
              className={`w-28 h-28 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 z-10 ${getNodeState('db')}`}
            >
               <div className="relative">
                  <Database size={32} strokeWidth={1.5} className="mb-2" />
                  {showAttack && (
                     <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 bg-red-500/20 rounded-full" />
                  )}
               </div>
               <div className="text-xs font-bold uppercase tracking-wider">Database</div>
               <div className="text-[9px] opacity-60 font-mono mt-1">Postgres 15</div>
            </motion.div>
          </Tooltip>

          {/* Runtime Intrusion Alert */}
          <AnimatePresence>
             {showAttack && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-30"
                >
                  <div className="bg-red-950/90 backdrop-blur-md border border-red-500/50 text-red-200 text-[10px] px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 whitespace-nowrap">
                    <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                    <span className="font-semibold">SQL Injection (OWASP A03)</span>
                  </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>

      </div>

      {/* Stage Description Overlay at Bottom */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-40">
        <AnimatePresence mode="wait">
            <motion.div 
            key={activeStageId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 pl-2 pr-5 py-2 rounded-full shadow-2xl flex items-center gap-3 max-w-lg pointer-events-auto"
            >
                <div className={`p-2 rounded-full ${isVulnerableState ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {currentStageInfo?.icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">{currentStageInfo?.name}</span>
                    <span className="text-xs text-slate-200 font-medium leading-tight">
                        {currentStageInfo?.description}
                    </span>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend / Status Bar */}
      <div className="absolute bottom-0 w-full bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 p-2 px-6 flex justify-between items-center text-[10px] text-slate-500 font-mono z-50">
         <div className="flex gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]"></div> HTTP Traffic
            </div>
            {isRuntime && (
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div> DB Query
              </div>
            )}
            {activeStageId === 'monitor' && !isSecure && (
               <div className="flex items-center gap-2 text-red-400 animate-pulse font-bold">
                  <div className="w-2 h-2 rounded-sm rotate-45 bg-red-500"></div> Attack Detected
               </div>
            )}
         </div>
         <div className="flex items-center gap-2 uppercase tracking-wider">
            System Integrity: 
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${isSecure ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'} font-bold transition-colors duration-500`}>
              {isSecure ? <Lock size={10} /> : <Unlock size={10} />}
              {isSecure ? '100% SECURE' : 'VULNERABLE'}
            </span>
         </div>
      </div>

    </div>
  );
};

export default ArchitectureDiagram;