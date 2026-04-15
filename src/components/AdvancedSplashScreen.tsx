import React, { useEffect, useRef, useState } from 'react';

interface AdvancedSplashScreenProps {
  onComplete: () => void;
}

export default function AdvancedSplashScreen({ onComplete }: AdvancedSplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const W_ = container;
    const cvs = [0, 1, 2, 3].map(i => container.querySelector(`#c${i}`) as HTMLCanvasElement).filter(c => c !== null);
    if (cvs.length === 0) return;
    
    const ctxs = cvs.map(c => c.getContext('2d')!).filter(ctx => ctx !== null);
    if (ctxs.length === 0) return;
    
    let W: number, H: number, CX: number, CY: number;

    const PC = ['#FF9933', '#FFFFFF', '#138808', '#00D4FF', '#7B2FFF', '#FFD700', '#FF6B6B', '#4ECDC4'];
    const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Surat'];

    function rsz() {
      if (!W_ || !W_.clientWidth) return;
      W = W_.clientWidth;
      H = W_.clientHeight;
      CX = W / 2;
      CY = H / 2;
      cvs.forEach(c => {
        if (c) {
          c.width = W;
          c.height = H;
        }
      });
    }
    rsz();

    const M = {
      lr: (a: number, b: number, t: number) => a + (b - a) * t,
      cl: (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v)),
      rn: (a: number, b: number) => a + Math.random() * (b - a),
      ri: (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1)),
      rf: <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)],
      h2r: (h: string) => {
        const r = parseInt(h.slice(1, 3), 16);
        const g = parseInt(h.slice(3, 5), 16);
        const b = parseInt(h.slice(5, 7), 16);
        return { r, g, b };
      }
    };

    // Stars
    class Star {
      a: number;
      d: number;
      sp: number;
      sz: number;
      br: number;
      wl: number;
      col: string;

      constructor() {
        this.rst(true);
      }

      rst(init?: boolean) {
        this.a = Math.random() * Math.PI * 2;
        this.d = init ? Math.random() * Math.max(W, H) * 0.6 : 2;
        this.sp = M.rn(0.3, 1.6);
        this.sz = M.rn(0.3, 1.5);
        this.br = M.rn(0.3, 1);
        this.wl = 0;
        this.col = Math.random() < 0.85 ? '#fff' : M.rf(['#00D4FF', '#FF9933', '#7B2FFF', '#FFD700']);
      }

      upd(warp: boolean, dt: number) {
        this.d += this.sp * (warp ? 7 : 1) * dt * 0.06;
        this.wl = warp ? Math.min(this.d * 0.28, 55) : 0;
        if (this.d > Math.max(W, H) * 0.76) this.rst();
      }

      drw(ctx: CanvasRenderingContext2D) {
        const x = CX + Math.cos(this.a) * this.d;
        const y = CY + Math.sin(this.a) * this.d;
        const al = M.cl(this.d / 55, 0, 1) * this.br;
        ctx.save();
        ctx.globalAlpha = al;
        if (this.wl > 3) {
          const x0 = CX + Math.cos(this.a) * (this.d - this.wl);
          const y0 = CY + Math.sin(this.a) * (this.d - this.wl);
          const g = ctx.createLinearGradient(x0, y0, x, y);
          g.addColorStop(0, 'transparent');
          g.addColorStop(1, this.col);
          ctx.strokeStyle = g;
          ctx.lineWidth = this.sz * 0.7;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.fillStyle = this.col;
          ctx.beginPath();
          ctx.arc(x, y, this.sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const SF = {
      stars: [] as Star[],
      init() {
        this.stars = Array.from({ length: 220 }, () => new Star());
      },
      upd(warp: boolean, ph: number, dt: number) {
        if (ph >= 0) this.stars.forEach(s => s.upd(warp, dt));
      },
      drw(ctx: CanvasRenderingContext2D, ph: number) {
        if (ph >= 0) this.stars.forEach(s => s.drw(ctx));
      }
    };
    SF.init();

    // Nebula
    class Neb {
      x: number;
      y: number;
      rx: number;
      ry: number;
      al: number;
      col: string;
      dx: number;
      dy: number;
      pf: number;
      pp: number;

      constructor(i: number) {
        this.x = M.rn(0.1, 0.9);
        this.y = M.rn(0.1, 0.9);
        this.rx = M.rn(0.14, 0.32);
        this.ry = M.rn(0.11, 0.26);
        this.al = M.rn(0.04, 0.09);
        this.col = PC[i % 4];
        this.dx = M.rn(-0.00008, 0.00008);
        this.dy = M.rn(-0.00006, 0.00006);
        this.pf = M.rn(0.0004, 0.0009);
        this.pp = Math.random() * Math.PI * 2;
      }

      upd() {
        this.x = M.cl(this.x + this.dx, 0.05, 0.95);
        this.y = M.cl(this.y + this.dy, 0.05, 0.95);
        if (this.x <= 0.05 || this.x >= 0.95) this.dx *= -1;
        if (this.y <= 0.05 || this.y >= 0.95) this.dy *= -1;
      }

      drw(ctx: CanvasRenderingContext2D, t: number, fi: number) {
        const pulse = 0.85 + 0.15 * Math.sin(t * this.pf + this.pp);
        const a = this.al * pulse * fi;
        const gx = this.x * W;
        const gy = this.y * H;
        const rx = this.rx * W;
        const ry = this.ry * H;
        const r = Math.max(rx, ry);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        const { r: cr, g: cg, b: cb } = M.h2r(this.col);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
        g.addColorStop(0.5, `rgba(${cr},${cg},${cb},${a * 0.35})`);
        g.addColorStop(1, 'transparent');
        ctx.save();
        ctx.scale(rx / r, ry / r);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx * (r / rx), gy * (r / ry), r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const NEB = {
      clouds: Array.from({ length: 8 }, (_, i) => new Neb(i)),
      upd() {
        this.clouds.forEach(c => c.upd());
      },
      drw(ctx: CanvasRenderingContext2D, t: number, ph: number) {
        if (ph < 1) return;
        const fi = M.cl((t - 500) / 1400, 0, 1);
        this.clouds.forEach(c => c.drw(ctx, t, fi));
      }
    };

    // Grid
    const GRID = {
      sy: 0,
      fi: 0,
      upd(ph: number, dt: number, t: number) {
        if (ph < 1) return;
        this.fi = M.cl((t - 500) / 1100, 0, 1);
        if (ph >= 2) this.sy = (this.sy + 0.44 * dt * 0.06) % 55;
      },
      drw(ctx: CanvasRenderingContext2D, ph: number) {
        if (ph < 1 || !this.fi) return;
        ctx.save();
        ctx.globalAlpha = this.fi * 0.22;
        ctx.strokeStyle = 'rgba(0,212,255,.28)';
        ctx.lineWidth = 0.7;
        const hz = H * 0.6;
        const fov = H * 0.85;
        const rows = 18;
        const cols = Math.ceil(W / 55) + 2;
        for (let r = 0; r <= rows; r++) {
          const p = ((r + this.sy / 55) % rows + rows) % rows;
          const pn = p / rows;
          const ypx = hz + fov * (pn * 0.8 + 0.1);
          if (ypx > H) continue;
          const persp = M.cl(1 - pn * 0.7, 0.15, 1);
          const hw = (W * 0.5) / persp;
          ctx.globalAlpha = this.fi * 0.22 * persp;
          ctx.beginPath();
          ctx.moveTo(CX - hw, ypx);
          ctx.lineTo(CX + hw, ypx);
          ctx.stroke();
        }
        ctx.globalAlpha = this.fi * 0.16;
        for (let c = -cols; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(CX + c * 55, hz);
          ctx.lineTo(CX + c * 55 * 8, H);
          ctx.stroke();
        }
        ctx.restore();
      }
    };

    // UI Control
    let phase = 0;
    const tmrs: NodeJS.Timeout[] = [];
    const pds = container.querySelectorAll('.pd');
    const bt = container.querySelector('#bt') as HTMLElement;
    const bb = container.querySelector('#bb') as HTMLElement;
    const ltop = container.querySelector('#ltop') as HTMLElement;
    const lbot = container.querySelector('#lbot') as HTMLElement;
    const tri = container.querySelector('#tri') as HTMLElement;
    const sub = container.querySelector('#sub') as HTMLElement;
    const dot = container.querySelector('#dot') as HTMLElement;
    const holoEl = container.querySelector('#holo') as HTMLElement;
    const crns = container.querySelectorAll('.crn');
    const skip = container.querySelector('#skip') as HTMLButtonElement;
    const arcEl = container.querySelector('#arc') as SVGCircleElement;
    const cityline = container.querySelector('#cityline') as HTMLElement;

    function setPh(p: number) {
      phase = p;
      pds.forEach((d, i) => d.classList.toggle('on', i === p));
    }

    let letterEls: HTMLElement[] = [];

    function buildLetters() {
      const lb = container.querySelector('#lbox') as HTMLElement;
      lb.innerHTML = '';
      letterEls = [];
      'LINE FREE INDIA'.split('').forEach((c) => {
        const el = document.createElement('span');
        el.className = 'L' + (c === ' ' ? ' sp' : '');
        el.textContent = c === ' ' ? '\u00A0' : c;
        lb.appendChild(el);
        letterEls.push(el);
      });
    }

    function revealLetters() {
      letterEls.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('on');
        }, i * 58);
      });
    }

    function runTimers() {
      tmrs.forEach(clearTimeout);
      tmrs.length = 0;
      cityline.style.opacity = '0';

      tmrs.push(setTimeout(() => {
        setPh(1);
        bt.classList.add('on');
        bb.classList.add('on');
        crns.forEach(c => c.classList.add('on'));
        skip.classList.add('on');
        holoEl.style.opacity = '.45';
      }, 500));

      tmrs.push(setTimeout(() => setPh(2), 2000));
      tmrs.push(setTimeout(() => setPh(3), 4000));
      tmrs.push(setTimeout(() => {
        setPh(4);
        ltop.style.width = '120px';
        revealLetters();
        setTimeout(() => {
          tri.style.width = '148px';
        }, 380);
        cityline.style.opacity = '1';
        cityline.textContent = CITIES[0];
      }, 6200));

      tmrs.push(setTimeout(() => {
        setPh(5);
        sub.style.opacity = '1';
        sub.style.transform = 'translateY(0)';
        dot.style.opacity = '1';
        dot.style.transform = 'scale(1)';
        lbot.style.width = '88px';
      }, 8000));

      tmrs.push(setTimeout(() => {
        onComplete();
      }, 9500));
    }

    function doSkip() {
      tmrs.forEach(clearTimeout);
      onComplete();
    }

    skip.addEventListener('click', doSkip);

    // Main Loop
    let startT = performance.now();
    let lastF = startT;
    let rafId: number;

    function frame(now: number) {
      const t = now - startT;
      const dt = now - lastF;
      lastF = now;
      const ph = phase;

      // Progress arc
      const p = M.cl(t / 9500, 0, 1);
      arcEl.style.strokeDashoffset = (188.5 * (1 - p)).toFixed(1);

      // BG canvas
      const c0 = ctxs[0];
      c0.clearRect(0, 0, W, H);

      // Base glow bg
      const bg1 = c0.createRadialGradient(W * 0.2, H * 0.2, 0, W * 0.2, H * 0.2, W * 0.55);
      bg1.addColorStop(0, 'rgba(0,212,255,.11)');
      bg1.addColorStop(1, 'transparent');
      c0.fillStyle = bg1;
      c0.fillRect(0, 0, W, H);

      const bg2 = c0.createRadialGradient(W * 0.8, H * 0.8, 0, W * 0.8, H * 0.8, W * 0.5);
      bg2.addColorStop(0, 'rgba(123,47,255,.09)');
      bg2.addColorStop(1, 'transparent');
      c0.fillStyle = bg2;
      c0.fillRect(0, 0, W, H);

      if (ph >= 2) {
        const pa = 0.04 + 0.03 * Math.sin(t * 0.001);
        const bg3 = c0.createRadialGradient(CX, CY, 0, CX, CY, W * 0.3);
        bg3.addColorStop(0, `rgba(255,153,51,${pa.toFixed(3)})`);
        bg3.addColorStop(1, 'transparent');
        c0.fillStyle = bg3;
        c0.fillRect(0, 0, W, H);
      }

      SF.upd(ph >= 0 && t < 2400, ph, dt);
      SF.drw(c0, ph);
      NEB.upd();
      NEB.drw(c0, t, ph);
      GRID.upd(ph, dt, t);
      GRID.drw(c0, ph);

      rafId = requestAnimationFrame(frame);
    }

    buildLetters();
    runTimers();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      tmrs.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} id="W" className="fixed inset-0 z-[10000] overflow-hidden bg-[#020209] font-sans select-none">
      <canvas id="c0" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"></canvas>
      <canvas id="c1" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[2]"></canvas>
      <canvas id="c2" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[3]"></canvas>
      <canvas id="c3" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[4]"></canvas>
      
      <div id="vig" className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 32%, rgba(0,0,0,.82) 100%)'
      }}></div>
      
      <div id="holo" className="absolute inset-0 z-[11] pointer-events-none opacity-0" style={{
        background: 'repeating-linear-gradient(0deg, rgba(0,212,255,.012) 0, rgba(0,212,255,.012) 1px, transparent 1px, transparent 4px)',
        animation: 'hs 2s linear infinite'
      }}></div>

      <div id="bt" className="absolute left-0 right-0 top-0 h-0 bg-black transition-[height] duration-800 ease-[cubic-bezier(.22,1,.36,1)] z-[22]"></div>
      <div id="bb" className="absolute left-0 right-0 bottom-0 h-0 bg-black transition-[height] duration-800 ease-[cubic-bezier(.22,1,.36,1)] z-[22]"></div>

      <div className="crn tl absolute w-5 h-5 opacity-0 transition-opacity duration-600 z-[21] top-[10px] left-[10px] border-t border-l border-[#FF9933]"></div>
      <div className="crn tr absolute w-5 h-5 opacity-0 transition-opacity duration-600 z-[21] top-[10px] right-[10px] border-t border-r border-[#00D4FF]"></div>
      <div className="crn bl absolute w-5 h-5 opacity-0 transition-opacity duration-600 z-[21] bottom-[10px] left-[10px] border-b border-l border-[#138808]"></div>
      <div className="crn br absolute w-5 h-5 opacity-0 transition-opacity duration-600 z-[21] bottom-[10px] right-[10px] border-b border-r border-[#7B2FFF]"></div>

      <div id="ui" className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div id="ltop" className="h-px w-0 mx-auto transition-[width] duration-900 ease-linear mb-4" style={{
          background: 'linear-gradient(90deg, transparent, #FF9933, transparent)'
        }}></div>
        <div id="lbox" className="flex flex-wrap items-center justify-center gap-x-[0.02em]" style={{ perspective: '700px' }}></div>
        <div id="tri" className="flex h-[3px] w-0 rounded-full overflow-hidden mt-[11px] transition-[width] duration-1000 delay-300 ease-linear">
          <div className="flex-1" style={{ background: '#FF9933' }}></div>
          <div className="flex-1" style={{ background: '#fff' }}></div>
          <div className="flex-1" style={{ background: '#138808' }}></div>
        </div>
        <div id="sub" className="mt-[14px] text-white/70 text-[10px] tracking-[0.3em] uppercase opacity-0 translate-y-3 transition-all duration-700">
          India Without Waiting
        </div>
        <div id="dot" className="w-[5px] h-[5px] rounded-full bg-[#FF9933] mt-[10px] mx-auto opacity-0 scale-0 transition-all duration-500 delay-400"></div>
        <div id="lbot" className="h-px w-0 mx-auto transition-[width] duration-900 ease-linear mt-4" style={{
          background: 'linear-gradient(90deg, transparent, #7B2FFF, transparent)'
        }}></div>
      </div>

      <svg id="sarc" width="72" height="72" viewBox="0 0 72 72" className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[21] opacity-0 transition-opacity duration-500">
        <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
        <circle id="arc" cx="36" cy="36" r="30" fill="none" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="188.5" transform="rotate(-90 36 36)" />
      </svg>

      <div id="pds" className="absolute bottom-[46px] left-1/2 -translate-x-1/2 flex gap-[7px] z-[25]">
        <div className="pd w-1 h-1 rounded-full bg-white/18 transition-all duration-400"></div>
        <div className="pd w-1 h-1 rounded-full bg-white/18 transition-all duration-400"></div>
        <div className="pd w-1 h-1 rounded-full bg-white/18 transition-all duration-400"></div>
        <div className="pd w-1 h-1 rounded-full bg-white/18 transition-all duration-400"></div>
        <div className="pd w-1 h-1 rounded-full bg-white/18 transition-all duration-400"></div>
      </div>

      <div id="cityline" className="absolute bottom-[58px] left-0 right-0 text-center text-[9px] tracking-[0.22em] text-white/28 uppercase z-[21] opacity-0 transition-opacity duration-800"></div>

      <button id="skip" className="absolute right-[13px] top-[13px] z-30 bg-white/7 border border-white/14 text-white/68 px-[15px] py-[5px] rounded-full text-[11px] tracking-[0.07em] cursor-pointer opacity-0 pointer-events-none transition-all duration-400 hover:bg-[rgba(0,212,255,.15)] hover:border-[rgba(0,212,255,.45)]">
        Skip
      </button>

      <style>{`
        @keyframes hs {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }
        .L {
          display: inline-block;
          opacity: 0;
          transform: translateY(32px) rotateX(88deg) scale(0.7);
          transition: opacity 0.46s cubic-bezier(0.22, 1, 0.36, 1), transform 0.46s cubic-bezier(0.22, 1, 0.36, 1);
          font-size: clamp(1.7rem, 5.8vw, 3.1rem);
          font-weight: 900;
          background: linear-gradient(140deg, #00D4FF 0%, #fff 42%, #7B2FFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 16px rgba(0, 212, 255, 0.55));
        }
        .L.sp {
          width: 0.3em;
          background: none;
          -webkit-text-fill-color: transparent;
          filter: none;
        }
        .L.on {
          opacity: 1;
          transform: translateY(0) rotateX(0) scale(1);
        }
        .pd.on {
          background: #FF9933;
          transform: scale(1.5);
        }
        #bt.on, #bb.on {
          height: 26px;
        }
        .crn.on {
          opacity: 0.55;
        }
        #skip.on {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
