import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { 
  Code2, Terminal, Cpu, Layout, Globe, 
  CheckCircle2, ArrowRight, Menu, X, Github, Twitter
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components: Background Shader (Canvas) ---
const BackgroundShader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let dots = [];
    let mouse = { x: -1000, y: -1000 };
    let beams = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];
      // Non-uniform distribution
      const dotCount = Math.floor((width * height) / 4000); 
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseAlpha: Math.random() * 0.3 + 0.1,
          alpha: Math.random() * 0.3 + 0.1,
          flickerSpeed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Add beam trail
      beams.push({ 
        x: mouse.x, 
        y: mouse.y, 
        age: 0, 
        color: `hsl(${Math.random() * 60 + 200}, 100%, 50%)` // Blue to Cyan range
      });
    };

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw Dots
      dots.forEach(dot => {
        // Blipping Logic
        dot.phase += dot.flickerSpeed;
        const flicker = Math.sin(dot.phase);
        
        // Random "hard" blip
        if (Math.random() > 0.995) dot.alpha = 1;
        else dot.alpha = dot.baseAlpha + (flicker * 0.1);

        ctx.fillStyle = `rgba(100, 116, 139, ${Math.max(0, dot.alpha)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Beams (Mouse Trails)
      // Connect recent beam points to create fluid light
      if (beams.length > 1) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'butt'; // Sharp edges on lines
        
        for (let i = 0; i < beams.length - 1; i++) {
          const p1 = beams[i];
          const p2 = beams[i+1];
          
          p1.age++;
          
          ctx.strokeStyle = p1.color.replace(')', `, ${1 - p1.age/20})`); // Fade out
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      
      // Cleanup old beams
      beams = beams.filter(b => b.age < 20);

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    draw();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

// --- Component: Navbar ---
const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-black-300 bg-black-100/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="font-sans font-bold text-xl tracking-tighter text-white">
        ACETERNITY
      </div>
      <div className="hidden md:flex items-center gap-8 font-mono text-sm text-gray-400">
        {['Services', 'Methodology', 'Careers'].map((item) => (
          <a key={item} href="#" className="hover:text-blue-glow transition-colors uppercase tracking-widest">
            {item}
          </a>
        ))}
        <button className="bg-white text-black px-4 py-2 font-bold hover:bg-blue-glow transition-colors uppercase text-xs">
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

// --- Component: Hero Code Editor ---
const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState('');
  
  const files = [
    { name: 'Future.tsx', code: "import { Future } from '@aceternity/ui';\n\nexport const NextGen = () => {\n  return (\n    <Future\n      quality='infinite'\n      speed={100}\n      edges='sharp'\n    />\n  );\n};" },
    { name: 'Style.css', code: ".universe {\n  background: #000;\n  border-radius: 0px;\n  overflow: hidden;\n  /* The void stares back */\n}" },
    { name: 'Config.json', code: "{\n  \"optimization\": true,\n  \"latency\": 0,\n  \"design\": \"systematic\"\n}" }
  ];

  // Auto-switch tabs
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % files.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter Effect
  useEffect(() => {
    let currentText = '';
    const targetText = files[activeTab].code;
    let currentIndex = 0;
    setText(''); // Reset immediately

    const typeInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        currentText += targetText[currentIndex];
        setText(currentText);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 20); // Fast typing speed

    return () => clearInterval(typeInterval);
  }, [activeTab]);

  return (
    <div className="w-full max-w-lg mx-auto md:mr-0 mt-8 md:mt-0 relative group">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="relative bg-black-200 border border-black-300 h-[300px] flex flex-col overflow-hidden">
        {/* Window Controls */}
        <div className="h-8 bg-black-100 border-b border-black-300 flex items-center px-4 gap-2">
          <div className="w-3 h-3 bg-red-500 hover:bg-red-400 cursor-pointer" />
          <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-400 cursor-pointer" />
          <div className="w-3 h-3 bg-green-500 hover:bg-green-400 cursor-pointer" />
        </div>

        {/* Tabs */}
        <div className="flex bg-black-100 border-b border-black-300 overflow-hidden">
          {files.map((file, idx) => (
            <motion.div
              key={file.name}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "px-4 py-2 text-xs font-mono cursor-pointer border-r border-black-300 transition-colors",
                activeTab === idx ? "bg-black-200 text-blue-glow" : "text-gray-500 hover:text-gray-300"
              )}
              initial={false}
              animate={{ backgroundColor: activeTab === idx ? '#121212' : '#0a0a0a' }}
            >
              {file.name}
            </motion.div>
          ))}
        </div>

        {/* Code Area */}
        <div className="p-4 font-mono text-xs md:text-sm text-gray-300 overflow-hidden whitespace-pre font-medium leading-relaxed">
          <span className="text-blue-400">{text}</span>
          <motion.span 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-blue-500 align-middle ml-1"
          />
        </div>
      </div>
    </div>
  );
};

// --- Component: Hero Section ---
const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-12 px-6 flex flex-col justify-center z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            BUILDING THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
              DIGITAL FUTURE
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-light leading-relaxed">
            We craft pixel-perfect, high-performance interfaces with zero compromise. 
            Sharp edges. Clean code. Infinite possibilities.
          </p>
          
          <div className="flex items-stretch max-w-md h-12">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-black-200 border border-black-300 border-r-0 text-white px-4 flex-1 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 font-mono text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 font-bold uppercase text-sm tracking-wider transition-colors flex items-center gap-2">
              Join Waitlist
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CodeEditor />
        </motion.div>
      </div>
    </section>
  );
};

// --- Component: Bento Grid & Visualizations ---

const BentoCard = ({ title, desc, children, className }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={cn(
      "bg-black-200 border border-black-300 p-6 flex flex-col justify-between group overflow-hidden relative",
      className
    )}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
    
    <div className="h-32 mb-4 w-full flex items-center justify-center bg-black-100/50 border border-black-300/50 relative overflow-hidden">
      {children}
    </div>
    
    <div>
      <h3 className="text-white font-bold text-lg mb-1 tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <section className="py-24 px-6 bg-black-100 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tighter">OUR EXPERTISE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          
          {/* 1. Web Design (Wireframe Evolving) */}
          <BentoCard title="Web Design" desc="Architecting layouts with precision." className="md:col-span-2">
            <div className="relative w-full h-full p-4 flex gap-2">
              <motion.div 
                className="w-1/4 h-full bg-black-300 border border-gray-700"
                initial={{ height: "10%" }}
                animate={{ height: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="w-3/4 h-full flex flex-col gap-2">
                <motion.div 
                  className="w-full h-1/3 bg-black-300 border border-gray-700"
                  initial={{ width: "20%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="flex gap-2 h-2/3">
                   <motion.div 
                    className="w-1/2 bg-blue-900/20 border border-blue-500/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                   />
                   <motion.div 
                    className="w-1/2 bg-black-300 border border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
                   />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Test Driven (Checkmarks) */}
          <BentoCard title="Test Driven" desc="Code that verifies itself.">
            <div className="flex flex-col gap-2 w-full px-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <CheckCircle2 size={18} className="text-green-500" />
                  </motion.div>
                  <div className="h-2 bg-gray-800 w-full" />
                </div>
              ))}
            </div>
          </BentoCard>

          {/* 3. Latest Tech (Floating Icons) */}
          <BentoCard title="Latest Tech Stack" desc="Next.js, React, Tailwind, Framer.">
             <div className="relative w-full h-full flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-blue-500/30 bg-blue-900/10 p-2"
                    animate={{ 
                      y: [0, -10, 0], 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3 + i, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i 
                    }}
                    style={{ left: `${30 + i * 20}%` }}
                  >
                    <Cpu size={24} className="text-blue-400" />
                  </motion.div>
                ))}
             </div>
          </BentoCard>

          {/* 4. Copywriting (Typing Lines) */}
          <BentoCard title="Copywriting" desc="Compelling narratives." className="md:col-span-1">
             <div className="flex flex-col gap-3 w-full px-6 items-start justify-center h-full">
                {[80, 60, 90, 40].map((width, i) => (
                  <motion.div
                    key={i}
                    className="h-2 bg-gray-600"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                ))}
             </div>
          </BentoCard>

          {/* 5. Web Development (Code Tags) */}
          <BentoCard title="Web Development" desc="Robust, scalable architecture." className="md:col-span-1">
            <div className="font-mono text-xs text-green-400 flex flex-col justify-center h-full">
              <motion.div animate={{ opacity: [0,1,1,0] }} transition={{ duration: 2, repeat: Infinity }}>
                &lt;Component /&gt;
              </motion.div>
              <motion.div animate={{ opacity: [0,1,1,0] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }}>
                &nbsp;&nbsp;useEffect(() =&gt; &#123;
              </motion.div>
              <motion.div animate={{ opacity: [0,1,1,0] }} transition={{ duration: 2, delay: 1, repeat: Infinity }}>
                &nbsp;&nbsp;&#125;);
              </motion.div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
};

// --- Component: Testimonials (Draggable) ---
const Testimonials = () => {
  const reviews = [
    { name: "Alex K.", role: "CEO, TechFlow", text: "The sharpest design we've ever seen. Absolutely flawless execution." },
    { name: "Sarah M.", role: "Founder, Zenith", text: "Aceternity transformed our digital presence. Minimal yet powerful." },
    { name: "David R.", role: "CTO, GridLock", text: "Code quality is unmatched. The animations are buttery smooth." },
    { name: "Elena Y.", role: "Dir. Product, Aura", text: "A futuristic approach that actually converts. Highly recommended." },
  ];

  return (
    <section className="py-24 bg-black overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tighter">CLIENT INTEL</h2>
      </div>
      
      <motion.div className="cursor-grab active:cursor-grabbing overflow-hidden">
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -1000 }}
          className="flex gap-6 px-6 w-max"
        >
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              className="w-[350px] bg-black-200 border border-black-300 p-8 flex flex-col gap-4 select-none"
              whileHover={{ borderColor: "#3b82f6" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center text-xs text-white font-mono">
                  {r.name.substring(0,2)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{r.name}</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">{r.role}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"{r.text}"</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- Component: Founder & CTA ---
const FounderAndCTA = () => (
  <section className="py-24 px-6 bg-black-100 z-10 relative border-t border-black-300">
    <div className="max-w-5xl mx-auto space-y-24">
      
      {/* Founder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="relative aspect-square bg-black-200 border border-black-300 group overflow-hidden"
          whileHover={{ scale: 0.98 }}
        >
           {/* Placeholder for Founder Image */}
           <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-700 font-mono text-sm">
             [FOUNDER_IMG_404]
           </div>
           <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-500" />
           {/* Scanline */}
           <div className="absolute top-0 w-full h-1 bg-blue-500/50 opacity-0 group-hover:opacity-100 animate-scan" />
        </motion.div>
        
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">THE ARCHITECT</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Obsessed with the intersection of brutalism and futurism. 
            Building digital experiences that don't just function—they perform.
          </p>
          <div className="flex gap-4">
            <Github className="text-white cursor-pointer hover:text-blue-500 transition-colors" />
            <Twitter className="text-white cursor-pointer hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-8 py-12 border-y border-black-300 bg-black-200/50 backdrop-blur-sm">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
          Ready to Initiate?
        </h2>
        <p className="text-blue-500 font-mono animate-pulse">
          ⚠ LIMITED SLOTS AVAILABLE FOR Q4
        </p>
        <button className="bg-white text-black px-12 py-4 text-xl font-bold uppercase hover:bg-blue-500 hover:text-white transition-all duration-300 tracking-widest">
          Book a Call
        </button>
      </div>

    </div>
  </section>
);

// --- Component: Footer ---
const Footer = () => (
  <footer className="bg-black py-8 border-t border-black-300 text-center z-10 relative">
    <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">
      © 2024 Aceternity Studios. System Operational.
    </p>
  </footer>
);

// --- Main App ---
const AceternityLanding = () => {
  return (
    <div className="bg-black min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      <BackgroundShader />
      <Navbar />
      <main className="relative z-10 flex flex-col gap-0">
        <Hero />
        <Features />
        <Testimonials />
        <FounderAndCTA />
      </main>
      <Footer />
      
      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0% }
          100% { top: 100% }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AceternityLanding;
