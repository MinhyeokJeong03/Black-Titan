import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, BarChart3, FileText, Settings, 
  Printer, MessageSquare, Zap, AlertCircle, 
  TrendingUp, Activity, ShieldCheck, X, ArrowRight, Sparkles,
  Download, User, Shield, Key, Send, FileCheck, Loader2, Map, PieChart as PieChartIcon, Copy, Plus
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, ReferenceLine,
  PieChart, Pie, Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// UI Logos using Picsum placeholders
const TEAM_LOGO = "https://picsum.photos/seed/black-titan/200/200"; 
const CLIENT_LOGO = "https://picsum.photos/seed/kakaoschool/200/200"; 

// --- [버그 수정] tCO2eq 단위로 변환된 과거 데이터 ---
const initialHistoricalData = [
  { month: '12월', scope1: 3.20, scope2: 8.55 },
  { month: '1월',  scope1: 3.10, scope2: 9.49 },
  { month: '2월',  scope1: 3.05, scope2: 11.39 },
  { month: '3월',  scope1: 2.62, scope2: 9.02 },
  { month: '4월(현재)', scope1: 3.27, scope2: 9.97 },
];

const initialReportList = [
  { title: "2026년 4월 Scope 1·2 정기 보고서", date: "2026-04-17", status: "완료" },
  { title: "현대자동차 공급망 ESG 제출용 요약본", date: "2026-04-10", status: "완료" },
  { title: "CDP (탄소정보공개프로젝트) 대응 초안", date: "2026-03-28", status: "검토중" },
];

// Gemini API Init
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// ==========================================
// 1. 랜딩 페이지
// ==========================================
function LandingPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-[#2aff6e]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={TEAM_LOGO} alt="Black Titan" className="w-10 h-10 rounded-lg object-cover border border-[#2aff6e]/30 shadow-[0_0_15px_rgba(42,255,110,0.2)]" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">탄소<span className="text-[#2aff6e]">零</span></h1>
            <p className="text-[10px] text-[#2aff6e] font-medium -mt-1 uppercase tracking-wider">Enterprise Portal</p>
          </div>
        </div>
        <button onClick={onNext} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#2aff6e] hover:text-black transition-all cursor-pointer">
          <Key size={14} /> 고객사 로그인
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 mt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 border border-[#2aff6e]/30 bg-[#2aff6e]/5 px-4 py-1.5 rounded-full mb-8">
          <ShieldCheck size={14} className="text-[#2aff6e]" />
          <span className="text-xs font-medium text-[#2aff6e]">계약 기업 전용 보안 워크스페이스</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 mt-4">
          <span className="text-[#2aff6e] drop-shadow-[0_0_30px_rgba(42,255,110,0.6)]">미래를 예측하는</span><br />ESG 경영의 시작
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl">
          단순한 과거 데이터 기록을 넘어, 익월 배출량을 예측합니다.<br />AI 기반 시뮬레이션으로 탄소세 리스크를 선제적으로 방어하세요.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={onNext} className="bg-[#2aff6e] text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(42,255,110,0.3)] hover:-translate-y-1 cursor-pointer">
            (주)코코네스쿨 워크스페이스 입장 <ArrowRight size={20} />
          </button>
        </motion.div>
      </main>
    </div>
  );
}

