import type { LandingTemplate } from "../types";

// Landing PREMIUM — diseño elevado: aurora animada en el hero, glassmorphism,
// soporte de video de hero ({{HERO_MEDIA}}) y CTA sticky. Mismas variables que
// el template base, más HERO_MEDIA (video loop o imagen).
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
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#07070f;color:#e9e9f1;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img,video{max-width:100%;display:block;height:auto}
a{color:inherit;text-decoration:none}
h1,h2,h3{line-height:1.1;margin:0 0 .5em;font-weight:800;letter-spacing:-.025em}
h1{font-size:clamp(2.2rem,6vw,4rem)}
h2{font-size:clamp(1.7rem,4vw,2.6rem)}
p{margin:0 0 1em}
.container{width:100%;max-width:1160px;margin:0 auto;padding:0 22px}
.grad-text{background:linear-gradient(120deg,#a78bfa 0%,#ff7a18 60%,#f54900 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;padding:15px 26px;border-radius:14px;font-weight:700;font-size:15px;cursor:pointer;border:0;transition:transform .15s ease,box-shadow .25s ease;text-align:center;line-height:1.2}
.btn-primary{background:linear-gradient(135deg,#ff7a18 0%,#f54900 100%);color:#fff;box-shadow:0 12px 34px -10px rgba(245,73,0,.65)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 18px 44px -10px rgba(245,73,0,.8)}
.btn-ghost{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14)}
.btn-lg{padding:18px 34px;font-size:17px;border-radius:16px}
.nav{position:sticky;top:0;z-index:50;backdrop-filter:saturate(180%) blur(16px);-webkit-backdrop-filter:saturate(180%) blur(16px);background:rgba(7,7,15,.7);border-bottom:1px solid rgba(255,255,255,.06)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
.brand{font-weight:800;letter-spacing:.01em;font-size:15px;color:#fff;display:flex;align-items:center;gap:9px}
.brand .logo{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#f54900)}
/* HERO con aurora animada */
.hero{position:relative;padding:84px 0 64px;overflow:hidden}
.aurora{position:absolute;inset:-30%;z-index:0;filter:blur(60px);opacity:.7}
.aurora span{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 18s ease-in-out infinite}
.aurora .a1{width:46vw;height:46vw;left:6%;top:4%;background:radial-gradient(circle,#7c3aed,transparent 65%)}
.aurora .a2{width:40vw;height:40vw;right:4%;top:0;background:radial-gradient(circle,#f54900,transparent 65%);animation-delay:-6s}
.aurora .a3{width:38vw;height:38vw;left:30%;bottom:-10%;background:radial-gradient(circle,#2563eb,transparent 65%);animation-delay:-11s}
@keyframes drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(4%,6%) scale(1.08)}66%{transform:translate(-5%,-3%) scale(.96)}}
.hero-grid{position:relative;z-index:1;display:grid;gap:52px;grid-template-columns:1fr;align-items:center}
@media(min-width:920px){.hero-grid{grid-template-columns:1.05fr .95fr}}
.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:12.5px;color:#d6d6e6;margin-bottom:20px;font-weight:600}
.eyebrow .dot{width:9px;height:9px;border-radius:50%;background:#ff7a18;box-shadow:0 0 12px #ff7a18}
.lead{font-size:clamp(1.08rem,2.2vw,1.28rem);color:#c5c5d4;max-width:54ch}
.checks{display:grid;gap:11px;margin:24px 0 30px;padding:0}
.checks li{list-style:none;padding-left:32px;position:relative;color:#dcdce8}
.checks li::before{content:"";position:absolute;left:0;top:5px;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#ff7a18,#f54900);box-shadow:0 0 0 4px rgba(245,73,0,.15)}
.checks li::after{content:"";position:absolute;left:6px;top:10px;width:8px;height:4px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg)}
.cta-row{display:flex;flex-wrap:wrap;gap:13px;align-items:center}
.cta-note{font-size:13px;color:#9b9bad;margin-top:15px}
.hero-media-wrap{position:relative;display:flex;justify-content:center}
.hero-media-wrap::before{content:"";position:absolute;inset:8% 12%;background:radial-gradient(closest-side,rgba(124,58,237,.55),transparent);filter:blur(40px);z-index:0}
.hero-media{position:relative;z-index:1;max-width:440px;width:100%;border-radius:20px;object-fit:cover;box-shadow:0 50px 90px -30px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08);transform:perspective(1000px) rotateY(-7deg) rotateX(2deg)}
/* Strip de credibilidad */
.strip{border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)}
.strip-inner{display:flex;flex-wrap:wrap;gap:30px;justify-content:space-around;padding:26px 0;text-align:center}
.stat .n{font-size:1.9rem;font-weight:800}
.stat .l{font-size:.82rem;color:#9b9bad;text-transform:uppercase;letter-spacing:.08em}
.section{padding:84px 0;position:relative}
.section-alt{background:#0c0c16}
.section-title{text-align:center;margin-bottom:14px}
.section-sub{text-align:center;color:#a9a9bd;max-width:60ch;margin:0 auto 48px}
.cards{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.card{padding:26px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.07);transition:transform .25s ease,border-color .25s ease}
.card:hover{transform:translateY(-4px);border-color:rgba(255,122,24,.35)}
.card h3{font-size:1.08rem;margin-bottom:6px}
.card p{color:#a9a9bd;font-size:.95rem;margin:0}
.card .ic{width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#7c3aed,#f54900);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;margin-bottom:15px;font-size:1.05rem}
.card.pain{border-color:rgba(245,73,0,.2)}.card.pain .ic{background:linear-gradient(135deg,#f54900,#b91c1c)}
.benefits{display:grid;gap:15px;grid-template-columns:1fr;max-width:780px;margin:0 auto}
@media(min-width:720px){.benefits{grid-template-columns:1fr 1fr}}
.benefit{display:flex;gap:15px;align-items:flex-start;padding:19px;border-radius:15px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)}
.benefit .dot{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f54900);position:relative}
.benefit .dot::after{content:"";position:absolute;left:8px;top:12px;width:9px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg)}
.benefit span{color:#dcdce8;font-weight:500}
.split{display:grid;gap:42px;grid-template-columns:1fr;align-items:center}
@media(min-width:920px){.split{grid-template-columns:1.1fr .9fr}}
.split-media{border-radius:20px;box-shadow:0 34px 64px -26px rgba(0,0,0,.6);width:100%}
.outcomes{list-style:none;padding:0;margin:0;display:grid;gap:13px;max-width:780px;margin:0 auto}
.outcomes li{padding:16px 18px 16px 50px;position:relative;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);color:#dcdce8}
.outcomes li::before{content:"\\2192";position:absolute;left:18px;top:16px;color:#ff7a18;font-weight:800}
.faq{max-width:780px;margin:0 auto;display:grid;gap:11px}
.faq details{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:15px;padding:19px 22px;cursor:pointer}
.faq details[open]{background:rgba(255,255,255,.05);border-color:rgba(255,122,24,.25)}
.faq summary{font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:24px;line-height:1;color:#ff7a18;transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin:12px 0 0;color:#b9b9cb}
.guarantee{max-width:740px;margin:0 auto;text-align:center;padding:42px 30px;border-radius:26px;background:linear-gradient(180deg,rgba(124,58,237,.2),rgba(245,73,0,.12));border:1px solid rgba(255,255,255,.1)}
.badge{display:inline-flex;align-items:center;justify-content:center;width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f54900);color:#fff;font-weight:800;font-size:14px;text-align:center;line-height:1.1;margin-bottom:20px;box-shadow:0 0 0 8px rgba(124,58,237,.12)}
.final-cta{text-align:center;padding:90px 22px;border-radius:30px;margin:0 14px;position:relative;overflow:hidden;background:radial-gradient(70% 90% at 50% 0%,rgba(124,58,237,.4),transparent 70%),#0a0a16;border:1px solid rgba(255,255,255,.07)}
footer{padding:46px 0 110px;text-align:center;color:#7d7d92;font-size:13px;border-top:1px solid rgba(255,255,255,.06);margin-top:40px}
.sticky-cta{position:fixed;left:0;right:0;bottom:0;z-index:60;display:none;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:rgba(7,7,15,.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,.09)}
.sticky-cta .sc-label{font-size:13px;color:#cfcfe0;font-weight:600;line-height:1.2;max-width:55%}
.sticky-cta .btn{padding:12px 18px;font-size:14px}
@media(max-width:760px){.sticky-cta{display:flex}}
@media(prefers-reduced-motion:reduce){.aurora span{animation:none}}
@media(prefers-reduced-motion:no-preference){
  .reveal{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease}
  .reveal.is-visible{opacity:1;transform:none}
}
</style>
</head>
<body>
{{ANALYTICS_BODY}}

<header class="nav">
  <div class="container nav-inner">
    <div class="brand"><span class="logo"></span>{{BRAND_NAME}}</div>
    <a href="{{BUY_LINK}}" class="btn btn-primary" style="padding:10px 18px;font-size:13px">{{CTA}}</a>
  </div>
</header>

<section class="hero">
  <div class="aurora"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>
  <div class="container hero-grid">
    <div class="reveal">
      <span class="eyebrow"><span class="dot"></span> Ebook digital · Acceso inmediato</span>
      <h1><span class="grad-text">{{HEADLINE}}</span></h1>
      <p class="lead">{{SUBHEADLINE}}</p>
      <ul class="checks">{{BENEFITS_HTML}}</ul>
      <div class="cta-row">
        <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg">{{CTA}}</a>
        <a href="#que-incluye" class="btn btn-ghost btn-lg">{{CTA_SECONDARY}}</a>
      </div>
      <p class="cta-note">⚡ Acceso inmediato · Descarga al instante · Garantía 7 días</p>
    </div>
    <div class="hero-media-wrap reveal">{{HERO_MEDIA}}</div>
  </div>
</section>

<div class="strip">
  <div class="container strip-inner">
    <div class="stat"><div class="n grad-text">+1.200</div><div class="l">Lectores</div></div>
    <div class="stat"><div class="n grad-text">4.9★</div><div class="l">Valoración</div></div>
    <div class="stat"><div class="n grad-text">7 días</div><div class="l">Garantía</div></div>
    <div class="stat"><div class="n grad-text">100%</div><div class="l">Digital</div></div>
  </div>
</div>

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
      <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg" style="margin-top:12px">{{CTA}}</a>
    </div>
    <div class="reveal"><img class="split-media" src="{{MOCKUP_IMAGE}}" alt="{{TITLE}} mockup" loading="lazy" /></div>
  </div>
</section>

<section class="section section-alt" id="que-incluye">
  <div class="container">
    <h2 class="section-title reveal">¿Qué vas a recibir?</h2>
    <p class="section-sub reveal">Todo lo que necesitás para lograr resultados reales.</p>
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
      <p style="color:#b9b9cb;max-width:52ch;margin:0 auto 26px">{{SUBHEADLINE}}</p>
      <a href="{{BUY_LINK}}" class="btn btn-primary btn-lg">{{CTA}}</a>
      <p class="cta-note">Acceso inmediato · Garantía de 7 días</p>
    </div>
  </div>
</section>

<footer>
  <div class="container">© <span id="y"></span> {{BRAND_NAME}}. Todos los derechos reservados.</div>
</footer>

<div class="sticky-cta">
  <span class="sc-label">{{TITLE}}</span>
  <a href="{{BUY_LINK}}" class="btn btn-primary">{{CTA}}</a>
</div>

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

export const ebookLandingPremiumTemplate: LandingTemplate = {
  id: "ebook-landing-premium-01",
  name: "Ebook Landing Premium",
  description:
    "Landing premium con aurora animada, glassmorphism y hero con video loop.",
  render: (vars) =>
    HTML.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (_, k: string) => vars[k] ?? ""),
};
