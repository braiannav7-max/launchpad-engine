import type { LandingTemplate } from "../types";

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{META_TITLE}}</title>
<meta name="description" content="{{META_DESCRIPTION}}" />
<meta property="og:title" content="{{META_TITLE}}" />
<meta property="og:description" content="{{META_DESCRIPTION}}" />
<meta property="og:image" content="{{COVER_IMAGE}}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{META_TITLE}}" />
<meta name="twitter:description" content="{{META_DESCRIPTION}}" />
<meta name="twitter:image" content="{{COVER_IMAGE}}" />
{{ANALYTICS_HEAD}}
<style>
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0b0b14;color:#e9e9f1;line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block;height:auto}
a{color:inherit;text-decoration:none}
h1,h2,h3{line-height:1.2;margin:0 0 .5em;font-weight:800;letter-spacing:-.02em}
h1{font-size:clamp(2rem,5.5vw,3.5rem)}
h2{font-size:clamp(1.5rem,3.8vw,2.25rem)}
p{margin:0 0 1em}
.container{width:100%;max-width:1120px;margin:0 auto;padding:0 20px}
.nav{position:sticky;top:0;z-index:50;backdrop-filter:saturate(180%) blur(14px);-webkit-backdrop-filter:saturate(180%) blur(14px);background:rgba(11,11,20,.72);border-bottom:1px solid rgba(255,255,255,.06)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
.brand{font-weight:700;letter-spacing:.02em;font-size:14px;color:#fff}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;padding:14px 24px;border-radius:14px;font-weight:700;font-size:15px;cursor:pointer;border:0;transition:transform .15s ease,box-shadow .2s ease,background .2s ease;text-align:center;line-height:1.2}
.btn-primary{background:linear-gradient(135deg,#ff7a18 0%,#f54900 100%);color:#fff;box-shadow:0 10px 30px -10px rgba(245,73,0,.6)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 14px 36px -10px rgba(245,73,0,.7)}
.btn-ghost{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.12)}
.btn-lg{padding:18px 32px;font-size:17px;border-radius:16px}
.hero{position:relative;padding:64px 0 56px;overflow:hidden}
.hero::before{content:"";position:absolute;inset:-20% -10% auto -10%;height:120%;background:radial-gradient(60% 50% at 20% 20%,rgba(124,58,237,.35),transparent 60%),radial-gradient(50% 40% at 80% 10%,rgba(245,73,0,.28),transparent 60%);filter:blur(20px);z-index:0}
.hero-grid{position:relative;z-index:1;display:grid;gap:48px;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.hero-grid{grid-template-columns:1.05fr .95fr}}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);font-size:12px;color:#cfcfe0;margin-bottom:18px}
.lead{font-size:clamp(1.05rem,2.2vw,1.2rem);color:#c9c9d6;max-width:56ch}
.checks{display:grid;gap:10px;margin:22px 0 28px}
.checks li{list-style:none;padding-left:30px;position:relative;color:#dcdce8}
.checks li::before{content:"";position:absolute;left:0;top:6px;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#ff7a18,#f54900);box-shadow:0 0 0 4px rgba(245,73,0,.15)}
.checks li::after{content:"";position:absolute;left:5px;top:10px;width:8px;height:4px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg)}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.cta-note{font-size:13px;color:#9b9bad;margin-top:14px}
.hero-art{position:relative;display:flex;justify-content:center}
.hero-art img{max-width:420px;width:100%;border-radius:18px;box-shadow:0 40px 80px -30px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06);transform:rotate(-3deg)}
.section{padding:72px 0;position:relative}
.section-alt{background:#10101c}
.section-title{text-align:center;margin-bottom:14px}
.section-sub{text-align:center;color:#a9a9bd;max-width:62ch;margin:0 auto 44px}
.cards{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card{padding:24px;border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.06)}
.card h3{font-size:1.05rem;margin-bottom:6px}
.card p{color:#a9a9bd;font-size:.95rem;margin:0}
.card .ic{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#f54900);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;margin-bottom:14px}
.benefits{display:grid;gap:14px;grid-template-columns:1fr;max-width:760px;margin:0 auto}
@media(min-width:720px){.benefits{grid-template-columns:1fr 1fr}}
.benefit{display:flex;gap:14px;align-items:flex-start;padding:18px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
.benefit .dot{flex:0 0 auto;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f54900);position:relative}
.benefit .dot::after{content:"";position:absolute;left:7px;top:11px;width:9px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg)}
.benefit span{color:#dcdce8;font-weight:500}
.split{display:grid;gap:36px;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.split{grid-template-columns:1.1fr .9fr}}
.split img{border-radius:18px;box-shadow:0 30px 60px -25px rgba(0,0,0,.5)}
.outcomes{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.outcomes li{padding:14px 16px 14px 46px;position:relative;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:#dcdce8}
.outcomes li::before{content:"→";position:absolute;left:16px;top:14px;color:#ff7a18;font-weight:800}
.faq{max-width:760px;margin:0 auto;display:grid;gap:10px}
.faq details{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:18px 20px;cursor:pointer}
.faq details[open]{background:rgba(255,255,255,.05)}
.faq summary{font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:22px;line-height:1;color:#ff7a18;transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin:12px 0 0;color:#b9b9cb}
.guarantee{max-width:720px;margin:0 auto;text-align:center;padding:36px 28px;border-radius:24px;background:linear-gradient(180deg,rgba(124,58,237,.18),rgba(245,73,0,.12));border:1px solid rgba(255,255,255,.08)}
.badge{display:inline-flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f54900);color:#fff;font-weight:800;font-size:14px;text-align:center;line-height:1.1;margin-bottom:18px}
.final-cta{text-align:center;padding:80px 20px;border-radius:28px;margin:0 20px;background:radial-gradient(60% 80% at 50% 0%,rgba(124,58,237,.35),transparent 70%),#0e0e1a;border:1px solid rgba(255,255,255,.06)}
footer{padding:40px 0;text-align:center;color:#7d7d92;font-size:13px;border-top:1px solid rgba(255,255,255,.06);margin-top:40px}
@media(prefers-reduced-motion:no-preference){
  .reveal{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
  .reveal.is-visible{opacity:1;transform:none}
}
</style>
</head>
<body>
{{ANALYTICS_BODY}}

<header class="nav">
  <div class="container nav-inner">
    <div class="brand">{{BRAND_NAME}}</div>
    <a href="{{BUY_LINK}}" class="btn btn-primary" style="padding:10px 18px;font-size:13px">{{CTA}}</a>
  </div>
</header>

<section class="hero">
  <div class="container hero-grid">
    <div class="reveal">
      <span class="eyebrow">📘 Ebook digital · Acceso inmediato</span>
      <h1>{{HEADLINE}}</h1>
      <p class="lead">{{SUBHEADLINE}}</p>
      <ul class="checks">{{BENEFITS_HTML}}</ul>
      <div class="cta-row">
        <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg">{{CTA}}</a>
        <a href="#que-incluye" class="btn btn-ghost btn-lg">{{CTA_SECONDARY}}</a>
      </div>
      <p class="cta-note">⚡ Acceso inmediato · Descarga al instante</p>
    </div>
    <div class="hero-art reveal">
      <img src="{{COVER_IMAGE}}" alt="{{TITLE}}" loading="eager" />
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title reveal">{{PROBLEM_TITLE}}</h2>
    <p class="section-sub reveal">{{PROBLEM_DESCRIPTION}}</p>
    <div class="cards">{{PAIN_POINTS_HTML}}</div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal">
      <h2>{{SOLUTION_TITLE}}</h2>
      <p style="color:#b9b9cb">{{SOLUTION_DESCRIPTION}}</p>
      <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg" style="margin-top:10px">{{CTA}}</a>
    </div>
    <div class="reveal"><img src="{{MOCKUP_IMAGE}}" alt="{{TITLE}} mockup" loading="lazy" /></div>
  </div>
</section>

<section class="section section-alt" id="que-incluye">
  <div class="container">
    <h2 class="section-title reveal">¿Qué vas a recibir?</h2>
    <p class="section-sub reveal">Todo lo que necesitas para lograr resultados reales.</p>
    <div class="cards">{{INCLUDES_HTML}}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title reveal">Beneficios principales</h2>
    <div class="benefits">{{OUTCOMES_HTML}}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title reveal">Preguntas frecuentes</h2>
    <div class="faq">{{FAQ_HTML}}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="guarantee reveal">
      <div class="badge">7 DÍAS<br/>GARANTÍA</div>
      <h2>{{GUARANTEE_TITLE}}</h2>
      <p style="color:#c9c9d6">{{GUARANTEE_TEXT}}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="final-cta reveal">
      <h2>{{FINAL_CTA_TITLE}}</h2>
      <p style="color:#b9b9cb;max-width:52ch;margin:0 auto 24px">{{SUBHEADLINE}}</p>
      <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg">{{CTA}}</a>
      <p class="cta-note">Acceso inmediato · Garantía de 7 días</p>
    </div>
  </div>
</section>

<footer>
  <div class="container">© <span id="y"></span> {{BRAND_NAME}}. Todos los derechos reservados.</div>
</footer>

<script>
document.getElementById('y').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
}
</script>
</body>
</html>`;

export const ebookLandingTemplate: LandingTemplate = {
  id: "ebook-landing-01",
  name: "Ebook Landing",
  description: "Landing moderna mobile-first para vender un ebook digital.",
  render: (vars) => HTML.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (_, k: string) => vars[k] ?? ""),
};