// ==========================================
// 2. 익월 예측 입력 폼
// ==========================================
function InputFormPage({ onGenerate, onBack }: { onGenerate: (data: any) => void, onBack: () => void }) {
  const [elec, setElec] = useState(19500);
  const [gas, setGas] = useState(1100);
  const [diesel, setDiesel] = useState(350);
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = () => {
    setIsScanning(true);
    setTimeout(() => { onGenerate({ elec, gas, diesel }); }, 1500); 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-10 border-b border-white/10">
        <div onClick={onBack} className="flex items-center gap-3 cursor-pointer">
          <img src={TEAM_LOGO} alt="Black Titan" className="w-8 h-8 rounded-lg object-cover border border-[#2aff6e]/30" referrerPolicy="no-referrer" />
          <h1 className="text-xl font-bold tracking-tight">탄소<span className="text-[#2aff6e]">零</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <User size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-300">(주)코코네스쿨 관리자님 환영합니다</span>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 p-8 z-10 mt-4">
        <div className="md:col-span-4 bg-[#0a0a0a] border border-[#2aff6e]/30 p-8 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(42,255,110,0.05)]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">5월(익월) 예상 사용량 입력</h2>
              <span className="bg-[#2aff6e]/20 text-[#2aff6e] text-xs px-2 py-1 rounded font-bold">Predictive AI</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              생산 계획에 따른 다음 달 예상 에너지 사용량을 입력하시면, 선제적 탄소세 방어 시뮬레이션과 리스크 분석을 구동합니다.
            </p>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-blue-400 mb-2"><Zap size={16} /> 예상 전기 사용량 (kWh)</label>
                <input type="number" value={elec} onChange={e => setElec(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-mono outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-yellow-500 mb-2"><AlertCircle size={16} /> 예상 도시가스 사용량 (m³)</label>
                <input type="number" value={gas} onChange={e => setGas(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-mono outline-none focus:border-yellow-500"/>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-purple-400 mb-2"><Activity size={16} /> 예상 경유 구매량 (L)</label>
                <input type="number" value={diesel} onChange={e => setDiesel(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-mono outline-none focus:border-purple-400"/>
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full bg-[#2aff6e] text-black font-bold text-lg py-4 rounded-xl mt-8 flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer">
            {isScanning ? <span className="animate-pulse">예측 모델 가동 중...</span> : <><Sparkles size={20}/> 익월 시뮬레이션 실행</>}
          </button>
        </div>

        <div className="md:col-span-8 flex flex-col items-center justify-center text-center p-8 relative">
          {isScanning ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 border-4 border-[#2aff6e] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(42,255,110,0.3)]"></div>
              <h2 className="text-2xl font-bold text-[#2aff6e] mb-2 animate-pulse uppercase">코코네스쿨 5월 데이터 분석 중...</h2>
              <p className="text-gray-400 text-sm">과거 패턴과 예상 입력값을 기반으로 재무 리스크와 환경 지표를 산출하고 있습니다.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-xl">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-8"><TrendingUp size={40} className="text-blue-400" /></div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">선제적 리스크 관리를 시작하세요</h2>
              <p className="text-gray-400 mb-10 text-lg">좌측에 다음 달 생산 계획에 맞춘 예상 사용량을 입력하고<br/><strong className="text-[#2aff6e]">시뮬레이션 실행</strong> 버튼을 클릭하세요.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. 통합 대시보드 컴포넌트
// ==========================================
function EnterpriseDashboard({ onBack, inputData }: { onBack: () => void, inputData: any }) {
  const [activeTab, setActiveTab] = useState('통합 대시보드');
  const [renewableRatio, setRenewableRatio] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // --- 상태 관리 ---
  const [reportList, setReportList] = useState(initialReportList);
  const [generatedReportText, setGeneratedReportText] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [insightText, setInsightText] = useState("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const [roadmapTarget, setRoadmapTarget] = useState(20);
  const [roadmapPlan, setRoadmapPlan] = useState("");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([
    { sender: 'ai', text: '안녕하세요. 5월 예측 모델 분석이 완료되었습니다. 이번 달(4월) 대비 5월의 리스크를 확인하시겠습니까?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const elecCO2 = (inputData.elec * 0.4747) / 1000;
    const gasCO2 = (inputData.gas * 2.176) / 1000;
    const dieselCO2 = (inputData.diesel * 2.59) / 1000;
    
    const scope1Total = gasCO2 + dieselCO2;
    const scope2Total = elecCO2;
    
    const combinedData = [...initialHistoricalData, { month: '5월(예상)', scope1: scope1Total, scope2: scope2Total, isPrediction: true }];
    const finalData = combinedData.map((d: any) => d.isPrediction ? { ...d, scope2: Math.max(0, d.scope2 * (1 - renewableRatio / 100)) } : d);
    setChartData(finalData);
  }, [inputData, renewableRatio]);

  const currentMonthTotal = initialHistoricalData[initialHistoricalData.length-1].scope1 + initialHistoricalData[initialHistoricalData.length-1].scope2;
  const predictedTotal = chartData.length > 0 ? chartData[chartData.length - 1].scope1 + chartData[chartData.length - 1].scope2 : 0;
  
  const increaseRate = ((predictedTotal - currentMonthTotal) / currentMonthTotal * 100).toFixed(1);
  const isIncreased = Number(increaseRate) > 0;
  const predictedCarbonTax = Math.floor(predictedTotal * 30000);

  // 인쇄 창 호출 (PDF로 저장)
  const handleDownloadPDF = () => { window.print(); };

  // AI 기능 구현 (Streaming via SDK)
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setGeneratedReportText("");
    
    try {
      const prompt = `너는 최고 수준의 ESG 컨설턴트야.
      현재 (주)코코네스쿨의 5월 입력 데이터: 전기 ${inputData.elec}kWh, 가스 ${inputData.gas}m³, 경유 ${inputData.diesel}L.
      예측된 5월 탄소 배출량 총합은 ${predictedTotal.toFixed(2)} tCO2eq 이고, 예상 탄소세는 ${predictedCarbonTax.toLocaleString()}원이야.
      이 데이터를 바탕으로 'GHG Protocol 기반 Scope 1·2 탄소 배출량 보고서'를 삼성전자 협력사 제출용 양식으로 작성해줘. 서론, 배출량 상세 분석, 감축 로드맵 요약이 포함되어야 해.`;

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });

      for await (const chunk of response) {
        setGeneratedReportText(prev => prev + (chunk.text || ""));
      }
      setReportList([{ title: `2026년 5월 Scope 1·2 예측 보고서`, date: new Date().toISOString().split('T')[0], status: "AI생성" }, ...reportList]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGenerateInsight = async () => {
    setIsGeneratingInsight(true);
    setInsightText("");
    
    try {
      const prompt = `과거 월별 배출량 데이터 흐름:
      1월(Scope1:${initialHistoricalData[1].scope1}, Scope2:${initialHistoricalData[1].scope2}tCO2eq), 
      2월(Scope1:${initialHistoricalData[2].scope1}, Scope2:${initialHistoricalData[2].scope2}tCO2eq).
      이 데이터를 보고 "2월에 Scope 2가 급증한 이유(난방 등)와 기업의 현실적인 대응책"을 3문장으로 날카롭게 분석해줘.`;

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });

      for await (const chunk of response) {
        setInsightText(prev => prev + (chunk.text || ""));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setRoadmapPlan("");
    
    try {
      const prompt = `(주)코코네스쿨이 5월 예상 배출량(${predictedTotal.toFixed(2)}톤) 대비 ${roadmapTarget}% 를 감축하려고 해.
      이 기업이 목표를 달성하려면 어떤 순서로 무엇을 해야 하는지 단계별(단기, 중기, 장기) 액션 플랜을 매우 구체적이고 실현 가능하게 작성해줘.`;

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });

      for await (const chunk of response) {
        setRoadmapPlan(prev => prev + (chunk.text || ""));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleSendMessage = async (input: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: input }, { sender: 'ai', text: '' }]);
    setIsTyping(true);

    try {
      const prompt = `너는 블랙 타이탄 팀의 AI ESG 매니저야.
      현재 (주)코코네스쿨 데이터 - 전기:${inputData.elec}kWh, 가스:${inputData.gas}m³, 경유:${inputData.diesel}L. 총 예상배출량:${predictedTotal.toFixed(2)}tCO2eq. 예상 탄소세:${predictedCarbonTax}원.
      사용자 질문: "${input}"
      여기에 대해 ESG 전문가처럼 3문장 이내로 짧고 명확하게 답변해.`;

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });

      for await (const chunk of response) {
        setChatMessages(prev => {
          const newArr = [...prev];
          newArr[newArr.length - 1].text += (chunk.text || "");
          return newArr;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Views ---

  const DashboardView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-blue-950/20 border border-blue-500/20 rounded-2xl relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Predictive</div>
          <div className="flex justify-between items-start mb-4"><span className="text-gray-400 text-xs font-bold uppercase tracking-widest">익월(5월) 예상 배출량</span><Activity size={18} className="text-blue-400" /></div>
          <div className="text-3xl font-mono font-bold text-white">{predictedTotal.toFixed(2)} <span className="text-sm font-sans text-gray-500">t</span></div>
        </div>
        <div className="p-6 bg-[#111] border border-white/10 rounded-2xl relative shadow-inner">
          <div className="flex justify-between items-start mb-4"><span className="text-gray-400 text-xs font-bold uppercase tracking-widest">당월 대비 예측 증감</span><TrendingUp size={18} className={isIncreased ? "text-red-400" : "text-[#2aff6e]"} /></div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${isIncreased ? "text-red-400" : "text-[#2aff6e]"}`}>{isIncreased ? "+" : ""}{increaseRate}%</span>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${isIncreased ? "bg-red-500/10 text-red-400" : "bg-[#2aff6e]/10 text-[#2aff6e]"}`}>{isIncreased ? "초과 예상" : "안정권"}</span>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-br from-red-950/30 to-[#111] border border-red-500/20 rounded-2xl relative shadow-inner">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Risk</div>
          <div className="flex justify-between items-start mb-4"><span className="text-red-400/80 text-xs font-bold uppercase tracking-widest">5월 예상 탄소세</span><AlertCircle size={18} className="text-red-400" /></div>
          <div className="text-3xl font-mono font-bold text-white">₩{predictedCarbonTax.toLocaleString()}</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-[#2aff6e]/10 to-[#111] border border-[#2aff6e]/30 rounded-2xl shadow-[0_0_30px_rgba(42,255,110,0.05)]">
          <div className="flex justify-between items-start mb-4"><span className="text-[#2aff6e] text-xs font-bold uppercase tracking-widest">5월 방어 시뮬레이션 점수</span><Zap size={18} className="text-[#2aff6e]" /></div>
          <div className="text-4xl font-mono font-bold text-[#2aff6e]">82<span className="text-lg opacity-50">/100</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 italic">과거 추이 및 5월 배출량 예측 // Prediction_Protocol</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2aff6e" stopOpacity={0.3}/><stop offset="95%" stopColor="#2aff6e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="month" stroke="#444" fontSize={11} tickLine={false} axisLine={false} tick={{fontFamily: 'JetBrains Mono'}} />
                <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} tick={{fontFamily: 'JetBrains Mono'}} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                <ReferenceLine x="4월(현재)" stroke="#4b5563" strokeDasharray="3 3" label={{ position: 'top', value: '현재', fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="scope1" name="Scope 1" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorScope1)" />
                <Area type="monotone" dataKey="scope2" name="Scope 2" stroke="#2aff6e" strokeWidth={3} fillOpacity={1} fill="url(#colorScope2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-[#111] border border-[#2aff6e]/20 rounded-2xl flex flex-col relative overflow-hidden bg-gradient-to-br from-[#2aff6e]/5 to-transparent">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#2aff6e]/5 rounded-bl-full pointer-events-none"></div>
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-[#2aff6e] tracking-tight"><Zap size={18} /> 5월 방어 시뮬레이터</h3>
          <p className="text-[11px] text-gray-500 mb-8 leading-relaxed font-bold uppercase tracking-tight">다음 달 예상되는 초과 비용을 줄이기 위해, 설비의 재생 에너지 전환율을 조절해 보세요.</p>
          <div className="mb-8">
            <div className="flex justify-between text-xs mb-4 uppercase tracking-widest font-bold"><span>재생 에너지 선제적 전환</span><span className="font-mono font-bold text-[#2aff6e]">{renewableRatio}%</span></div>
            <input type="range" min="0" max="100" value={renewableRatio} onChange={(e) => setRenewableRatio(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#2aff6e] bg-gray-800 relative z-10"/>
          </div>
          <div className="mt-auto bg-black/50 p-4 rounded-xl border border-[#2aff6e]/30 shadow-[0_0_15px_rgba(42,255,110,0.1)]">
            <div className="text-xs text-[#2aff6e] mb-1 font-bold uppercase tracking-widest">5월 예상 탄소세 방어액</div>
            <div className="text-2xl font-mono font-bold text-white leading-none">
              ₩{(renewableRatio * 85000).toLocaleString()} <span className="text-sm text-gray-500 font-sans font-normal uppercase">원 세이브</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AnalysisView = () => {
    const gasCO2 = (inputData.gas * 2.176) / 1000;
    const dieselCO2 = (inputData.diesel * 2.59) / 1000;
    const elecCO2 = (inputData.elec * 0.4747) / 1000;
    const pieData = [
      { name: '전기 (Scope 2)', value: elecCO2, color: '#2aff6e' },
      { name: '가스 (Scope 1)', value: gasCO2, color: '#3b82f6' },
      { name: '경유 (Scope 1)', value: dieselCO2, color: '#a855f7' }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 font-mono flex items-center gap-2"><PieChartIcon size={16}/> 5월 에너지원별 기여도</h3>
            <div className="h-[250px] w-full bg-black/20 rounded-xl flex items-center justify-center p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} formatter={(val: number) => `${val.toFixed(2)} tCO₂`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg">
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 font-mono flex items-center gap-2"><TrendingUp size={16}/> 월별 증감률 표</h3>
             <div className="bg-black/20 rounded-xl overflow-hidden overflow-y-auto max-h-[250px]">
               <table className="w-full text-xs text-left">
                 <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5"><th className="p-3">월</th><th className="p-3">Scope 1</th><th className="p-3">Scope 2</th><th className="p-3">전월비(%)</th></tr></thead>
                 <tbody>
                   {chartData.map((d, i) => {
                      const total = d.scope1 + d.scope2;
                      let change = 0;
                      if (i > 0) {
                        const prevTotal = chartData[i-1].scope1 + chartData[i-1].scope2;
                        change = ((total - prevTotal) / prevTotal) * 100;
                      }
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3 text-gray-300 font-mono">{d.month}</td><td className="p-3 font-mono">{d.scope1.toFixed(2)}</td><td className="p-3 font-mono">{d.scope2.toFixed(2)}</td>
                          <td className={`p-3 font-bold font-mono ${change > 0 ? 'text-red-400' : change < 0 ? 'text-[#2aff6e]' : 'text-gray-400'}`}>
                            {i === 0 ? '-' : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
                          </td>
                        </tr>
                      )
                   })}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
        <div className="p-6 bg-[#0a0a0a] border border-[#2aff6e]/20 rounded-2xl shadow-lg relative">
           <button onClick={handleGenerateInsight} disabled={isGeneratingInsight} className="mb-4 bg-[#2aff6e]/10 text-[#2aff6e] border border-[#2aff6e]/50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#2aff6e] hover:text-black transition uppercase flex items-center gap-2 tracking-widest cursor-pointer">
             {isGeneratingInsight ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>} AI 인사이트 생성
           </button>
           <div className="bg-black/50 p-5 rounded-xl border border-white/10 min-h-[100px]">
             {insightText ? (
               <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{insightText}</p>
             ) : (
               <p className="text-sm text-gray-600 italic">버튼을 클릭하면 차트 데이터를 기반으로 AI 분석이 시작됩니다.</p>
             )}
           </div>
        </div>
      </motion.div>
    );
  };

  const ReportView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300 font-mono">리포트 센터 // ARCHIVE</h3>
          <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="bg-[#2aff6e]/10 text-[#2aff6e] border border-[#2aff6e]/50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#2aff6e] hover:text-black transition uppercase tracking-widest flex items-center gap-2 cursor-pointer">
            {isGeneratingReport ? <Loader2 size={14} className="animate-spin"/> : <Plus size={14}/>} GENERATE_NEW
          </button>
        </div>
        <div className="space-y-4">
          {reportList.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#2aff6e]/30 transition-all group shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-[#2aff6e] flex items-center justify-center border border-white/5 group-hover:border-[#2aff6e]/20"><FileCheck size={20} /></div>
                <div><h4 className="font-bold text-sm text-gray-200">{item.title}</h4><p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-1">{item.date}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest ${item.status === 'AI생성' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : item.status === '완료' ? 'bg-[#2aff6e]/10 text-[#2aff6e] border border-[#2aff6e]/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{item.status}</span>
                <button className="text-gray-500 hover:text-white transition-colors cursor-pointer"><Download size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full bg-black/20 p-5 rounded-2xl border border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#2aff6e] mb-4 flex items-center gap-2"><Sparkles size={14}/> AI 자동 생성 보고서</h3>
        <textarea 
          readOnly 
          value={generatedReportText || "GENERATE_NEW 버튼을 클릭하면 삼성전자 협력사 제출용 탄소 배출량 보고서가 자동으로 작성됩니다."}
          className="flex-1 w-full bg-transparent border border-white/10 rounded-xl p-4 text-sm text-gray-300 outline-none resize-none min-h-[300px] font-mono leading-relaxed"
        />
        <button onClick={() => navigator.clipboard.writeText(generatedReportText)} className="mt-4 bg-white/5 border border-white/10 text-gray-300 px-4 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition flex items-center justify-center gap-2 cursor-pointer">
          <Copy size={14}/> 텍스트 복사하기
        </button>
      </div>
    </motion.div>
  );

  const RoadmapView = () => {
    const savings = predictedCarbonTax * (roadmapTarget / 100);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0a0a0a] border border-[#2aff6e]/30 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2aff6e] mb-6 flex items-center gap-2 font-mono"><Map size={16}/> 감축 목표 설정</h3>
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-4 font-bold text-white tracking-widest"><span>타겟 감축률</span><span className="text-[#2aff6e] text-xl font-mono">{roadmapTarget}%</span></div>
                <input type="range" min="10" max="50" step="5" value={roadmapTarget} onChange={(e) => setRoadmapTarget(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#2aff6e] bg-gray-800"/>
              </div>
              <div className="bg-black/50 p-5 rounded-xl border border-white/5 mb-4">
                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">목표 달성 시 월별 예상 절감액</p>
                <p className="text-2xl font-mono font-bold text-white">₩{Math.floor(savings).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={handleGenerateRoadmap} disabled={isGeneratingRoadmap} className="w-full bg-[#2aff6e] text-black font-bold py-3.5 rounded-xl hover:bg-white transition shadow-[0_0_15px_rgba(42,255,110,0.3)] flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest text-xs">
              {isGeneratingRoadmap ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} AI 감축 플랜 생성
            </button>
          </div>
          <div className="lg:col-span-2 p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4 font-mono">단계별 액션 플랜 (로드맵)</h3>
            <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-6 overflow-y-auto">
               {roadmapPlan ? <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{roadmapPlan}</div> : <div className="h-full flex items-center justify-center text-gray-600 text-sm font-mono">좌측에서 목표를 설정하고 AI 플랜을 생성하세요.</div>}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SettingsView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-10 flex items-center gap-2 font-mono"><User size={20}/> 기업 계정 정보 // Core_Creds</h3>
        <div className="grid grid-cols-2 gap-8">
          <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-[0.2em]">회사명</label><input type="text" value="(주)코코네스쿨" readOnly className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm text-[#2aff6e] font-bold font-mono outline-none"/></div>
          <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-[0.2em]">사업자 번호</label><input type="text" value="123-45-67890" readOnly className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm text-gray-400 font-mono outline-none"/></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-[#2aff6e] selection:text-black relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a]/80 backdrop-blur-3xl p-6 flex flex-col z-10 shrink-0">
        <div onClick={onBack} className="flex items-center gap-3 mb-16 cursor-pointer hover:opacity-80 transition group">
          <img src={TEAM_LOGO} alt="BT" className="w-10 h-10 rounded-lg object-cover border border-[#2aff6e]/30 shadow-[0_0_15px_rgba(42,255,110,0.2)]" referrerPolicy="no-referrer" />
          <div><h1 className="text-2xl font-bold tracking-tighter leading-none">탄소<span className="text-[#2aff6e]">零</span></h1><span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.4em]">PRO_SYSTEM</span></div>
        </div>
        <nav className="space-y-1.5 flex-1">
          {[
            { icon: LayoutDashboard, label: '통합 대시보드' },
            { icon: BarChart3, label: '세부 분석' },
            { icon: FileText, label: '리포트 센터' },
            { icon: Map, label: '감축 로드맵' },
            { icon: Settings, label: '환경 설정' },
          ].map((item, idx) => (
            <button key={idx} onClick={() => setActiveTab(item.label)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold cursor-pointer ${activeTab === item.label ? 'bg-[#2aff6e]/10 text-[#2aff6e] border border-[#2aff6e]/20 shadow-[0_0_20px_rgba(42,255,110,0.05)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
              <item.icon size={18} /><span className="text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
           <div className="flex items-center gap-2 mb-2"><Shield size={12} className="text-[#2aff6e]" /><span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">보안 연동망</span></div>
           <p className="text-[9px] text-gray-500 leading-tight font-mono uppercase">TLS_1.3: ENCRYPTED<br/>NODES: ACTIVE_24</p>
        </div>
      </aside>

      <main ref={dashboardRef} className="flex-1 p-10 lg:p-14 overflow-y-auto z-10">
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
          <div><h2 className="text-4xl font-extrabold tracking-tighter mb-2 italic uppercase">{activeTab} // Protocol</h2><p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">(주)코코네스쿨 5월 예측 모델 분석 완료 및 데이터 연동 중</p></div>
          <div className="flex gap-4">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"><Printer size={16} /> PRINT_REPORT</button>
          </div>
        </header>
        <AnimatePresence mode="wait">
          {activeTab === '통합 대시보드' && <DashboardView key="dashboard" />}
          {activeTab === '세부 분석' && <AnalysisView key="analysis" />}
          {activeTab === '리포트 센터' && <ReportView key="reports" />}
          {activeTab === '감축 로드맵' && <RoadmapView key="roadmap" />}
          {activeTab === '환경 설정' && <SettingsView key="settings" />}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="absolute bottom-16 right-0 w-80 lg:w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-[#2aff6e]/10 p-4 border-b border-white/5 flex justify-between items-center"><div className="flex items-center gap-2"><Zap size={16} className="text-[#2aff6e]" /><span className="font-bold text-xs text-[#2aff6e] uppercase tracking-widest">AI 리스크 매니저 // v5.1</span></div><button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white cursor-pointer"><X size={16}/></button></div>
              <div className="p-4 h-72 overflow-y-auto space-y-4 bg-black/50 text-xs flex flex-col scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.sender === 'ai' && <div className="w-6 h-6 rounded-lg bg-[#2aff6e]/20 border border-[#2aff6e]/20 flex items-center justify-center shrink-0 mt-1"><Zap size={12} className="text-[#2aff6e]" /></div>}
                    <div className={`p-3.5 max-w-[85%] leading-relaxed border font-sans font-medium whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-[#2aff6e] text-black border-[#2aff6e] rounded-tl-xl rounded-b-xl font-bold' : 'bg-white/5 text-gray-300 border-white/5 rounded-tr-xl rounded-b-xl'}`}>{msg.text}</div>
                  </div>
                ))}
                {isTyping && <div className="flex gap-3"><div className="w-6 h-6 rounded-lg bg-[#2aff6e]/20 border border-[#2aff6e]/20 flex items-center justify-center shrink-0 mt-1"><Zap size={12} className="text-[#2aff6e]" /></div><div className="p-3 bg-white/5 text-gray-500 border border-white/5 rounded-tr-xl rounded-b-xl flex gap-1 items-center font-mono">PREDICTING<span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></div></div>}
              </div>
              <div className="p-4 bg-bg-dim border-t border-white/10 shadow-inner">
                <div className="flex gap-2">
                  <input type="text" placeholder="ENTER_QUERY..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white focus:outline-none focus:border-[#2aff6e]/30 transition-all font-sans" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; if (val) { handleSendMessage(val); (e.target as HTMLInputElement).value = ''; } } }} />
                  <button className="bg-white/5 border border-white/10 p-2 rounded-xl text-gray-400 hover:text-[#2aff6e] transition-colors cursor-pointer"><Send size={14}/></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(true)} className="w-14 h-14 bg-[#2aff6e] text-black rounded-full shadow-[0_0_30px_rgba(42,255,110,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative cursor-pointer"><MessageSquare size={24} className="fill-black" /><span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-[#050505] rounded-full animate-pulse"></span></button>
      </div>
    </div>
  );
}

// ==========================================
// 4. 최상위 App 컴포넌트
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'input' | 'dashboard'>('landing');
  const [formData, setFormData] = useState<any>(null);

  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <LandingPage onNext={() => setCurrentView('input')} />
        </motion.div>
      )}
      {currentView === 'input' && (
        <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
          <InputFormPage onGenerate={(data) => { setFormData(data); setCurrentView('dashboard'); }} onBack={() => setCurrentView('landing')} />
        </motion.div>
      )}
      {currentView === 'dashboard' && (
        <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <EnterpriseDashboard inputData={formData} onBack={() => setCurrentView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
