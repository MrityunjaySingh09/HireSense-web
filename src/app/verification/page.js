"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Zap, Loader2, Upload, X } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const SCAN_STEPS = [
  { id: 1, label: "DECRYPTING_PDF_STRUCTURE" },
  { id: 2, label: "EXTRACTING_INTENT_TOKENS" },
  { id: 3, label: "CROSS_REF: GITHUB_ID" },
  { id: 4, label: "VALIDATING_CLOUD_CERT" },
  { id: 5, label: "ANALYZING_SKILL_DEPTH" },
  { id: 6, label: "GENERATE_TRUST_SCORE" },
];

export default function VerificationPage() {
  const router = useRouter();
  const [isScanning, setIsScanning]   = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeFile, setResumeFile]   = useState(null);
  const [jobFile, setJobFile]         = useState(null);
  const [error, setError]             = useState(null);

  // Single state — null = not done, object = done.
  // isDone is derived so it's never out of sync with resultData.
  const [resultData, setResultData]   = useState(null);
  const isDone = resultData !== null;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const startScan = async () => {
    if (!resumeFile || !jobFile) {
      setError("Both CANDIDATE_RESUME and JOB_REQUIREMENTS PDFs are required.");
      return;
    }

    setIsScanning(true);
    setResultData(null);
    setCurrentStep(1);
    setError(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jobFile);

    // Fetch and animation run in parallel — neither blocks the other
    const fetchPromise = fetch("https://backend-z3s2.onrender.com/analyze", {
      method: "POST",
      body: formData,
    });

    const animateSteps = async () => {
      for (let i = 1; i <= SCAN_STEPS.length; i++) {
        await sleep(1200);
        setCurrentStep(i + 1);
      }
    };

    try {
      const [response] = await Promise.all([fetchPromise, animateSteps()]);

      if (!response.ok) {
        let errorMsg = `Forensic engine error (${response.status})`;
        try {
          const errorBody = await response.json();
          if (errorBody.detail) errorMsg = JSON.stringify(errorBody.detail);
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      // One setState — one render — button and data always in sync
      setResultData(data);
    } catch (err) {
      setError(err.message || "Unknown forensic error occurred.");
      setIsScanning(false);
      setCurrentStep(0);
    }
  };

  const handleViewResults = () => {
    // resultData is guaranteed non-null here because isDone derives from it
    const encodedData = encodeURIComponent(JSON.stringify(resultData));
    router.push(`/verification/results?data=${encodedData}`);
  };

  const handleReset = () => {
    setIsScanning(false);
    setCurrentStep(0);
    setResultData(null);
    setError(null);
    setResumeFile(null);
    setJobFile(null);
  };

  const progressPercent = Math.round(
    (Math.max(currentStep - 1, 0) / SCAN_STEPS.length) * 100
  );

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <TopBar breadcrumb="HIRESENSE / VERIFICATION" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">

        {/* LEFT: Investigation Terminal */}
        <div className="bg-white p-10 border border-[#EEE] rounded-[4px] shadow-sm relative overflow-hidden">
          <p className="font-mono text-[11px] uppercase text-[#A3A3A3] mb-2 tracking-widest font-bold">
            Investigation Terminal
          </p>
          <h2 className="font-sans font-black text-[24px] text-[#050505] mb-8 uppercase tracking-tighter">
            {isScanning && !isDone
              ? "Audit in Progress..."
              : isDone
              ? "Audit Complete"
              : "Initialize Forensic Scan"}
          </h2>

          <div className="space-y-6">
            <FileCard label="CANDIDATE_RESUME" file={resumeFile} active={isScanning} onSet={setResumeFile} onClear={() => setResumeFile(null)} />
            <FileCard label="JOB_REQUIREMENTS"  file={jobFile}    active={isScanning} onSet={setJobFile}    onClear={() => setJobFile(null)}    />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 mt-5 font-mono text-[10px] uppercase font-bold leading-relaxed"
              >
                [ERROR]: {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence>
            {isScanning && !isDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <div className="flex justify-between font-mono text-[9px] text-[#A3A3A3] uppercase mb-2">
                  <span>{SCAN_STEPS[Math.min(currentStep - 1, SCAN_STEPS.length - 1)]?.label}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-[3px] bg-[#F0F0F0] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#22C55E]"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            <button
              onClick={startScan}
              disabled={isScanning}
              className={`flex-1 font-sans font-bold text-[12px] uppercase text-white rounded-[4px] py-5 transition-all flex items-center justify-center gap-3 ${
                isScanning
                  ? "bg-[#22C55E] opacity-50 cursor-not-allowed"
                  : "bg-[#050505] hover:tracking-widest shadow-lg shadow-black/10"
              }`}
            >
              {isScanning && !isDone ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
              {isScanning && !isDone ? "Forensic Engine Active" : "Execute Audit Protocol"}
            </button>

            {(isDone || error) && (
              <button
                onClick={handleReset}
                className="px-5 py-5 font-sans font-bold text-[12px] uppercase text-[#888] border border-[#EEE] rounded-[4px] hover:border-[#CCC] hover:text-[#444] transition-all"
                title="Reset"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Forensic Data Stream HUD */}
        <div className="bg-[#050505] rounded-[4px] p-8 border border-[#111] flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-2xl">

          <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#22C55E 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />

          <div className="relative" style={{ perspective: "1200px" }}>
            <motion.div
              animate={isScanning && !isDone ? { rotateY: [0, 8, -8, 0], rotateX: [0, -5, 5, 0] } : {}}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-[#0A0A0A] w-52 h-72 rounded-[2px] border border-white/10 p-5 flex flex-col gap-4 overflow-hidden"
            >
              <div className="space-y-2 mt-2">
                {[100, 75, 90, 60].map((w, i) => (
                  <motion.div
                    key={i}
                    className="h-[3px] rounded-full bg-white/10"
                    style={{ width: `${w}%` }}
                    animate={isScanning && !isDone ? { opacity: [0.1, 0.4, 0.1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>

              <div className="w-full h-28 border border-white/5 bg-white/[0.02] mt-auto rounded-[1px] flex items-center justify-center">
                <FileText size={40} className={currentStep > 0 ? "text-[#22C55E] opacity-40 animate-pulse" : "text-[#1A1A1A]"} />
              </div>

              {isScanning && !isDone && (
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 w-full h-[3px] bg-[#22C55E] shadow-[0_0_20px_#22C55E] z-30"
                />
              )}

              <AnimatePresence>
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#22C55E]/10 flex items-center justify-center z-40"
                  >
                    <CheckCircle2 size={48} className="text-[#22C55E]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isScanning && !isDone && currentStep >= 1 && currentStep <= SCAN_STEPS.length && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -10, y: 0 }}
                  animate={{ opacity: [0, 1, 0], x: 90, y: -50 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute top-1/2 right-[-40px] font-mono text-[9px] text-[#22C55E] whitespace-nowrap bg-[#050505] border border-[#22C55E]/40 px-3 py-1.5 rounded-[1px] z-40"
                >
                  {`> ${SCAN_STEPS[currentStep - 1]?.label}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status + Log Panel */}
          <div className="mt-16 w-full max-w-[320px] z-20 space-y-3">
            <div className="bg-[#0A0A0A] p-5 border border-white/5 rounded-[2px]">
              <div className="flex justify-between font-mono text-[10px] mb-3">
                <span className="text-[#525252]">SYSTEM_STATUS</span>
                <span className={isDone ? "text-[#22C55E]" : isScanning ? "text-[#22C55E] animate-pulse" : "text-[#FF9F43]"}>
                  {currentStep === 0 ? "IDLE_WAIT" : isDone ? "AUDIT_COMPLETE" : "PROCESSING..."}
                </span>
              </div>

              <div className="space-y-1.5 max-h-[110px] overflow-hidden">
                {SCAN_STEPS.slice(0, Math.max(currentStep - 1, 0)).map((step) => (
                  <motion.div key={step.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-[#22C55E] flex-shrink-0" />
                    <span className="font-mono text-[9px] text-[#444]">{step.label}</span>
                  </motion.div>
                ))}
                {isScanning && !isDone && currentStep <= SCAN_STEPS.length && (
                  <div className="flex items-center gap-2">
                    <Loader2 size={10} className="text-[#22C55E] animate-spin flex-shrink-0" />
                    <span className="font-mono text-[9px] text-[#22C55E]">{SCAN_STEPS[currentStep - 1]?.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA — driven purely off isDone, which derives from resultData */}
            <AnimatePresence mode="wait">
              {isDone && (
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onClick={handleViewResults}
                  className="w-full bg-[#22C55E] text-white font-mono text-[11px] py-5 rounded-[2px] uppercase tracking-[0.25em] font-black shadow-[0_10px_20px_rgba(34,197,94,0.15)] hover:scale-[1.02] transition-transform"
                >
                  ACCESS TRUTH LEDGER →
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

function FileCard({ label, file, active, onSet, onClear }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] text-[#888] tracking-widest uppercase font-bold">{label}</p>
      <div className={`relative h-28 border rounded-[4px] flex flex-col items-center justify-center bg-[#FAFAFA] transition-all duration-500 overflow-hidden ${
        active ? "border-[#22C55E]/60 shadow-inner" : file ? "border-[#22C55E]/40" : "border-[#EAEAEA] hover:border-[#CCC]"
      }`}>
        {file ? (
          <>
            <CheckCircle2 size={28} className="text-[#22C55E]" />
            <span className="font-mono text-[11px] text-[#444] mt-2 font-bold px-4 text-center truncate max-w-full">{file.name}</span>
            <span className="font-mono text-[9px] text-[#AAA] mt-0.5">{(file.size / 1024).toFixed(1)} KB</span>
            {!active && (
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="absolute top-2 right-2 p-1 rounded-full bg-[#F0F0F0] hover:bg-red-50 hover:text-red-500 transition-colors text-[#AAA]"
              >
                <X size={12} />
              </button>
            )}
          </>
        ) : (
          <>
            <Upload size={24} className="text-[#DEDEDE]" />
            <span className="font-mono text-[10px] text-[#BBB] mt-2">Click to upload PDF</span>
          </>
        )}

        {!active && (
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files[0] && onSet(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        )}

        {active && (
          <motion.div
            animate={{ top: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#22C55E]/10 to-transparent pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}