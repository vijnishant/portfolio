/* ===== Edit your details here ===== */
const PROFILE = {
  email: "vijnishant05@gmail.com",
  linkedin: "https://www.linkedin.com/in/nishant-vij-5a4025229/",
  github: "https://github.com/vijnishant",
  resume: "Nishant_Vij_Resume.pdf",
};

const ROLES = [
  "design AI workflows that replace manual work.",
  "cut manual effort by 90% with automation.",
  "automate the boring parts with AI.",
  "refactor legacy Java with AI tools.",
  "turn flaky tests into stable pipelines.",
  "build Spring Boot backends.",
  "ship faster with AI-assisted dev.",
];

const SKILLS = {
  "AI & Automation": ["AI Workflow Architecture", "Process Automation", "AI Research", "AI-assisted Development", "AI Code Refactoring", "AI-assisted Debugging", "Test Automation", "CI/CD Pipelines", "Salesforce Flows", "Docker"],
  "System Design": ["System Design", "High-Level Design (HLD)", "Low-Level Design (LLD)", "Software Architecture", "Design Patterns", "REST API Design", "Database Design", "Scalability"],
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
  s.className = "skill" + (cat === "AI & Automation" ? " ai-skill" : "");
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

/* ===== Background processes (hobby cards): tap to flip ===== */
$$(".proc").forEach(card => card.addEventListener("click", () => {
  const on = card.classList.toggle("flipped");
  card.setAttribute("aria-pressed", on);
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

/* ===== AI pipeline demo ===== */
(function pipeline() {
  const nodes = $$("#pipeNodes .pnode"), log = $("#pipeLog"), btn = $("#runPipe");
  const MODULES = ["DeviceRegistry", "HomeGraphSync", "AutomationRules", "UserPrefsService", "NotificationHub", "SceneScheduler", "AuthTokenStore", "TelemetryLogger"];
  const STEPS = [
    [["dim", "→ loading legacy module {m}.java"], ["warn", "  found tight coupling, no DI, 1 flaky test"]],
    [["ai", "✦ AI: mapping class dependencies…"], ["ai", "✦ AI: summarized old logic into a migration plan"]],
    [["ai", "✦ AI: generated Spring Boot service + boilerplate"], ["dim", "  I reviewed and adjusted the generated code"]],
    [["dim", "→ running automated test suite…"], ["ok", "  flaky test fixed · all tests passing"]],
    [["ok", "✓ {m} migrated to Spring Boot · ~30% less manual effort"]],
  ];
  let migrated = 0, running = false;
  const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));
  const line = (cls, text) => {
    const d = document.createElement("div");
    d.className = cls; d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  };
  btn.addEventListener("click", async () => {
    if (running) return;
    running = true; btn.disabled = true; btn.textContent = "⏳ Running…";
    const m = MODULES[migrated % MODULES.length];
    nodes.forEach(n => n.classList.remove("active", "done"));
    line("dim", `$ run-migration --module ${m}`);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.add("active");
      for (const [cls, text] of STEPS[i]) { await sleep(450); line(cls, text.replace("{m}", m)); }
      await sleep(300);
      nodes[i].classList.replace("active", "done");
    }
    migrated = Math.min(40, migrated === 0 ? 5 : migrated + 5);
    $("#pipeCount").textContent = `${migrated} / 40`;
    $("#pipeBar").style.width = `${(migrated / 40) * 100}%`;
    if (migrated >= 40) line("ok", "🎉 All 40 modules migrated. This matches my real work on the Google Home project.");
    btn.textContent = migrated >= 40 ? "↺ Run again" : "▶ Run next batch";
    if (migrated >= 40) migrated = 0;
    btn.disabled = false; running = false;
  });
})();

/* ===== AI assistant (runs in the browser, answers from the résumé) ===== */
const out = $("#termOut"), input = $("#termInput"), body = $("#termBody");
const cmdHistory = []; let hIdx = 0, busy = false;
const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
function termPrint(html, cls = "") {
  const d = document.createElement("div");
  if (cls) d.className = cls;
  d.innerHTML = html;
  out.appendChild(d);
  body.scrollTop = body.scrollHeight;
  return d;
}

const INTENTS = [
  { keys: ["coscale", "co scale", "current", "now", "present", "architect", "research", "lead", "workflow"],
    answer: "Nishant is currently the AI Workflow Architect & Research Lead at CoScale Global (since Nov 2026). He designs and builds end-to-end AI workflows that automate processes the team used to do by hand, which has cut manual effort on those processes by 90%. He also leads research into new AI tools and techniques and turns the most promising ideas into working automations." },
  { keys: ["ai", "a.i", "artificial", "automat", "copilot", "chatgpt", "gpt", "llm", "claude", "gemini", "prompt", "tool"],
    answer: "AI is the center of Nishant's work. As AI Workflow Architect & Research Lead at CoScale Global, he automates manual processes with AI workflows and has cut manual effort on them by 90%. Before that, at Raja Software Labs, he used AI-assisted development tools for code analysis, refactoring and boilerplate while migrating 40 legacy Java modules to Spring Boot for Google Home. That cut manual effort per module by 30%. He also used AI tools to speed up coding and debugging on the Atman Foundation Android app. He reviews and tests everything the AI produces before it ships." },
  { keys: ["why hire", "hire", "strength", "best", "good fit", "stand out", "unique", "value"],
    answer: "Three reasons: (1) he turns manual work into AI workflows. At CoScale Global he cut manual effort by 90%, and at Raja Software Labs AI tools cut his effort per module by 30%; (2) he cares about quality, with 90% defect-free production fixes and 90% test stability; (3) he combines AI research leadership with solid engineering, including migrating 40 legacy Java modules to Spring Boot for Google Home." },
  { keys: ["test", "testing", "flaky", "qa", "quality", "stability", "reliab"],
    answer: "He analyzed and fixed flaky test cases in the automation suite at Raja Software Labs. That improved test reliability by 30% and reached 90% test stability, which kept releases consistent." },
  { keys: ["debug", "bug", "root cause", "rca", "triage", "log", "issue", "fix"],
    answer: "Debugging is one of his strengths. He does root cause analysis and triage of complex Java issues using logs and error messages, and 90% of his production fixes were defect-free. He also uses AI help to find root causes faster." },
  { keys: ["experience", "work", "job", "company", "raja", "google", "career", "role", "intern", "atman"],
    answer: "• AI Workflow Architect & Research Lead @ CoScale Global (Nov 2026 – Present): automates manual processes with AI workflows, cutting manual effort by 90%, and leads AI research.\n• Software Engineer @ Raja Software Labs, Bengaluru (Feb 2026 – Sep 2026): migrated 40 legacy Java modules to Spring Boot for Google Home, made fixes that were 90% defect-free, brought tests to 90% stability, and cut manual effort 30% with AI tools.\n• Salesforce Developer Intern @ Atman Cloud Consultants, Pune (Jan 2025 – May 2025): earned 250+ Trailhead badges, built an Android app and the Sample Management System." },
  { keys: ["salesforce", "apex", "soql", "lwc", "trailhead", "crm", "flow"],
    answer: "He was a Salesforce Developer Intern at Atman Cloud Consultants and earned 250+ Trailhead badges. He has worked with Sales Cloud, Service Cloud, Apex, SOQL, LWC, and Flows, which is Salesforce's automation tool." },
  { keys: ["system design", "design", "architecture", "hld", "lld", "scalab", "pattern"],
    answer: "Nishant works across system design, from high-level design (HLD) to low-level design (LLD), along with design patterns, REST API design and database design. He applied this when he re-architected 40 legacy Java modules into Spring Boot for Google Home, and today he designs end-to-end AI workflow systems at CoScale Global." },
  { keys: ["java", "spring", "backend", "api", "rest", "jdbc", "servlet"],
    answer: "Backend is his core: Java, Spring Boot, JDBC, Servlets, JSP and REST APIs. He migrated 40 legacy Java modules to Spring Boot for Google Home and built the Spring Boot backend for WorkZoo." },
  { keys: ["project", "built", "build", "workzoo", "portfolio", "app", "github"],
    answer: "• WorkZoo: a freelancing marketplace. He built the Spring Boot backend with project posting, bidding, freelancer assignment and role-based access, using MongoDB and a React frontend.\n• Atman Foundation: an Android app built with Java and Firebase.\n• Sample Management System: a web app (HTML, CSS, JS) that the CEO approved.",
    extra: () => `Code: ${link("https://github.com/Work-Zoo", "github.com/Work-Zoo")}` },
  { keys: ["skill", "tech", "stack", "know", "language", "frontend", "react", "database", "sql", "mongo", "docker"],
    answer: () => "Here's his stack:\n" + Object.entries(SKILLS).map(([k, v]) => `• ${k}: ${v.join(", ")}`).join("\n") },
  { keys: ["educat", "degree", "college", "study", "cdac", "c-dac", "btech", "b.tech", "university", "cgpa"],
    answer: "• PG Diploma in Advanced Computing (PG-DAC), C-DAC ACTS Bengaluru, 2025–2026, 74%\n• B.Tech in Computer Science & Engineering, Chandigarh Group of Colleges, Landran, 2021–2025, CGPA 7.75/10" },
  { keys: ["hobby", "hobbies", "free time", "fun", "travel", "badminton", "sport", "weekend", "outside work", "interest", "passion", "people", "offline"],
    answer: "When he logs off, three background processes keep running:\n✈️ Travelling: new places reset his perspective and spark fresh ideas.\n🏸 Badminton: fast reflexes, focus under pressure, and a love for long rallies.\n🤝 Connecting with people: the one process he'd never automate. Some of his best ideas started with a good conversation." },
  { keys: ["contact", "email", "reach", "linkedin", "connect", "talk", "call"],
    answer: "The best way to reach Nishant is by email or LinkedIn.",
    extra: () => `email: ${link("mailto:" + PROFILE.email, PROFILE.email)}\nlinkedin: ${link(PROFILE.linkedin, "linkedin.com/in/nishant-vij")}\ngithub: ${link(PROFILE.github, "github.com/vijnishant")}` },
  { keys: ["where", "location", "based", "live", "city", "relocat", "remote"],
    answer: "He's based in Noida, Uttar Pradesh, India. For questions about location or remote work, it's best to ask him directly by email." },
  { keys: ["available", "open to", "looking", "notice", "join"],
    answer: "Yes, he's open to software engineering roles and interesting projects. Email him and he'll get back to you." },
  { keys: ["team", "agile", "collab", "communicat", "stakeholder"],
    answer: "He worked with 6 cross-functional teammates in Agile at Raja Software Labs, presented fixes to stakeholders and documented them clearly. As an intern, he presented the Sample Management System to the CEO and won project approval." },
  { keys: ["hi", "hello", "hey", "yo", "namaste"],
    answer: "Hi! 👋 I'm Nishant's AI assistant. Ask me about his AI workflow, experience, projects, skills or how to contact him." },
  { keys: ["who", "about", "yourself", "intro", "summary"],
    answer: "Nishant Vij is the AI Workflow Architect & Research Lead at CoScale Global, based in Noida, India. He automates manual processes with AI, cutting manual effort by 90%, and has a software engineering background in Java, Spring Boot, Salesforce and React." },
];

function answerFor(q) {
  const text = " " + q.toLowerCase().replace(/[?!.,]/g, " ") + " ";
  let best = null, bestScore = 0;
  for (const it of INTENTS) {
    let score = 0;
    for (const k of it.keys) {
      const hit = k.length <= 3 ? new RegExp(`\\b${k.replace(".", "\\.")}\\b`).test(text) : text.includes(k);
      if (hit) score += k.length > 3 ? 2 : 1;
    }
    if (score > bestScore) { best = it; bestScore = score; }
  }
  return best;
}

async function streamAnswer(text, extraHtml) {
  busy = true;
  const thinking = termPrint("thinking", "thinking");
  await new Promise(r => setTimeout(r, reduceMotion ? 0 : 500 + Math.random() * 400));
  thinking.remove();
  const el = termPrint("", "a");
  const node = document.createTextNode("");
  el.appendChild(node);
  if (reduceMotion) node.textContent = text;
  else {
    for (let i = 0; i < text.length; i += 3) {
      node.textContent = text.slice(0, i + 3);
      body.scrollTop = body.scrollHeight;
      await new Promise(r => setTimeout(r, 12));
    }
  }
  if (extraHtml) el.insertAdjacentHTML("beforeend", "\n" + extraHtml);
  body.scrollTop = body.scrollHeight;
  busy = false;
}

const COMMANDS = {
  help: () => `You can ask questions in plain English, for example:
  "How does Nishant use AI?"  "Why should we hire him?"  "What did he build?"
Or use commands:
  <span class="cmd">skills</span> · <span class="cmd">experience</span> · <span class="cmd">projects</span> · <span class="cmd">education</span> · <span class="cmd">contact</span>
  <span class="cmd">resume</span> download résumé · <span class="cmd">theme</span> light/dark · <span class="cmd">clear</span> clear screen`,
  resume: () => { const a = document.createElement("a"); a.href = PROFILE.resume; a.download = ""; a.click(); return "Downloading résumé…"; },
  theme: () => { $("#themeToggle").click(); return `Theme set to ${root.dataset.theme}.`; },
  sudo: () => "Nice try. 😄 Permission denied.",
  clear: () => { out.innerHTML = ""; return null; },
};
const ALIASES = { skills: "skills", experience: "experience", projects: "projects", education: "education", contact: "contact", whoami: "who are you", hire: "why hire him" };

function run(raw) {
  const q = raw.trim();
  if (!q || busy) return;
  termPrint(esc(q), "q");
  cmdHistory.push(q); hIdx = cmdHistory.length;
  const cmd = q.toLowerCase();
  if (COMMANDS[cmd]) { const res = COMMANDS[cmd](); if (res) termPrint(res); return; }
  const it = answerFor(ALIASES[cmd] || q);
  if (!it) return streamAnswer("I'm not sure about that one. I only know what's on Nishant's résumé. Try asking about his AI workflow, experience, projects, skills, education, or how to contact him.");
  const ans = typeof it.answer === "function" ? it.answer() : it.answer;
  streamAnswer(ans, it.extra && it.extra());
}

const SUGGESTIONS = ["What does he do at CoScale Global?", "How does Nishant use AI?", "Why should we hire him?", "What did he build at Google Home?", "Tell me about his projects", "What are his hobbies?", "What's his tech stack?", "How can I contact him?"];
SUGGESTIONS.forEach(s => {
  const b = document.createElement("button");
  b.textContent = s;
  b.addEventListener("click", () => run(s));
  $("#suggest").appendChild(b);
});

termPrint("nishant-ai v1.0 · answers come only from Nishant's résumé.", "dim");
termPrint(`Ask a question or tap a suggestion above. Type <span class="cmd">help</span> for commands.`, "dim");
$("#termForm").addEventListener("submit", e => { e.preventDefault(); run(input.value); input.value = ""; });
input.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && hIdx > 0) { input.value = cmdHistory[--hIdx]; e.preventDefault(); }
  if (e.key === "ArrowDown") { hIdx = Math.min(hIdx + 1, cmdHistory.length); input.value = cmdHistory[hIdx] || ""; e.preventDefault(); }
  if (e.key === "Tab") {
    e.preventDefault();
    const m = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)].filter(c => c.startsWith(input.value.toLowerCase()));
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
