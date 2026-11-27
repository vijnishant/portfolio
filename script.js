/* ===== Edit your details here ===== */
const PROFILE = {
  email: "vijnishant05@gmail.com",
  linkedin: "https://www.linkedin.com/in/your-handle", // TODO: replace with your LinkedIn URL
  github: "https://github.com/vijnishant",
  resume: "Nishant_Vij_Resume.pdf",
};

const ROLES = [
  "build Spring Boot backends.",
  "migrate legacy Java to clean code.",
  "debug what others can't.",
  "develop on Salesforce.",
  "ship React frontends.",
];

const SKILLS = {
  "Languages & DB": ["Java", "C", "C++", "JavaScript", "SQL", "MySQL", "MongoDB"],
  "Backend & Web": ["Spring Boot", "JDBC", "Servlets", "JSP", "REST APIs", "HTTP/HTTPS", "SaaS"],
  "Frontend": ["React.js", "Bootstrap", "Tailwind CSS", "HTML", "CSS"],
  "Salesforce": ["Sales Cloud", "Service Cloud", "Apex", "SOQL", "LWC", "Flows", "Salesforce Admin"],
  "Tools & DevOps": ["Git", "GitHub", "Postman", "Android Studio", "Docker", "CI/CD"],
  "Support": ["Troubleshooting", "Root Cause Analysis", "Log Analysis", "Debugging", "Issue Triage"],
  "Concepts": ["OOP", "Data Structures & Algorithms", "SDLC", "Agile"],
};

const ROLE_FLOWS = {
  client: ["POST /projects — publish a new project", "GET /projects/{id}/bids — review incoming bids", "PUT /projects/{id}/assign — pick a freelancer", "Track progress until delivery"],
  freelancer: ["GET /projects — browse open projects", "POST /projects/{id}/bids — place a bid", "GET /me/assignments — see won projects", "Deliver work to the client"],
  admin: ["GET /users — manage all accounts", "PATCH /users/{id}/role — change roles", "DELETE /projects/{id} — moderate listings", "Role-based guards on every endpoint"],
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Links ===== */
$("#mailBtn").href = `mailto:${PROFILE.email}`;
$("#linkedinLink").href = PROFILE.linkedin;
$("#githubLink").href = PROFILE.github;
$("#year").textContent = new Date().getFullYear();

/* ===== Theme ===== */
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
} catch {}
$("#themeToggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

/* ===== Mobile menu ===== */
const navLinks = $("#navLinks");
$("#menuBtn").addEventListener("click", () => {
  navLinks.classList.toggle("open");
  $("#menuBtn").textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});
$$("#navLinks a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  $("#menuBtn").textContent = "☰";
}));

/* ===== Scroll: nav style, progress, active link ===== */
const sections = $$("main section[id]");
function onScroll() {
  const y = window.scrollY;
  $("#nav").classList.toggle("scrolled", y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  $("#progress").style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  let current = "";
  sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
  $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== Typing effect ===== */
(function typeLoop() {
  const el = $("#typed");
  if (reduceMotion) { el.textContent = ROLES[0]; return; }
  let r = 0, i = 0, deleting = false;
  (function tick() {
    const word = ROLES[r];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) i++;
    else if (deleting && i > 0) i--;
    else if (!deleting) { deleting = true; return setTimeout(tick, 1600); }
    else { deleting = false; r = (r + 1) % ROLES.length; }
    setTimeout(tick, deleting ? 35 : 70);
  })();
})();

/* ===== Reveal + counters ===== */
function countUp(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now(), dur = 1400;
  (function step(t) {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

/* ===== Experience tabs ===== */
$$(".tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".tab").forEach(t => t.classList.toggle("active", t === tab));
  $$(".tab-panel").forEach(p => p.classList.toggle("active", p.id === tab.dataset.tab));
}));

/* ===== Skills filter ===== */
const filters = $("#skillFilters"), cloud = $("#skillCloud");
["All", ...Object.keys(SKILLS)].forEach((cat, idx) => {
  const b = document.createElement("button");
  b.className = "filter" + (idx === 0 ? " active" : "");
  b.textContent = cat;
  b.addEventListener("click", () => {
    $$(".filter").forEach(f => f.classList.toggle("active", f === b));
    $$(".skill").forEach(s => s.classList.toggle("dim", cat !== "All" && s.dataset.cat !== cat));
  });
  filters.appendChild(b);
});
Object.entries(SKILLS).forEach(([cat, list]) => list.forEach(name => {
  const s = document.createElement("span");
  s.className = "skill";
  s.dataset.cat = cat;
  s.textContent = name;
  s.title = cat;
  cloud.appendChild(s);
}));

/* ===== Project: role explorer + spotlight ===== */
function showRole(role) {
  $$(".role").forEach(b => b.classList.toggle("active", b.dataset.role === role));
  $("#roleFlow").innerHTML = ROLE_FLOWS[role]
    .map((line, i) => `<li style="animation-delay:${i * 90}ms">${line}</li>`).join("");
}
$$(".role").forEach(b => b.addEventListener("click", () => showRole(b.dataset.role)));
showRole("client");
$$(".project").forEach(card => card.addEventListener("mousemove", e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}));

/* ===== Copy email + toast ===== */
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2000);
}
$("#copyEmail").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(PROFILE.email); toast("Email copied!"); }
  catch { toast(PROFILE.email); }
});

