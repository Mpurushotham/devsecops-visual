import React, { useState, useMemo } from 'react';
import { PIPELINE_STAGES, VULNERABLE_CODE_SNIPPET, SECURE_CODE_SNIPPET } from './constants';
import { StageStatus, LogEntry } from './types';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import AICopilot from './components/AICopilot';
import MetricsDashboard from './components/MetricsDashboard';
import InfoModal from './components/InfoModal';
import { Play, CheckCircle, Terminal, RefreshCw, ArrowRight, Lock, Unlock, BookOpen, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<StageStatus>(StageStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [codeContent, setCodeContent] = useState(VULNERABLE_CODE_SNIPPET);
  const [isSecure, setIsSecure] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const currentStage = PIPELINE_STAGES[currentStageIndex];

  // Security Score Calculation
  const securityScore = useMemo(() => {
    let score = 0;
    // Base security fix (Secrets + Input Validation)
    if (isSecure) score += 40;
    
    // Progress bonuses (each stage passed implies safeguards are active)
    // Stage 0 (Code) completed -> Index 1
    if (currentStageIndex >= 1) score += 15; // Build reached
    if (currentStageIndex >= 2) score += 15; // Test reached
    if (currentStageIndex >= 3) score += 15; // Deploy reached
    if (currentStageIndex >= 4) score += 15; // Monitor reached

    return Math.min(100, score);
  }, [isSecure, currentStageIndex]);

  const getMaturityLabel = (score: number) => {
    if (score >= 80) return { label: 'Secure', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' };
    if (score >= 40) return { label: 'Improving', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500' };
    return { label: 'Vulnerable', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' };
  };

  const maturity = getMaturityLabel(securityScore);

  const addLog = (message: string, level: LogEntry['level'] = 'INFO') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, level }]);
  };

  const clearLogs = () => setLogs([]);

  const handleRunStage = () => {
    setPipelineStatus(StageStatus.RUNNING);
    clearLogs();
    addLog(`Starting stage: ${currentStage.name}...`);
    
    // Simulation Logic
    setTimeout(() => {
        if (currentStage.id === 'code') {
            addLog('Running pre-commit hooks...', 'INFO');
            addLog('Scanning for secrets in git history...', 'INFO');
            if (!isSecure) {
                addLog('CRITICAL: Found hardcoded API Key pattern! (OWASP A07)', 'ERROR');
                addLog('CRITICAL: Potential SQL Injection detected! (OWASP A03)', 'ERROR');
                setPipelineStatus(StageStatus.ERROR);
                return;
            } else {
                addLog('Secret scanning passed.', 'SUCCESS');
                addLog('Linting checks passed.', 'SUCCESS');
            }
        } 
        else if (currentStage.id === 'build') {
            addLog('Installing npm dependencies...', 'INFO');
            addLog('Running SCA (Software Composition Analysis)...', 'INFO');
            addLog('Analyzing package-lock.json...', 'INFO');
            if (!isSecure) {
                // Simulate a warning even if code "looks" ok, but strictly for demo flow usually build passes if dependencies are mocked as safe
                addLog('Dependencies analyzed. No critical CVEs found.', 'SUCCESS');
            } else {
                addLog('Dependencies secure.', 'SUCCESS');
            }
            addLog('Build artifact created: app-v1.0.0.zip', 'SUCCESS');
        }
        else if (currentStage.id === 'test') {
            addLog('Initializing SAST scanner...', 'INFO');
            addLog('Analyzing AST (Abstract Syntax Tree)...', 'INFO');
            if (!isSecure) {
                addLog('SAST FAILED: High severity SQL Injection vulnerability found at line 12.', 'ERROR');
                setPipelineStatus(StageStatus.ERROR);
                return;
            }
            addLog('SAST passed. No vulnerabilities found.', 'SUCCESS');
        }
        else if (currentStage.id === 'deploy') {
            addLog('Reading Terraform configuration...', 'INFO');
            addLog('Validating Kubernetes manifests...', 'INFO');
            addLog('Applying network policies...', 'INFO');
            addLog('Deployment rolled out to staging.', 'SUCCESS');
        }
        else if (currentStage.id === 'monitor') {
            addLog('Attaching runtime security agents...', 'INFO');
            addLog('Simulating user traffic...', 'INFO');
            if (!isSecure) {
                addLog('WARN: Unusual payload detected in HTTP request body.', 'WARN');
                addLog('CRITICAL: SQL Injection pattern matched in DB query logs.', 'ERROR');
                addLog('ALERT: WAF is blocking subsequent requests from IP 192.168.1.55', 'WARN');
                setPipelineStatus(StageStatus.WARNING); 
                return;
            } else {
                addLog('Traffic normal. Latency < 50ms.', 'SUCCESS');
                addLog('WAF active. No threats detected.', 'SUCCESS');
            }
        }

        setPipelineStatus(StageStatus.SUCCESS);
    }, 2500);
  };

  const handleNext = () => {
    if (currentStageIndex < PIPELINE_STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setPipelineStatus(StageStatus.IDLE);
      clearLogs();
    }
  };

  const handleFixCode = () => {
    setCodeContent(SECURE_CODE_SNIPPET);
    setIsSecure(true);
    setPipelineStatus(StageStatus.IDLE);
    clearLogs();
    addLog('Applied security patch: Parameterized Queries implemented.', 'SUCCESS');
    addLog('Applied security patch: Secrets moved to environment variables.', 'SUCCESS');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Educational Modal */}
      <InfoModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        currentStageIndex={currentStageIndex}
        isSecure={isSecure}
      />

      {/* Left Sidebar: Pipeline Steps */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900 relative">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            DevSecOps<br/>Visualizer
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">Interactive Pipeline Demo</p>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold transition-colors border border-indigo-500/20"
          >
            <BookOpen size={14} />
            Read the Guide
          </button>
        </div>

        {/* Security Score Widget */}
        <div className="px-6 pt-6 pb-2">
            <div className={`relative bg-slate-950/50 rounded-xl p-4 border ${maturity.border} overflow-hidden shadow-lg transition-colors duration-500`}>
                <div className="relative z-10 flex justify-between items-end mb-2">
                    <div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Maturity</div>
                        <div className={`text-lg font-bold ${maturity.color} flex items-center gap-1.5`}>
                           {securityScore >= 80 ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                           {maturity.label}
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-200">{securityScore}%</div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${securityScore}%` }}
                        className={`h-full ${maturity.bg} transition-all duration-700`}
                    />
                </div>
                {/* Ambient Glow */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 ${maturity.bg} opacity-10 rounded-full blur-2xl pointer-events-none transition-colors duration-500`}></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {PIPELINE_STAGES.map((stage, index) => {
             const isActive = index === currentStageIndex;
             const isCompleted = index < currentStageIndex;
             
             return (
               <div key={stage.id} className={`mx-3 px-3 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${isActive ? 'bg-indigo-500/10 border border-indigo-500/50' : 'hover:bg-slate-800 border border-transparent opacity-70 hover:opacity-100'}`}>
                 <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {stage.icon}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{stage.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {isActive && pipelineStatus === StageStatus.RUNNING && <span className="text-[10px] text-blue-400 animate-pulse flex items-center gap-1">Processing...</span>}
                      {isActive && pipelineStatus === StageStatus.ERROR && <span className="text-[10px] text-red-400 font-bold">Failed</span>}
                      {isActive && pipelineStatus === StageStatus.WARNING && <span className="text-[10px] text-amber-400 font-bold">Warning</span>}
                      {(isCompleted || (isActive && pipelineStatus === StageStatus.SUCCESS)) && <span className="text-[10px] text-emerald-400 font-bold">Completed</span>}
                    </div>
                 </div>
                 {isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
               </div>
             )
          })}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button 
                onClick={() => {
                    setCurrentStageIndex(0);
                    setPipelineStatus(StageStatus.IDLE);
                    setIsSecure(false);
                    setCodeContent(VULNERABLE_CODE_SNIPPET);
                    clearLogs();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:border-slate-600"
            >
                <RefreshCw size={14} />
                Reset Simulation
            </button>
        </div>
      </div>

      {/* Center: Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative z-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="text-lg font-medium text-white flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-700">{currentStageIndex + 1}</span>
                <span className="text-slate-200">{currentStage.name}</span>
            </h2>
            <div className="flex gap-3">
                {pipelineStatus === StageStatus.RUNNING ? (
                    <button disabled className="px-5 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium border border-slate-700 cursor-not-allowed flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <RefreshCw size={14} />
                        </motion.div>
                        Running Analysis...
                    </button>
                ) : pipelineStatus === StageStatus.SUCCESS || pipelineStatus === StageStatus.WARNING ? (
                     <button 
                        onClick={handleNext} 
                        disabled={currentStageIndex === PIPELINE_STAGES.length - 1}
                        className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${currentStageIndex === PIPELINE_STAGES.length - 1 ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                     >
                        Next Stage <ArrowRight size={16} />
                     </button>
                ) : (
                    <button onClick={handleRunStage} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                        <Play size={16} fill="currentColor" /> Run {currentStage.id === 'monitor' ? 'Simulation' : 'Pipeline'}
                    </button>
                )}
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8 pb-20">
            
            {/* Architecture Visualization */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase text-slate-500 font-bold tracking-widest">Live Architecture</h3>
                  {isSecure && <span className="text-xs text-emerald-400 flex items-center gap-1"><Lock size={12}/> Environment Secured</span>}
                  {!isSecure && <span className="text-xs text-amber-400 flex items-center gap-1"><Unlock size={12}/> Vulnerabilities Present</span>}
                </div>
                <ArchitectureDiagram activeStageId={currentStage.id} pipelineStatus={pipelineStatus} isSecure={isSecure} />
            </section>

            {/* Stage Specific Interactive Area */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel 1: Code/Config View (Relevant for Code, Test, Deploy) */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase text-slate-500 font-bold tracking-widest">
                            {currentStage.id === 'monitor' ? 'Real-time Metrics' : 'Source Code & Config'}
                        </h3>
                        {currentStage.id === 'code' && (
                             <button 
                                onClick={handleFixCode}
                                disabled={isSecure}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-medium ${isSecure ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default' : 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:scale-105 active:scale-95'}`}
                             >
                                {isSecure ? <Lock size={12} /> : <Unlock size={12} />}
                                {isSecure ? 'Code Secured' : 'Auto-Fix Vulnerabilities'}
                             </button>
                        )}
                    </div>
                    
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden min-h-[320px] relative shadow-lg">
                        {currentStage.id === 'monitor' ? (
                            <MetricsDashboard />
                        ) : (
                            <div className="relative h-full flex flex-col">
                                <div className="h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                    </div>
                                    <span className="ml-3 text-xs text-slate-500 font-mono">auth_service.js</span>
                                </div>
                                <div className="flex-1 relative overflow-hidden bg-slate-900/50">
                                    <pre className="p-4 text-sm font-mono text-slate-300 overflow-auto h-full custom-scrollbar leading-relaxed">
                                        <code>{codeContent}</code>
                                    </pre>
                                    
                                    {/* Vulnerability Highlights Overlay */}
                                    {!isSecure && currentStage.id === 'code' && (
                                        <motion.div 
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="absolute top-[140px] left-8 right-8 bg-red-500/10 border-l-2 border-red-500 p-2 pointer-events-none"
                                        >
                                            <div className="absolute -right-2 -top-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SQL Injection (OWASP A03)</div>
                                        </motion.div>
                                    )}
                                     {!isSecure && currentStage.id === 'code' && (
                                        <motion.div 
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: 0.2 }}
                                          className="absolute top-[220px] left-8 right-8 bg-amber-500/10 border-l-2 border-amber-500 p-2 pointer-events-none"
                                        >
                                            <div className="absolute -right-2 -top-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">Hardcoded Secret (OWASP A07)</div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 2: Terminal / Logs */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    <h3 className="text-xs uppercase text-slate-500 font-bold tracking-widest">CI/CD Pipeline Logs</h3>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs h-[320px] overflow-y-auto shadow-inner custom-scrollbar relative">
                         {/* Terminal Header */}
                         <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 sticky z-10 backdrop-blur-sm">
                             <span className="text-slate-500 flex items-center gap-2"><Terminal size={12}/> runner-1.2.0</span>
                         </div>
                         <div className="mt-8 space-y-2">
                            {logs.length === 0 && (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-700">
                                    <Terminal size={40} className="mb-3 opacity-20" />
                                    <p>Waiting for pipeline trigger...</p>
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`font-mono border-l-2 pl-2 py-0.5 ${
                                        log.level === 'ERROR' ? 'border-red-500 text-red-400 bg-red-500/5' :
                                        log.level === 'SUCCESS' ? 'border-emerald-500 text-emerald-400' :
                                        log.level === 'WARN' ? 'border-amber-500 text-amber-400' : 'border-slate-700 text-slate-300'
                                    }`}
                                >
                                    <span className="opacity-40 mr-3 text-[10px]">{log.timestamp}</span>
                                    {log.message}
                                </motion.div>
                            ))}
                            {pipelineStatus === StageStatus.RUNNING && (
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0] }} 
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-2 h-4 bg-indigo-500 inline-block align-middle ml-1" 
                                />
                            )}
                         </div>
                    </div>
                </div>

            </section>
        </div>
      </div>

      {/* Right Sidebar: AI Copilot */}
      <AICopilot currentStage={currentStage} isSimulating={pipelineStatus === StageStatus.RUNNING} />
      
    </div>
  );
};

export default App;