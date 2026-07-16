'use client';

import { useEffect } from "react";

export default function SellLanding() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .14 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // rotating hero word
    const words = ["your courses", "your merch", "your hot sauce", "training plans", "your closet", "your perfume", "recipe books", "1:1 coaching", "catering", "your art"];
    const rot = document.getElementById('rotator');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let wi = 0;
    const wordInterval = setInterval(() => {
      wi = (wi + 1) % words.length;
      if (reduced) { rot.textContent = words[wi]; return; }
      rot.classList.add('out');
      setTimeout(() => { rot.textContent = words[wi]; rot.classList.remove('out'); }, 300);
    }, 2200);

    return () => {
      io.disconnect();
      clearInterval(wordInterval);
    };
  }, []);

  return (
    <>
      <style>{`
        .sell-lander{
          --bg:#0A0A0C; --surface:#121215; --raised:#18181D;
          --border:rgba(255,255,255,.08); --border-strong:rgba(255,255,255,.14);
          --text:#F5F4F0; --sub:#A6A5AC; --muted:#66656D;
          --gold:#6E7BE8; --gold-bright:#97A3FF; --gold-soft:rgba(110,123,232,.1);
          --green:#3FBF7F;
        }
        .sell-lander *{margin:0;padding:0;box-sizing:border-box}
        .sell-lander{scroll-behavior:smooth}
        .sell-lander{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .sell-lander a{color:inherit;text-decoration:none}
        .sell-lander .wrap{max-width:1040px;margin:0 auto;padding:0 24px}
        .sell-lander .mono{font-family:'JetBrains Mono',monospace}
        .sell-lander .serif{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}

        /* ===== Nav ===== */
        .sell-lander nav{position:sticky;top:0;z-index:50;background:rgba(10,10,12,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
        .sell-lander .nav-inner{display:flex;align-items:center;gap:28px;padding:16px 0;font-size:13.5px}
        .sell-lander .brand{display:flex;align-items:center;gap:9px;font-weight:600;font-size:14.5px;letter-spacing:-.01em}
        .sell-lander .brand .sq{width:24px;height:24px;border-radius:7px;background:var(--gold);color:#0A0A0C;display:grid;place-items:center;font-family:'Instrument Serif',serif;font-style:italic;font-weight:700;font-size:14px}
        .sell-lander .nav-links{display:flex;gap:22px;color:var(--sub);margin-left:8px}
        .sell-lander .nav-links a{transition:color .15s ease}
        .sell-lander .nav-links a:hover{color:var(--text)}
        .sell-lander .nav-cta{margin-left:auto;background:var(--text);color:#0A0A0C;font-weight:600;font-size:13px;padding:8px 16px;border-radius:9px;transition:opacity .15s ease}
        .sell-lander .nav-cta:hover{opacity:.88}
        @media(max-width:640px){.sell-lander .nav-links{display:none}}

        /* ===== Hero ===== */
        .sell-lander .hero{padding:110px 0 0;text-align:center;position:relative}
        .sell-lander .hero::before{content:"";position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:720px;height:480px;background:radial-gradient(ellipse at center, rgba(110,123,232,.09), transparent 65%);pointer-events:none}
        .sell-lander .hero h1{font-weight:700;font-size:clamp(38px,6.6vw,68px);line-height:1.06;letter-spacing:-.035em;position:relative}
        .sell-lander .hero h1 .serif{color:var(--gold-bright);letter-spacing:-.01em}
        .sell-lander .hero .rot{display:inline-block;color:var(--gold-bright);font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-.01em;transition:opacity .3s ease,transform .3s ease}
        .sell-lander .hero .rot.out{opacity:0;transform:translateY(10px)}
        .sell-lander .hero .tagline{font-weight:700;font-size:clamp(20px,3.2vw,30px);letter-spacing:-.02em;color:var(--sub);margin-top:14px}
        .sell-lander .hero .tagline b{color:var(--text)}
        .sell-lander .hero p.sub{color:var(--sub);font-size:clamp(15px,2.2vw,18px);max-width:540px;margin:24px auto 0;line-height:1.65}
        .sell-lander .hero-ctas{display:flex;gap:12px;justify-content:center;margin-top:36px;flex-wrap:wrap}
        .sell-lander .btn-primary{background:var(--text);color:#0A0A0C;font-weight:600;font-size:14.5px;padding:13px 26px;border-radius:11px;transition:transform .15s ease,opacity .15s ease}
        .sell-lander .btn-primary:hover{transform:translateY(-1px);opacity:.92}
        .sell-lander .btn-secondary{border:1px solid var(--border-strong);color:var(--sub);font-weight:600;font-size:14.5px;padding:13px 26px;border-radius:11px;transition:color .15s ease,border-color .15s ease}
        .sell-lander .btn-secondary:hover{color:var(--text);border-color:rgba(255,255,255,.28)}
        .sell-lander .hero-note{color:var(--muted);font-size:12.5px;margin-top:16px}

        /* ===== Product visual: phone mockup ===== */
        .sell-lander .stage{margin-top:76px;display:flex;justify-content:center;position:relative;padding-bottom:0}
        .sell-lander .stage::after{content:"";position:absolute;bottom:0;left:0;right:0;height:180px;background:linear-gradient(to top, var(--bg), transparent);pointer-events:none;z-index:3}
        .sell-lander .phone{
          width:300px;background:#000;border-radius:44px;padding:10px;border:1px solid var(--border-strong);
          box-shadow:0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04), 0 0 80px rgba(110,123,232,.06);
          position:relative;z-index:1;
        }
        .sell-lander .screen{background:#0E0E11;border-radius:36px;overflow:hidden;border:1px solid rgba(255,255,255,.06)}
        .sell-lander .s-head{padding:22px 18px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:11px}
        .sell-lander .s-avatar{width:38px;height:38px;border-radius:99px;background:linear-gradient(140deg,#2A2A31,#3C3B44);border:1px solid var(--border-strong)}
        .sell-lander .s-name{font-weight:600;font-size:14px;letter-spacing:-.01em}
        .sell-lander .s-handle{font-size:11.5px;color:var(--muted)}
        .sell-lander .s-verify{margin-left:auto;font-size:10px;color:var(--gold);border:1px solid rgba(110,123,232,.35);padding:3px 8px;border-radius:99px;font-weight:600}
        .sell-lander .s-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px}
        .sell-lander .s-item{background:var(--raised);border:1px solid var(--border);border-radius:14px;overflow:hidden}
        .sell-lander .s-thumb{aspect-ratio:1/.82}
        .sell-lander .t1{background:linear-gradient(140deg,#23222A,#37343F)}
        .sell-lander .t2{background:linear-gradient(140deg,#24242B,#3A3A46)}
        .sell-lander .t3{background:linear-gradient(140deg,#1D2420,#2F4237)}
        .sell-lander .t4{background:linear-gradient(140deg,#241E28,#3D3145)}
        .sell-lander .s-info{padding:9px 11px 11px}
        .sell-lander .s-title{font-size:11.5px;font-weight:600;letter-spacing:-.01em}
        .sell-lander .s-price{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold-bright);margin-top:3px}
        .sell-lander .s-buy{margin:2px 14px 16px;background:var(--text);color:#0A0A0C;text-align:center;font-weight:600;font-size:12.5px;padding:11px;border-radius:11px}
        /* floating notifications */
        .sell-lander .toast{
          position:absolute;background:var(--surface);border:1px solid var(--border-strong);border-radius:13px;
          padding:11px 15px;box-shadow:0 20px 50px rgba(0,0,0,.55);z-index:2;font-size:12.5px;
        }
        .sell-lander .toast .row{display:flex;align-items:center;gap:9px}
        .sell-lander .toast .ic{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;font-size:12px;font-weight:700}
        .sell-lander .toast .t{font-weight:600;letter-spacing:-.01em}
        .sell-lander .toast .d{font-size:11px;color:var(--muted);margin-top:1px}
        .sell-lander .toast .amt{font-family:'JetBrains Mono',monospace;color:var(--green);font-weight:500;margin-left:4px}
        .sell-lander .toast1{top:14%;right:calc(50% - 340px)}
        .sell-lander .toast1 .ic{background:rgba(63,191,127,.12);color:var(--green)}
        .sell-lander .toast2{top:52%;left:calc(50% - 350px)}
        .sell-lander .toast2 .ic{background:var(--gold-soft);color:var(--gold-bright)}
        @media(max-width:760px){
          .sell-lander .toast1{right:8px;top:6%}
          .sell-lander .toast2{left:8px;top:56%}
        }

        /* ===== Section scaffolding ===== */
        .sell-lander section{padding:104px 0}
        .sell-lander .eyebrow{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
        .sell-lander h2{font-weight:700;font-size:clamp(28px,4.4vw,42px);letter-spacing:-.03em;line-height:1.12;margin-top:14px}
        .sell-lander h2 .serif{color:var(--gold-bright)}
        .sell-lander .sec-sub{color:var(--sub);font-size:15px;max-width:480px;margin-top:14px}

        /* ===== Who it&apos;s for ===== */
        .sell-lander .who{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-top:52px}
        .sell-lander .who-cell{background:var(--surface);padding:30px 26px;transition:background .2s ease}
        .sell-lander .who-cell:hover{background:var(--raised)}
        .sell-lander .who-cell h3{font-size:15.5px;font-weight:600;letter-spacing:-.01em}
        .sell-lander .who-cell p{color:var(--sub);font-size:13.5px;margin-top:8px;line-height:1.6}
        .sell-lander .who-cell .k{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:14px}

        /* ===== Templates ===== */
        .sell-lander .templates{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin-top:52px}
        .sell-lander .tpl{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:transform .18s ease,border-color .18s ease}
        .sell-lander .tpl:hover{transform:translateY(-4px);border-color:var(--border-strong)}
        .sell-lander .tpl .bar{display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--border);background:var(--raised)}
        .sell-lander .tpl .dots{display:flex;gap:4px}
        .sell-lander .tpl .dot{width:7px;height:7px;border-radius:99px;background:rgba(255,255,255,.14)}
        .sell-lander .tpl .url{flex:1;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);background:rgba(255,255,255,.04);border-radius:6px;padding:4px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sell-lander .tpl .body{padding:16px}
        .sell-lander .tpl .hero-strip{border-radius:10px;padding:18px 14px;margin-bottom:12px}
        .sell-lander .tpl .hero-strip .nm{font-weight:600;font-size:14px;letter-spacing:-.01em}
        .sell-lander .tpl .hero-strip .hd{font-size:10.5px;color:var(--sub);margin-top:2px}
        .sell-lander .tpl .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .sell-lander .tpl .row1{display:flex;flex-direction:column;gap:10px}
        .sell-lander .tpl .prod{background:var(--raised);border:1px solid var(--border);border-radius:10px;overflow:hidden}
        .sell-lander .tpl .prod .th{aspect-ratio:1/.7}
        .sell-lander .tpl .prod.wide{display:flex;align-items:center}
        .sell-lander .tpl .prod.wide .th{width:74px;aspect-ratio:1/1;flex-shrink:0}
        .sell-lander .tpl .prod .in{padding:8px 10px}
        .sell-lander .tpl .prod .tt{font-size:10.5px;font-weight:600;letter-spacing:-.01em}
        .sell-lander .tpl .prod .pr{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--sub);margin-top:2px}
        .sell-lander .tpl .buy{margin-top:12px;background:var(--text);color:#0A0A0C;text-align:center;font-weight:600;font-size:11px;padding:9px;border-radius:9px}
        .sell-lander .tpl-meta{padding:16px 18px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
        .sell-lander .tpl-meta h3{font-size:14px;font-weight:600;letter-spacing:-.01em}
        .sell-lander .tpl-meta span{font-size:11.5px;color:var(--muted)}
        /* template palettes */
        .sell-lander .tpl.a .hero-strip{background:linear-gradient(135deg,#1B1B22,#26262F)}
        .sell-lander .tpl.a .th{background:linear-gradient(140deg,#22222A,#33333E)}
        .sell-lander .tpl.b .hero-strip{background:linear-gradient(135deg,#161D1A,#1F2B25)}
        .sell-lander .tpl.b .th{background:linear-gradient(140deg,#1C2620,#2A3B31)}
        .sell-lander .tpl.c .hero-strip{background:linear-gradient(135deg,#1A1A24,#242438)}
        .sell-lander .tpl.c .th{background:linear-gradient(140deg,#20202E,#2E2E44)}

        .sell-lander .how{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:40px;margin-top:56px}
        .sell-lander .how-item .n{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold)}
        .sell-lander .how-item h4{font-size:16px;font-weight:600;margin-top:12px;letter-spacing:-.01em}
        .sell-lander .how-item p{color:var(--sub);font-size:13.5px;margin-top:8px;line-height:1.65}

        /* ===== Fort ===== */
        .sell-lander .fort{display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center}
        @media(max-width:820px){.sell-lander .fort{grid-template-columns:1fr}}
        .sell-lander .fort-points{margin-top:36px;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--border)}
        .sell-lander .fort-point{padding:20px 4px;border-bottom:1px solid var(--border)}
        .sell-lander .fort-point h4{font-size:15px;font-weight:600;letter-spacing:-.01em}
        .sell-lander .fort-point p{color:var(--sub);font-size:13.5px;margin-top:5px;line-height:1.6}
        .sell-lander .chat{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:14px}
        .sell-lander .chat-label{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;padding-bottom:12px;border-bottom:1px solid var(--border)}
        .sell-lander .m-u{align-self:flex-end;background:var(--raised);border:1px solid var(--border);border-radius:12px;padding:10px 14px;font-size:13.5px;max-width:88%;color:var(--text)}
        .sell-lander .m-f{display:flex;gap:10px;max-width:96%}
        .sell-lander .m-f .av{width:22px;height:22px;border-radius:7px;background:var(--gold);color:#0A0A0C;display:grid;place-items:center;font-family:'Instrument Serif',serif;font-style:italic;font-weight:700;font-size:13px;flex-shrink:0;margin-top:2px}
        .sell-lander .m-f .body{font-size:13.5px;color:var(--sub);line-height:1.65}
        .sell-lander .m-f .body b{color:var(--text);font-weight:600}

        /* ===== Pricing ===== */
        .sell-lander .pricing{text-align:center}
        .sell-lander .price-line{margin-top:48px;font-weight:700;font-size:clamp(30px,5vw,46px);letter-spacing:-.03em}
        .sell-lander .price-line .serif{color:var(--gold-bright)}
        .sell-lander .price-detail{margin-top:20px;color:var(--sub);font-size:15px}
        .sell-lander .price-fee{display:inline-block;margin-top:28px;font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--gold-bright);border:1px solid rgba(110,123,232,.3);background:var(--gold-soft);padding:10px 20px;border-radius:99px}
        .sell-lander .price-note{color:var(--muted);font-size:12.5px;margin-top:16px}

        /* ===== Final ===== */
        .sell-lander .final{text-align:center;padding:120px 0 130px;position:relative}
        .sell-lander .final::before{content:"";position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);width:640px;height:360px;background:radial-gradient(ellipse at center, rgba(110,123,232,.08), transparent 65%);pointer-events:none}
        .sell-lander .final h2{font-size:clamp(32px,5.6vw,54px)}
        .sell-lander .final p{color:var(--sub);font-size:15px;max-width:440px;margin:18px auto 0}

        .sell-lander footer{border-top:1px solid var(--border);padding:28px 0;color:var(--muted);font-size:12.5px}

        .sell-lander .reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
        .sell-lander .reveal.in{opacity:1;transform:none}
        @media (prefers-reduced-motion: reduce){.sell-lander .reveal{opacity:1;transform:none;transition:none}}
      `}</style>

      <div className="sell-lander">
        <nav>
          <div className="wrap nav-inner">
            <a className="brand" href="#"><span className="sq">F</span>Fortuneful</a>
            <div className="nav-links">
              <a href="#who">Who it&apos;s for</a>
              <a href="#templates">Templates</a>
              <a href="#how">How it works</a>
              <a href="#fort">Fort</a>
              <a href="#pricing">Pricing</a>
            </div>
            <a className="nav-cta" href="/start">Start an online shop</a>
          </div>
        </nav>

        {/* ============ HERO ============ */}
        <header className="hero wrap">
          <h1>Start selling <span className="rot" id="rotator">your courses</span></h1>
          <div className="tagline">Monetize your views — <b>sell goods & services to your viewers.</b></div>
          <p className="sub">Fortuneful builds your storefront, handles payments, and gives you an AI that knows what your audience will buy.</p>
          <div className="hero-ctas">
            <a className="btn-primary" href="/start">Start an online shop — free</a>
            <a className="btn-secondary" href="#how">See how it works</a>
          </div>
          <div className="hero-note">No monthly fee. No code. Live in 15 minutes.</div>

          <div className="stage">
            <div className="toast toast1">
              <div className="row">
                <div className="ic">✓</div>
                <div><div className="t">New order<span className="amt">+$149.00</span></div><div className="d">8-Week Program · just now</div></div>
              </div>
            </div>
            <div className="toast toast2">
              <div className="row">
                <div className="ic">F</div>
                <div><div className="t">Fort</div><div className="d">Your audience is most active at 7pm — post the drop then.</div></div>
              </div>
            </div>
            <div className="phone">
              <div className="screen">
                <div className="s-head">
                  <div className="s-avatar"></div>
                  <div>
                    <div className="s-name">Maya Torres</div>
                    <div className="s-handle">@maya.lifts · 214k followers</div>
                  </div>
                  <div className="s-verify">SHOP</div>
                </div>
                <div className="s-grid">
                  <div className="s-item"><div className="s-thumb t1"></div><div className="s-info"><div className="s-title">8-Week Program</div><div className="s-price">$149</div></div></div>
                  <div className="s-item"><div className="s-thumb t2"></div><div className="s-info"><div className="s-title">Meal Guide</div><div className="s-price">$39</div></div></div>
                  <div className="s-item"><div className="s-thumb t3"></div><div className="s-info"><div className="s-title">Training Tee</div><div className="s-price">$32</div></div></div>
                  <div className="s-item"><div className="s-thumb t4"></div><div className="s-info"><div className="s-title">1:1 Coaching</div><div className="s-price">$120/mo</div></div></div>
                </div>
                <div className="s-buy">Checkout</div>
              </div>
            </div>
          </div>
        </header>

        {/* ============ WHO ============ */}
        <section className="wrap" id="who">
          <div className="reveal">
            <div className="eyebrow">Who it&apos;s for</div>
            <h2>Your audience is already asking.<br/><span className="serif">Give them somewhere to buy.</span></h2>
          </div>
          <div className="who reveal">
            <div className="who-cell"><span className="k">01</span><h3>Creators & influencers</h3><p>Merch, presets, digital products — sold from the link your followers already click.</p></div>
            <div className="who-cell"><span className="k">02</span><h3>Coaches & course sellers</h3><p>Programs, guides, and 1:1 offers with checkout built in. No course platform tax.</p></div>
            <div className="who-cell"><span className="k">03</span><h3>Restaurants & food brands</h3><p>Sauces, spice blends, merch, catering deposits — revenue beyond the tables.</p></div>
            <div className="who-cell"><span className="k">04</span><h3>Athletes & public figures</h3><p>Training plans, appearances, signed goods — your name, your margin, your terms.</p></div>
          </div>
        </section>

        {/* ============ TEMPLATES ============ */}
        <section className="wrap" id="templates">
          <div className="reveal">
            <div className="eyebrow">Your storefront</div>
            <h2>This is what yours<br/><span className="serif">could look like.</span></h2>
            <p className="sec-sub">Pick a layout, add your products, done. Every store is mobile-first — because that&apos;s where your viewers are.</p>
          </div>
          <div className="templates">

            <div className="tpl a reveal">
              <div className="bar"><div className="dots"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div><div className="url">mayalifts.fortuneful.store</div></div>
              <div className="body">
                <div className="hero-strip"><div className="nm">Maya Lifts</div><div className="hd">Programs & coaching · 214k followers</div></div>
                <div className="row2">
                  <div className="prod"><div className="th"></div><div className="in"><div className="tt">8-Week Program</div><div className="pr">$149</div></div></div>
                  <div className="prod"><div className="th"></div><div className="in"><div className="tt">Meal Guide</div><div className="pr">$39</div></div></div>
                </div>
                <div className="buy">Checkout</div>
              </div>
              <div className="tpl-meta"><h3>Grid</h3><span>courses & digital</span></div>
            </div>

            <div className="tpl b reveal">
              <div className="bar"><div className="dots"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div><div className="url">casaverde.fortuneful.store</div></div>
              <div className="body">
                <div className="hero-strip"><div className="nm">Casa Verde</div><div className="hd">Salsas & spice blends · family recipe</div></div>
                <div className="row1">
                  <div className="prod wide"><div className="th"></div><div className="in"><div className="tt">Salsa Roja — 3 pack</div><div className="pr">$24</div></div></div>
                  <div className="prod wide"><div className="th"></div><div className="in"><div className="tt">Recipe Book</div><div className="pr">$18</div></div></div>
                </div>
                <div className="buy">Checkout</div>
              </div>
              <div className="tpl-meta"><h3>Menu</h3><span>food & product lines</span></div>
            </div>

            <div className="tpl c reveal">
              <div className="bar"><div className="dots"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div><div className="url">jrdnarchive.fortuneful.store</div></div>
              <div className="body">
                <div className="hero-strip"><div className="nm">JRDN Archive</div><div className="hd">Curated vintage · drops weekly</div></div>
                <div className="row2">
                  <div className="prod"><div className="th"></div><div className="in"><div className="tt">Denim Jacket</div><div className="pr">$68</div></div></div>
                  <div className="prod"><div className="th"></div><div className="in"><div className="tt">Leather Bag</div><div className="pr">$95</div></div></div>
                </div>
                <div className="buy">Checkout</div>
              </div>
              <div className="tpl-meta"><h3>Drop</h3><span>merch & resale</span></div>
            </div>

          </div>
        </section>

        {/* ============ HOW ============ */}
        <section className="wrap" id="how">
          <div className="reveal">
            <div className="eyebrow">How it works</div>
            <h2>Live in fifteen minutes.</h2>
          </div>
          <div className="how">
            <div className="how-item reveal"><div className="n">01</div><h4>Tell us what you sell</h4><p>Products, services, digital goods — describe them once. That&apos;s the hard part done.</p></div>
            <div className="how-item reveal"><div className="n">02</div><h4>Add photos and prices</h4><p>Shot on your phone is fine. We handle the storefront design.</p></div>
            <div className="how-item reveal"><div className="n">03</div><h4>Connect payouts</h4><p>Stripe-powered. Three minutes. Money lands in your bank account.</p></div>
            <div className="how-item reveal"><div className="n">04</div><h4>Share your link</h4><p>One link in bio. Your viewers become your customers.</p></div>
          </div>
        </section>

        {/* ============ FORT ============ */}
        <section className="wrap" id="fort">
          <div className="fort">
            <div className="reveal">
              <div className="eyebrow">Fort — your AI operator</div>
              <h2>It knows your shop.<br/><span className="serif">And your audience.</span></h2>
              <div className="fort-points">
                <div className="fort-point"><h4>Built into your dashboard</h4><p>Fort sees your products, prices, and sales — its advice is about your business, not businesses in general.</p></div>
                <div className="fort-point"><h4>Tells you what to post</h4><p>Captions, content angles, drop timing — matched to what your viewers actually buy.</p></div>
                <div className="fort-point"><h4>Backed by a real team</h4><p>Need a full website, ad campaigns, or design work? Fort files the request and humans handle it.</p></div>
              </div>
            </div>
            <div className="chat reveal">
              <div className="chat-label">FORT — LIVE SESSION</div>
              <div className="m-u">launching my 8-week program friday. how should I run it?</div>
              <div className="m-f">
                <div className="av">F</div>
                <div className="body">Price it at <b>$149</b> — your meal guide buyers convert at premium price points. Tease it Wednesday with a client result, open checkout Friday <b>7pm</b> when your engagement peaks, and cap the first cohort at 50 to create real scarcity. Want me to draft the announcement post?</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="wrap pricing" id="pricing">
          <div className="reveal">
            <div className="eyebrow">Pricing</div>
            <div className="price-line">Free. <span className="serif">Forever.</span></div>
            <div className="price-detail">Storefront, checkout, payouts, and Fort — no monthly fee, no setup cost.</div>
            <div className="price-fee">5% per sale — we only make money when you do</div>
            <div className="price-note">Standard card processing included. No hidden fees.</div>
          </div>
        </section>

        {/* ============ FINAL ============ */}
        <section className="final wrap">
          <div className="reveal">
            <h2>Your following is the hard part.<br/><span className="serif">You&apos;ve already done it.</span></h2>
            <p>The storefront takes fifteen minutes. Start tonight, post the link tomorrow.</p>
            <div className="hero-ctas" style={{ marginTop: 32 }}>
              <a className="btn-primary" href="/start">Start an online shop — free</a>
            </div>
          </div>
        </section>

        <footer>
          <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span>© 2026 Fortuneful</span>
            <span>fortuneful.ai</span>
          </div>
        </footer>
      </div>
    </>
  );
}