/* ===== Terminal ===== */
const out = $("#termOut"), input = $("#termInput"), body = $("#termBody");
const cmdHistory = []; let hIdx = 0;
const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
function termPrint(html, cls = "") {
  const d = document.createElement("div");
  if (cls) d.className = cls;
  d.innerHTML = html;
  out.appendChild(d);
  body.scrollTop = body.scrollHeight;
}
const COMMANDS = {
  help: () => `Available commands:
  <span class="cmd">whoami</span>      short intro
  <span class="cmd">experience</span>  where I've worked
  <span class="cmd">skills</span>      tech I use
  <span class="cmd">projects</span>    things I've built
  <span class="cmd">education</span>   degrees
  <span class="cmd">contact</span>     how to reach me
  <span class="cmd">resume</span>      download my résumé
  <span class="cmd">theme</span>       toggle light/dark
  <span class="cmd">clear</span>       clear the screen`,
  whoami: () => "Nishant Vij — Software Engineer (Java · Spring Boot · Salesforce · React), based in Noida, India.",
  experience: () => `<b>Software Engineer</b> @ Raja Software Labs  (Feb 2026 – Sep 2026)
  → Migrated 40 legacy Java modules to Spring Boot for Google Home
  → 90% defect-free fixes · +30% test reliability
<b>Salesforce Developer Intern</b> @ Atman Cloud Consultants  (Jan 2025 – May 2025)
  → 250+ Trailhead badges · Android app · Sample Management System`,
  skills: () => Object.entries(SKILLS).map(([k, v]) => `<span class="cmd">${k.padEnd(15)}</span> ${v.join(", ")}`).join("\n"),
  projects: () => `<b>WorkZoo</b>            Freelancing marketplace — Spring Boot, React.js, MongoDB, RBAC
<b>Atman Foundation</b>   Android app — Java, Firebase
<b>Sample Mgmt System</b> Web app — HTML, CSS, JavaScript`,
  education: () => `PG-DAC, C-DAC ACTS Bengaluru         2025–2026 · 74%
B.Tech CSE, Chandigarh Group of Colleges  2021–2025 · CGPA 7.75`,
  contact: () => `email     <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>
linkedin  <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">${PROFILE.linkedin}</a>
github    <a href="${PROFILE.github}" target="_blank" rel="noopener">${PROFILE.github}</a>`,
  resume: () => { const a = document.createElement("a"); a.href = PROFILE.resume; a.download = ""; a.click(); return "Downloading résumé…"; },
  theme: () => { $("#themeToggle").click(); return `Theme set to ${root.dataset.theme}.`; },
  sudo: () => "Nice try. 😄 Permission denied.",
  hire: () => `Great choice! Type <span class="cmd">contact</span> or email ${PROFILE.email}`,
  clear: () => { out.innerHTML = ""; return null; },
};
function run(raw) {
  const cmd = raw.trim().toLowerCase();
  termPrint(`<span class="cmd">$</span> ${esc(raw)}`);
  if (!cmd) return;
  cmdHistory.push(raw); hIdx = cmdHistory.length;
  const fn = COMMANDS[cmd.split(/\s+/)[0]];
  if (!fn) return termPrint(`command not found: ${esc(cmd)} — try <span class="cmd">help</span>`, "err");
  const res = fn();
  if (res) termPrint(res);
}
termPrint("Welcome to nishant's portfolio shell.", "dim");
termPrint(`Type <span class="cmd">help</span> to get started.`, "dim");
$("#termForm").addEventListener("submit", e => { e.preventDefault(); run(input.value); input.value = ""; });
input.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && hIdx > 0) { input.value = cmdHistory[--hIdx]; e.preventDefault(); }
  if (e.key === "ArrowDown") { hIdx = Math.min(hIdx + 1, cmdHistory.length); input.value = cmdHistory[hIdx] || ""; e.preventDefault(); }
  if (e.key === "Tab") {
    e.preventDefault();
    const m = Object.keys(COMMANDS).filter(c => c.startsWith(input.value.toLowerCase()));
    if (m.length === 1) input.value = m[0];
  }
});
body.addEventListener("click", () => input.focus({ preventScroll: true }));

/* ===== Hero background: connected particles that follow the mouse ===== */
(function particles() {
  const c = $("#bg"), ctx = c.getContext("2d");
  let w, h, pts = [], mouse = { x: -999, y: -999 };
  const resize = () => {
    w = c.width = c.offsetWidth * devicePixelRatio;
    h = c.height = c.offsetHeight * devicePixelRatio;
    const n = Math.min(90, Math.floor((c.offsetWidth * c.offsetHeight) / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
  };
  resize();
  addEventListener("resize", resize);
  c.parentElement.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect();
    mouse = { x: (e.clientX - r.left) * devicePixelRatio, y: (e.clientY - r.top) * devicePixelRatio };
  });
  c.parentElement.addEventListener("mouseleave", () => (mouse = { x: -999, y: -999 }));
  const link = 130 * devicePixelRatio;
  function frame() {
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = ctx.strokeStyle = accent;
    for (const p of pts) {
      if (!reduceMotion) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < link * 1.4) { p.x += (p.x - mouse.x) * .01; p.y += (p.y - mouse.y) * .01; }
      ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineWidth = devicePixelRatio * .6;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < link) {
        ctx.globalAlpha = (1 - d / link) * .35;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
})();
