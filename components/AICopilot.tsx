import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { generateSecurityInsight, analyzeVulnerability } from '../services/geminiService';
import { PipelineStage, StageStatus } from '../types';
import { VULNERABLE_CODE_SNIPPET } from '../constants';

interface Props {
  currentStage: PipelineStage;
  isSimulating: boolean;
}

const AICopilot: React.FC<Props> = ({ currentStage, isSimulating }) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [manualAnalysis, setManualAnalysis] = useState<string | null>(null);

  useEffect(() => {
    // Auto-generate insight when stage changes
    const fetchInsight = async () => {
      setLoading(true);
      setManualAnalysis(null); // Reset manual analysis
      
      let context = currentStage.description;
      if (currentStage.id === 'code') {
        context += " The user is writing raw code. Potential for hardcoded secrets or injection flaws.";
      } else if (currentStage.id === 'test') {
        context += " SAST tools are scanning for patterns like SQLi and XSS.";
      }

      const response = await generateSecurityInsight(currentStage.name, context);
      setInsight(response);
      setLoading(false);
    };

    fetchInsight();
  }, [currentStage]);

  const handleAnalyzeCode = async () => {
    setLoading(true);
    const result = await analyzeVulnerability(VULNERABLE_CODE_SNIPPET);
    setManualAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-700 w-80 shrink-0">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
        <Bot className="text-indigo-400" size={24} />
        <div>
          <h3 className="font-semibold text-slate-100">Security Copilot</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Contextual Insight Card */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-indigo-300">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Current Context</span>
          </div>
          {loading && !manualAnalysis ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="animate-spin" size={16} />
              <span>Analyzing pipeline state...</span>
            </div>
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed">
              {insight}
            </p>
          )}
        </div>

        {/* Conditional Actions based on stage */}
        {currentStage.id === 'code' && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
             <div className="flex items-center gap-2 mb-3 text-amber-300">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Action Required</span>
             </div>
             <p className="text-xs text-slate-400 mb-3">
               Detected code changes in editor. Run a security analysis before committing?
             </p>
             <button 
               onClick={handleAnalyzeCode}
               disabled={loading}
               className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors flex items-center justify-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
               Analyze Code Snippet
             </button>
          </div>
        )}

        {/* Analysis Result */}
        {manualAnalysis && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Analysis Report</h4>
            <div className="prose prose-invert prose-sm text-slate-300 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: manualAnalysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICopilot;