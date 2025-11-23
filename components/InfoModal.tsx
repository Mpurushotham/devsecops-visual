import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, BookOpen, CheckCircle, Circle, XCircle, ShieldCheck, Lock } from 'lucide-react';
import { GUIDE_CONTENT } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStageIndex: number;
  isSecure: boolean;
}

const InfoModal: React.FC<Props> = ({ isOpen, onClose, currentStageIndex, isSecure }) => {
  const [activeTabId, setActiveTabId] = useState(GUIDE_CONTENT[0].id);

  const activeContent = GUIDE_CONTENT.find(c => c.id === activeTabId)?.content;

  if (!isOpen) return null;

  // Dynamic Checklist Items based on props
  const checklistItems = [
    {
        id: 1,
        title: "Secret Management (OWASP A07)",
        desc: "Secrets are removed from source code and managed via Environment Variables or Vault.",
        met: isSecure,
        stage: "Code"
    },
    {
        id: 2,
        title: "Input Validation (OWASP A03)",
        desc: "Code uses Parameterized Queries to prevent SQL Injection attacks.",
        met: isSecure,
        stage: "Code"
    },
    {
        id: 3,
        title: "Dependency Scanning (SCA)",
        desc: "Automated analysis of 3rd party libraries for known CVEs.",
        met: currentStageIndex >= 1, // Passed Build stage
        stage: "Build"
    },
    {
        id: 4,
        title: "Static Analysis (SAST)",
        desc: "Source code scanned for vulnerabilities before deployment.",
        met: currentStageIndex >= 2, // Passed Test stage
        stage: "Test"
    },
    {
        id: 5,
        title: "Secure Deployment (IaC)",
        desc: "Infrastructure defined as code and validated.",
        met: currentStageIndex >= 3, // Passed Deploy stage
        stage: "Deploy"
    },
    {
        id: 6,
        title: "Runtime Protection (WAF)",
        desc: "Active monitoring and blocking of malicious traffic.",
        met: currentStageIndex >= 4, // Reached Monitor stage
        stage: "Monitor"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
        >
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-4 flex flex-col">
                <div className="mb-6 flex items-center gap-2 text-indigo-400 px-2">
                    <BookOpen size={20} />
                    <span className="font-bold tracking-wide text-sm uppercase">Guidebook</span>
                </div>
                <nav className="space-y-1">
                    {GUIDE_CONTENT.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTabId(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                activeTabId === item.id 
                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {item.title}
                            </div>
                            {activeTabId === item.id && <ChevronRight size={14} />}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-slate-900 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                    {activeTabId === 'checklist' ? (
                        <motion.div
                            key="checklist"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-slate-100">{activeContent?.heading}</h2>
                                {checklistItems.every(i => i.met) && (
                                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
                                        <ShieldCheck size={14}/> ALL PASSED
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg text-indigo-400 font-medium mb-8">{activeContent?.subheading}</h3>
                            <p className="text-slate-300 mb-8">{activeContent?.text}</p>

                            <div className="grid grid-cols-1 gap-4">
                                {checklistItems.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-500 ${item.met ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}
                                    >
                                        <div className={`p-2 rounded-full flex-shrink-0 ${item.met ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            {item.met ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-bold ${item.met ? 'text-emerald-200' : 'text-slate-200'}`}>{item.title}</h4>
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                                    {item.stage}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                        {item.met && (
                                            <div className="hidden sm:block text-emerald-500 text-sm font-bold opacity-0 animate-in fade-in duration-500" style={{ opacity: 1 }}>
                                                COMPLIANT
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        activeContent && (
                            <motion.div
                                key={activeTabId}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-3xl font-bold text-slate-100 mb-2">{activeContent.heading}</h2>
                                <h3 className="text-lg text-indigo-400 font-medium mb-8">{activeContent.subheading}</h3>
                                
                                <p className="text-slate-300 leading-relaxed text-lg mb-8">
                                    {activeContent.text}
                                </p>

                                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Key Takeaways</h4>
                                    <ul className="space-y-3">
                                        {activeContent.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-300">
                                                <div className="mt-1.5 min-w-[6px] min-h-[6px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-center text-xs text-slate-500">
                    Interactive DevSecOps Demo • Based on Real World Architectures
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InfoModal;