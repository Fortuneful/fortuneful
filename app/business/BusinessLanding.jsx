'use client';

import { useEffect } from "react";
import Link from "next/link";

export default function BusinessLanding() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .14 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // click-list auto cycle: each row activates, fills, marks done
    const rows = [...document.querySelectorAll('.click-row')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ci = 0;
    let innerTimeout;
    const cycle = () => {
      rows.forEach((r) => r.classList.remove('active'));
      const row = rows[ci];
      row.classList.remove('done');
      row.classList.add('active');
      innerTimeout = setTimeout(() => { row.classList.remove('active'); row.classList.add('done'); }, reduced ? 0 : 1300);
      ci = (ci + 1) % rows.length;
    };
    cycle();
    const cycleInterval = setInterval(cycle, 1800);

    return () => {
      io.disconnect();
      clearInterval(cycleInterval);
      clearTimeout(innerTimeout);
    };
  }, []);

  return (
    <>
      <style>{`
        .biz-lander{
          --bg:#0A0A0C; --surface:#121215; --raised:#18181D;
          --border:rgba(255,255,255,.08); --border-strong:rgba(255,255,255,.14);
          --text:#F5F4F0; --sub:#A6A5AC; --muted:#66656D;
          --accent:#6E7BE8; --accent-bright:#97A3FF; --accent-soft:rgba(110,123,232,.1);
          --green:#3FBF7F;
        }
        .biz-lander *{margin:0;padding:0;box-sizing:border-box}
        .biz-lander{scroll-behavior:smooth}
        .biz-lander{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .biz-lander a{color:inherit;text-decoration:none}
        .biz-lander .wrap{max-width:1040px;margin:0 auto;padding:0 24px}
        .biz-lander .mono{font-family:'JetBrains Mono',monospace}
        .biz-lander .serif{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}

        /* ===== Nav ===== */
        .biz-lander nav{position:sticky;top:0;z-index:50;background:rgba(10,10,12,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
        .biz-lander .nav-inner{display:flex;align-items:center;gap:28px;padding:16px 0;font-size:13.5px}
        .biz-lander .brand{display:flex;align-items:center;gap:9px;font-weight:600;font-size:14.5px;letter-spacing:-.01em}
        .biz-lander .brand .sq{width:24px;height:24px;border-radius:7px;background:var(--accent);color:#0A0A0C;display:grid;place-items:center;font-family:'Instrument Serif',serif;font-style:italic;font-weight:700;font-size:14px}
        .biz-lander .nav-links{display:flex;gap:22px;color:var(--sub)}
        .biz-lander .nav-links a{transition:color .15s ease}
        .biz-lander .nav-links a:hover{color:var(--text)}
        .biz-lander .nav-cta{margin-left:auto;background:var(--text);color:#0A0A0C;font-weight:600;font-size:13px;padding:8px 16px;border-radius:9px;transition:opacity .15s ease}
        .biz-lander .nav-cta:hover{opacity:.88}
        @media(max-width:640px){.biz-lander .nav-links{display:none}}

        /* ===== Hero ===== */
        .biz-lander .hero{padding:110px 0 60px;text-align:center;position:relative}
        .biz-lander .hero::before{content:"";position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:720px;height:480px;background:radial-gradient(ellipse at center, rgba(110,123,232,.09), transparent 65%);pointer-events:none}
        .biz-lander .hero h1{font-weight:700;font-size:clamp(38px,6.6vw,68px);line-height:1.06;letter-spacing:-.035em;position:relative}
        .biz-lander .hero h1 .serif{color:var(--accent-bright);letter-spacing:-.01em}
        .biz-lander .hero p.sub{color:var(--sub);font-size:clamp(15px,2.2vw,18px);max-width:560px;margin:24px auto 0;line-height:1.65}
        .biz-lander .hero-ctas{display:flex;gap:12px;justify-content:center;margin-top:36px;flex-wrap:wrap}
        .biz-lander .btn-primary{background:var(--text);color:#0A0A0C;font-weight:600;font-size:14.5px;padding:13px 26px;border-radius:11px;transition:transform .15s ease,opacity .15s ease}
        .biz-lander .btn-primary:hover{transform:translateY(-1px);opacity:.92}
        .biz-lander .btn-secondary{border:1px solid var(--border-strong);color:var(--sub);font-weight:600;font-size:14.5px;padding:13px 26px;border-radius:11px;transition:color .15s ease,border-color .15s ease}
        .biz-lander .btn-secondary:hover{color:var(--text);border-color:rgba(255,255,255,.28)}
        .biz-lander .hero-note{color:var(--muted);font-size:12.5px;margin-top:16px}

        /* ===== The click list ===== */
        .biz-lander .clicklist{max-width:560px;margin:72px auto 0;text-align:left}
        .biz-lander .click-row{
          display:flex;align-items:center;justify-content:space-between;gap:16px;
          padding:17px 22px;border:1px solid var(--border);border-radius:13px;margin-bottom:10px;
          background:var(--surface);transition:border-color .3s ease,background .3s ease;position:relative;overflow:hidden;
        }
        .biz-lander .click-row .q{font-weight:600;font-size:15px;letter-spacing:-.01em}
        .biz-lander .click-row .a{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);transition:color .3s ease}
        .biz-lander .click-row.active{border-color:rgba(110,123,232,.5);background:var(--raised)}
        .biz-lander .click-row.active .a{color:var(--accent-bright)}
        .biz-lander .click-row.done .a{color:var(--green)}
        .biz-lander .click-row .bar{position:absolute;left:0;bottom:0;height:2px;background:var(--accent);width:0%;transition:width 1.2s linear}
        .biz-lander .click-row.active .bar{width:100%}

        /* ===== Decision engine ===== */
        .biz-lander .engine{max-width:640px;margin:60px auto 0;position:relative}
        .biz-lander .eng-node{
          background:var(--surface);border:1px solid var(--border);border-radius:13px;
          padding:15px 22px;text-align:center;font-weight:600;font-size:14px;letter-spacing:-.01em;
          position:relative;z-index:1;
        }
        .biz-lander .eng-node .tag{display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--muted);font-weight:500;margin-top:3px;letter-spacing:.04em}
        .biz-lander .eng-line{width:1px;height:34px;background:var(--border-strong);margin:0 auto;position:relative}
        .biz-lander .eng-line::after{content:"";position:absolute;left:-1.5px;top:0;width:4px;height:10px;border-radius:99px;background:var(--accent-bright);animation:biz-flow 1.6s linear infinite}
        @keyframes biz-flow{from{top:-10px;opacity:0}20%{opacity:1}80%{opacity:1}to{top:100%;opacity:0}}
        .biz-lander .eng-split{display:grid;grid-template-columns:1fr 1fr;gap:18px;position:relative;margin-top:0}
        .biz-lander .eng-split::before{content:"";position:absolute;top:-17px;left:25%;right:25%;height:1px;background:var(--border-strong)}
        .biz-lander .eng-split .eng-line{height:17px;margin-top:-17px}
        .biz-lander .eng-branch .eng-node{font-size:13.5px}
        .biz-lander .eng-branch .eng-node.ai{border-color:rgba(110,123,232,.4)}
        .biz-lander .eng-branch .eng-node.human{border-color:rgba(63,191,127,.35)}
        .biz-lander .eng-note{text-align:center;color:var(--muted);font-size:13px;margin-top:28px}
        .biz-lander .eng-note b{color:var(--sub);font-weight:600}

        /* ===== Sections ===== */
        .biz-lander section{padding:104px 0}
        .biz-lander .eyebrow{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}
        .biz-lander h2{font-weight:700;font-size:clamp(28px,4.4vw,42px);letter-spacing:-.03em;line-height:1.12;margin-top:14px}
        .biz-lander h2 .serif{color:var(--accent-bright)}
        .biz-lander .sec-sub{color:var(--sub);font-size:15px;max-width:500px;margin-top:14px}

        /* ===== Industry packs ===== */
        .biz-lander .packs{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:52px}
        @media(max-width:760px){.biz-lander .packs{grid-template-columns:1fr}}
        .biz-lander .pack{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;transition:border-color .2s ease}
        .biz-lander .pack:hover{border-color:var(--border-strong)}
        .biz-lander .pack .k{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted)}
        .biz-lander .pack h3{font-size:17px;font-weight:600;letter-spacing:-.01em;margin-top:10px}
        .biz-lander .pack p{color:var(--sub);font-size:13.5px;margin-top:6px}
        .biz-lander .pack ul{list-style:none;margin-top:18px;display:flex;flex-wrap:wrap;gap:7px}
        .biz-lander .pack li{border:1px solid var(--border);border-radius:99px;padding:5px 13px;font-size:12px;color:var(--sub)}
        .biz-lander .pack.hl{border-color:rgba(110,123,232,.35)}
        .biz-lander .pack.hl .k{color:var(--accent-bright)}

        /* ===== Difference rows ===== */
        .biz-lander .diff{margin-top:52px;border-top:1px solid var(--border)}
        .biz-lander .diff-row{display:grid;grid-template-columns:1fr 1fr;gap:32px;padding:26px 4px;border-bottom:1px solid var(--border)}
        @media(max-width:640px){.biz-lander .diff-row{grid-template-columns:1fr;gap:6px}}
        .biz-lander .diff-row h4{font-size:15.5px;font-weight:600;letter-spacing:-.01em}
        .biz-lander .diff-row p{color:var(--sub);font-size:14px;line-height:1.65}

        /* ===== Final ===== */
        .biz-lander .final{text-align:center;padding:120px 0 130px;position:relative}
        .biz-lander .final::before{content:"";position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);width:640px;height:360px;background:radial-gradient(ellipse at center, rgba(110,123,232,.08), transparent 65%);pointer-events:none}
        .biz-lander .final h2{font-size:clamp(32px,5.6vw,54px)}
        .biz-lander .final p{color:var(--sub);font-size:15px;max-width:460px;margin:18px auto 0}

        .biz-lander footer{border-top:1px solid var(--border);padding:28px 0;color:var(--muted);font-size:12.5px}

        .biz-lander .reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
        .biz-lander .reveal.in{opacity:1;transform:none}
        @media (prefers-reduced-motion: reduce){
          .biz-lander .reveal{opacity:1;transform:none;transition:none}
          .biz-lander .eng-line::after{animation:none;display:none}
          .biz-lander .click-row .bar{transition:none}
        }
      `}</style>

      <div className="biz-lander">
        <nav>
          <div className="wrap nav-inner">
            <a className="brand" href="#"><span className="sq">F</span>Fortuneful</a>
            <div className="nav-links">
              <a href="#engine">How it works</a>
              <a href="#packs">Industries</a>
              <a href="#difference">Why Fortuneful</a>
            </div>
            <Link className="nav-cta" href="/sign-up">Open your dashboard</Link>
          </div>
        </nav>

        {/* ============ HERO ============ */}
        <header className="hero wrap">
          <h1>One dashboard to run<br/><span className="serif">and grow your business.</span></h1>
          <p className="sub">AI where it helps. Humans where they matter. Request anything your business needs — it gets routed, handled, and delivered. You never have to figure out who does what.</p>
          <div className="hero-ctas">
            <Link className="btn-primary" href="/sign-up">Open your dashboard</Link>
            <a className="btn-secondary" href="#engine">See how it works</a>
          </div>
          <div className="hero-note">Live today. Your first request takes two minutes.</div>

          <div className="clicklist" id="clicklist">
            <div className="click-row" data-i="0"><span className="q">Need a website?</span><span className="a">request filed</span><span className="bar"></span></div>
            <div className="click-row" data-i="1"><span className="q">Need ads managed?</span><span className="a">request filed</span><span className="bar"></span></div>
            <div className="click-row" data-i="2"><span className="q">Need your menu updated?</span><span className="a">request filed</span><span className="bar"></span></div>
            <div className="click-row" data-i="3"><span className="q">Need bookkeeping?</span><span className="a">request filed</span><span className="bar"></span></div>
            <div className="click-row" data-i="4"><span className="q">Need help hiring?</span><span className="a">request filed</span><span className="bar"></span></div>
            <div className="click-row" data-i="5"><span className="q">Need a human expert?</span><span className="a">request filed</span><span className="bar"></span></div>
          </div>
        </header>

        {/* ============ DECISION ENGINE ============ */}
        <section className="wrap" id="engine">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow">How it works</div>
            <h2>You ask. It routes.<br/><span className="serif">It gets done.</span></h2>
          </div>

          <div className="engine reveal">
            <div className="eng-node">Your request<span className="tag">&quot;REDO MY HOMEPAGE&quot; · &quot;RUN MY ADS&quot; · &quot;UPDATE THE MENU&quot;</span></div>
            <div className="eng-line"></div>
            <div className="eng-node">Fortuneful decision engine<span className="tag">CAN AI HANDLE THIS?</span></div>
            <div className="eng-split">
              <div className="eng-branch">
                <div className="eng-line"></div>
                <div className="eng-node ai">AI handles it<span className="tag">INSTANT — DRAFTS, PLANS, ANSWERS</span></div>
              </div>
              <div className="eng-branch">
                <div className="eng-line"></div>
                <div className="eng-node human">Human team handles it<span className="tag">DESIGN, ADS, BUILDS, BOOKKEEPING</span></div>
              </div>
            </div>
            <div className="eng-line" style={{ marginTop: 18 }}></div>
            <div className="eng-node" style={{ borderColor: "rgba(63,191,127,.35)" }}>Delivered<span className="tag">TRACKED IN YOUR DASHBOARD, START TO FINISH</span></div>
          </div>
          <p className="eng-note reveal"><b>You never have to decide who does what.</b> That&apos;s the point.</p>
        </section>

        {/* ============ INDUSTRY PACKS ============ */}
        <section className="wrap" id="packs">
          <div className="reveal">
            <div className="eyebrow">Industries</div>
            <h2>Same dashboard.<br/><span className="serif">Built for your business.</span></h2>
            <p className="sec-sub">Every industry gets its own request templates, workflows, and playbooks — not a generic tool pretending to know your world.</p>
          </div>
          <div className="packs">
            <div className="pack hl reveal">
              <div className="k">PACK 01</div>
              <h3>Restaurants</h3>
              <p>From the website to the pass-through window.</p>
              <ul><li>Website</li><li>Menus</li><li>Posters</li><li>DoorDash</li><li>Uber Eats</li><li>Google Business</li><li>Payments</li></ul>
            </div>
            <div className="pack reveal">
              <div className="k">PACK 02</div>
              <h3>E-commerce</h3>
              <p>The full stack behind stores that scale.</p>
              <ul><li>Creatives</li><li>CRO</li><li>Shopify</li><li>Email & SMS</li><li>Product research</li><li>Media buying</li></ul>
            </div>
            <div className="pack reveal">
              <div className="k">PACK 03</div>
              <h3>Local businesses</h3>
              <p>Be the obvious choice in your zip code.</p>
              <ul><li>Google Ads</li><li>Websites</li><li>Reviews</li><li>Social media</li><li>Booking</li></ul>
            </div>
            <div className="pack reveal">
              <div className="k">PACK 04</div>
              <h3>Agencies</h3>
              <p>Fulfillment muscle behind your brand.</p>
              <ul><li>White-label fulfillment</li><li>Designers</li><li>Developers</li><li>Copywriters</li></ul>
            </div>
          </div>
        </section>

        {/* ============ DIFFERENCE ============ */}
        <section className="wrap" id="difference">
          <div className="reveal">
            <div className="eyebrow">Why Fortuneful</div>
            <h2>Not an agency. Not just software.<br/><span className="serif">The layer that runs both.</span></h2>
          </div>
          <div className="diff">
            <div className="diff-row reveal">
              <h4>Agencies make you chase them.</h4>
              <p>Email threads, status calls, invoices for &quot;scope changes.&quot; Here, every request lives in one dashboard with a status you can see — filed, in progress, done.</p>
            </div>
            <div className="diff-row reveal">
              <h4>Software makes you do the work.</h4>
              <p>A subscription to a tool is a subscription to a second job. Fortuneful takes the task, not just the ticket — AI executes instantly where it can, people take the rest.</p>
            </div>
            <div className="diff-row reveal">
              <h4>AI alone gets you 80% there.</h4>
              <p>The last 20% — the ad account, the build, the books — is where businesses actually live. That&apos;s why there&apos;s a human team behind every dashboard.</p>
            </div>
          </div>
        </section>

        {/* ============ FINAL ============ */}
        <section className="final wrap">
          <div className="reveal">
            <h2>Run your business.<br/><span className="serif">We&apos;ll run the rest.</span></h2>
            <p>Open your dashboard, file your first request, and watch it move. Two minutes to start.</p>
            <div className="hero-ctas" style={{ marginTop: 32 }}>
              <Link className="btn-primary" href="/sign-up">Open your dashboard</Link>
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
