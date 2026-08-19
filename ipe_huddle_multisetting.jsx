import React, { useState, useRef, useEffect } from "react";

const MAROON = "#7A1E2C";
const GOLD = "#94703A";
const INK = "#1B2733";
const PAPER = "#FBF7F4";
const TINT = "#F5EBED";

// Every case folds in ALL the information the student needs. The task is to
// ORGANIZE it into an SBAR and communicate — never to supply clinical knowledge.
// Settings vary so students meet a wider range of professions.
const CASES = [
  {
    id: "lbp", setting: "Outpatient clinic", name: "Dana Whitfield, 45",
    settingNote: "You're a PT in an outpatient clinic — patients come to you for visits. This team includes the patient's doctor, behavioral health, and a case manager.",
    brief: "Dana Whitfield is a 45-year-old office manager. She's had low back pain for about 8 months; it came on gradually with no specific injury. An MRI two months ago was unremarkable. Her primary care doctor has managed the pain with a low-dose opioid. Dana is afraid that moving will 'do more damage,' has been avoiding activity, and has missed work. She keeps asking for another MRI.",
    findings: ["Pain 6/10 at rest, up to 8/10 with prolonged sitting", "No red flags — no numbness, weakness, or bowel/bladder changes", "Full leg strength; no nerve signs", "Movement is guarded — appears driven by fear, not a physical block", "Scored high on a fear-of-movement questionnaire", "Once coached, she did gentle active movement with no increase in pain", "Her goal: 'get back to work and playing with my kids'"],
    team: "You play **Dr. Okafor (PCP)**, **Priya (pain psychologist)**, and **Marcus (case manager)**. Gentle theme: the PT's active-movement approach and the psychologist's fear/coping work fit together; the team wants a consistent message for Dana.",
    opening: "**Dr. Okafor (PCP):** Thanks for making time, team. Dana wants another MRI and more medication, and I'd like us on the same page before I respond. PT, you saw her today — walk us through what you've got.",
  },
  {
    id: "shoulder", setting: "Outpatient ortho", name: "Ray Colton, 52",
    settingNote: "You're a PT in an outpatient clinic. For a work injury, the team can include the surgeon, an OT for work conditioning, and a workers' comp case manager.",
    brief: "Ray Colton is a 52-year-old electrician. He had rotator cuff repair on his right shoulder 10 weeks ago. His job involves a lot of overhead lifting. This is a workers' comp case, and his employer is asking when he can return to full duty. The surgeon's protocol allows active range of motion and light strengthening, but no heavy overhead lifting yet.",
    findings: ["Shoulder flexion improved to 140° (was 110° last month); still limited overhead", "Rotator cuff strength 4/5; pain only at the very end of range", "Incision well healed; no signs of complications", "Can do light daily tasks, but not yet overhead work tasks", "Motivated, but anxious about his job and finances", "Your impression: on track — but not ready for full-duty overhead work yet"],
    team: "You play **Dr. Reyes (orthopedic surgeon)**, **Sam (OT)**, and **Lauren (workers' comp case manager)**. Have Sam explain that OT does 'work conditioning' — simulating job tasks — so the student learns how OT differs from PT here. Collaborative, not a turf fight.",
    opening: "**Dr. Reyes (Ortho):** Good to have everyone. Ray's employer wants a return-to-work date. PT, you saw him today — tell us where his shoulder is and what you're thinking.",
  },
  {
    id: "peds", setting: "Outpatient pediatrics", name: "Mateo, age 5",
    settingNote: "You're a PT in an outpatient pediatric clinic. The team often includes OT, speech therapy, teachers, and the family.",
    brief: "Mateo is a 5-year-old starting kindergarten, seen in your outpatient pediatric clinic for gross-motor delays and coordination difficulties. He also has some fine-motor and speech-sound concerns. His mom, Sofia, is at the meeting and wants to make sure everyone's plans fit together without overwhelming the family.",
    findings: ["Difficulty running, jumping, and climbing stairs compared to peers", "Trouble with balance and with catching a ball", "Gets frustrated and gives up quickly on motor tasks", "Loves movement when it's turned into a game", "Mom reports he trips a lot and avoids the playground", "Your focus: gross-motor skills, balance, and coordination through play"],
    team: "You play **Renee (OT)**, **Beth (SLP)**, **Ms. Alvarez (kindergarten teacher)**, and **Sofia (Mom)**. Have Renee explain OT (fine-motor/sensory) and Beth explain SLP (speech sounds). Practice jargon-free, family-centered communication with Mom.",
    opening: "**Renee (OT):** Thanks for coming, everyone — and welcome, Sofia. We each see Mateo for different things, and Mom asked us to make our plans fit together. PT, want to start with what you're seeing?",
  },
  {
    id: "falls", setting: "Outpatient clinic", name: "Eleanor Pruitt, 78",
    settingNote: "You're a PT in an outpatient clinic. The team can include the patient's doctor, a pharmacist, and a social worker.",
    brief: "Eleanor Pruitt is 78, seen in your outpatient clinic for balance problems and dizziness after two recent falls at home. She lives alone, recently stopped driving, and takes several medications. She's been missing sessions because she can't find rides.",
    findings: ["Reports the room briefly 'spinning' when she stands up quickly", "Unsteady with turns and on uneven surfaces", "Reduced lower-body strength and slow walking speed", "Scored in the 'high fall-risk' range on a standard balance test", "Says she feels dizzy sometimes — worse in the mornings and after taking her medications", "No injuries from the falls, but fearful of falling again"],
    team: "You play **Dr. Hsu (PCP)**, **Karim (pharmacist)**, and **Grace (social worker)**. When the student mentions she's dizzy after her meds, have Karim connect it (he found two meds that can cause dizziness) and explain what a pharmacist adds. Do NOT expect the student to know pharmacology — they just report what they observed. Grace can raise transportation.",
    opening: "**Dr. Hsu (PCP):** Thanks, all. Eleanor's had two falls and I want a plan before there's a third. PT, you see her move every week — start us off. What are you finding?",
  },
  {
    id: "lymphedema", setting: "Outpatient clinic", name: "Harold Banks, 63",
    settingNote: "You're a PT in an outpatient clinic. The team can include the physician, home-health nursing, and a dietitian.",
    brief: "Harold Banks is 63, seen in your outpatient clinic for swelling in his lower leg (lymphedema) after cancer treatment. You've been treating him with compression wrapping and gentle exercise. Lately you've noticed redness and early skin breakdown on his lower leg, and Harold admits he hasn't kept up with his compression and skin care at home.",
    findings: ["Swelling in the right lower leg has improved with therapy", "New: a small area of red, irritated skin on his shin", "Harold says the home compression wrap is 'confusing,' so he skips it", "He lives with his wife, who is willing to help", "Motivated, but overwhelmed by all the instructions", "Your concern: the new skin change and the inconsistent home routine"],
    team: "You play **Dr. Nguyen (physician)**, **Tomas (home-health nurse)**, and **Deb (dietitian)**. Have Tomas explain home health (skin monitoring, home compression help) and Deb explain nutrition for skin healing. The student only reports what they observed; nursing takes the skin lead. Never imply the student should know lymphedema management.",
    opening: "**Dr. Nguyen:** Thanks, team. Harold's swelling is improving, but I'm watching that skin change and his home routine's been spotty. PT, you're leading his therapy — where are things, and what are you seeing?",
  },
  {
    id: "acute", setting: "Acute care (hospital)", name: "Walter Pierce, 80",
    settingNote: "You're a PT in the hospital. Acute-care teams move fast and focus on getting patients safely to the next place. This team includes the hospitalist, the bedside nurse, and a case manager who arranges discharge.",
    brief: "Walter Pierce is 80. He was admitted 4 days ago after a fall and had surgery to repair a broken hip. The team is meeting to plan where he goes when he leaves the hospital. He lives with his wife in a one-story home; she's supportive but has her own health issues.",
    findings: ["Needs moderate assist of one person to stand and walk a few steps with a walker", "Can't yet manage the two steps to enter his home", "Tires quickly; tolerates about 10 minutes of activity", "Motivated and follows directions well", "His wife can't physically help him if he loses balance", "Your impression: not safe to go straight home yet — would benefit from a short rehab stay first"],
    team: "You play **Dr. Patel (hospitalist)**, **Nia, RN (bedside nurse)**, and **Rosa (case manager)** — have Rosa explain what a case manager does in the hospital. The discharge destination depends on the PT's mobility report, so the team genuinely needs the student's SBAR.",
    opening: "**Dr. Patel (Hospitalist):** Thanks, everyone. We need to figure out where Walter goes when he leaves us — home, or a short rehab stay. PT, you worked with him this morning — how's he moving, and what do you think is safest?",
  },
  {
    id: "snf", setting: "Skilled nursing / rehab", name: "Gloria Simmons, 74",
    settingNote: "You're a PT at a skilled nursing facility — a short-term rehab stay after a hospital visit. These teams meet weekly to track progress toward going home. The team includes nursing, therapy, a dietitian, and social services.",
    brief: "Gloria Simmons is 74. She's been at the rehab facility for two weeks after a hospital stay for pneumonia that left her very weak. The team meets weekly to check her progress toward going home. She's eager to get back to her apartment, where she lives alone.",
    findings: ["Now walks 100 feet with a walker and supervision (was 20 feet last week)", "Gets in and out of bed with minimal help", "Still short of breath with longer distances", "Eating better, but lost weight during her illness", "Lives alone in a second-floor apartment with an elevator", "Your impression: good progress; likely a week or two from a safe discharge home with some help"],
    team: "You play **Jamal, RN (charge nurse)**, **Deb (dietitian)** — can explain her role with the weight loss, and **Ellen (social services)** — arranges home support and can explain her role. The team is coordinating Gloria's path home; the PT reports progress and mobility.",
    opening: "**Ellen (Social Services):** Good morning, team — weekly check-in on Gloria. She's asking about going home, so let's see where everyone's at. PT, want to start with how her walking and strength are coming along?",
  },
  {
    id: "homehealth", setting: "Home health", name: "Frank Delgado, 68",
    settingNote: "You're a PT who treats patients in their homes. Home-health teams coordinate from a distance — they can't just walk down the hall. The team often includes the home-health nurse, therapy, and the patient's doctor, with the family closely involved.",
    brief: "Frank Delgado is 68. He came home last week after a hospital stay for heart failure. You see him for PT in his home. The team is checking in by phone to make sure he's safe and improving. His daughter checks on him daily.",
    findings: ["Walks around his home with a cane but gets winded quickly", "Manages basic daily tasks but tires by afternoon", "His home has a few loose rugs and poor stair lighting (fall hazards)", "Sometimes forgets to weigh himself daily (important for his heart condition)", "Daughter is involved and wants to help", "Your impression: improving, but home safety and his daily routine need attention"],
    team: "You play **Dr. Lee (physician, by phone)**, **Angela, RN (home-health nurse)** — monitors his heart/weight and can explain the home-health nurse role, and **Marisol (his daughter)**. Coordinating from a distance; the nurse handles heart/weight, the PT handles mobility and home-safety. The student just reports what they saw in the home.",
    opening: "**Angela, RN (Home Health):** Hi everyone, thanks for calling in. I want to make sure Frank's set up safely at home. PT, you were just at the house — what are you seeing with his walking and the home itself?",
  },
  {
    id: "school", setting: "School-based", name: "Aisha, age 8",
    settingNote: "You're a PT who works in a school. School-based teams help a child take part in the school day — the focus is function at school, not medical treatment. The team includes teachers, OT, SLP, and sometimes a school counselor.",
    brief: "Aisha is an 8-year-old who uses a walker at school after a long illness affected her strength and balance. You see her as her school PT. The team is meeting to help her get around school and take part in class safely. Her teacher and dad are involved.",
    findings: ["Walks with a walker but struggles in the busy, crowded hallways", "Tires by afternoon and has trouble keeping up between classes", "Can't manage the stairs to the second-floor art room", "Bright and social; wants to keep up with her friends", "Teacher reports she sometimes skips activities she can't physically do", "Your focus: safe mobility around school and full participation in her day"],
    team: "You play **Mr. Dawson (teacher)**, **Priya (OT)** — classroom access/fine motor, **Ms. Cole (school counselor)** — social participation, and **Omar (Aisha's dad)**. Everyone wants Aisha to participate fully; the PT handles mobility/access around the building. Family- and school-centered, jargon-free.",
    opening: "**Mr. Dawson (Teacher):** Thanks for coming, everyone — and welcome, Omar. We want to make sure Aisha can get around and join everything at school. PT, you've been working with her — where are things, and what would help during the day?",
  },
];

function buildSystem(c) {
  return `You are running a friendly interprofessional team meeting to help a BRAND-NEW first-year physical therapy student practice two things: (1) organizing information into an SBAR and communicating it, and (2) learning what other health professions do and how teams differ across settings. The student plays the PHYSICAL THERAPIST. You play everyone else.

SETTING — ${c.setting}: ${c.settingNote}

PATIENT — ${c.name}: ${c.brief}

WHAT THE STUDENT WAS GIVEN (their PT evaluation findings): ${c.findings.join("; ")}.

THE TEAM: ${c.team}

CRITICAL — this student is a beginner in their SECOND TERM. The point is SBAR practice and learning about professions and settings, NOT testing clinical knowledge. So:
- Everything they need is in the case above. NEVER quiz them on clinical facts, prognosis, dosing, how a given setting works, or "what a PT should do" beyond what's given. If they seem unsure, a teammate offers information or reassurance.
- Reward clear communication and good teamwork, not clinical sophistication. Never make the student feel they should know something they haven't learned yet.
- When you speak as another profession, briefly and naturally explain what your role contributes in this setting — they're learning who does what.
- Gently coach SBAR if they leave a part out (warmly ask "and what would you recommend?"). If their first message isn't in SBAR form, nudge, don't criticize.

HOW TO RUN IT:
- Keep every turn SHORT: one or two team members speak, then STOP and wait for the PT. Never speak or decide for the PT.
- Any role overlap should be framed as friendly role-clarification, never conflict.
- Label every speaker in bold, e.g. "**Sam (OT):**". Keep it warm, brisk, and human. Never break character or mention being an AI.
- After roughly 6–8 exchanges, once there's a shared plan, have the facilitator briefly summarize it and thank the team to close.\n\nNOTE: You already opened the meeting with this line (the student has seen it): "${c.opening.replace(/\\*\\*/g, "")}". Continue naturally from the student's messages; do not repeat your opening verbatim.`;
}

function renderSpeakers(text) {
  const parts = text.split(/(\*\*[^*]+:\*\*)/g).filter(Boolean);
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].match(/^\*\*(.+):\*\*$/);
    if (m) { out.push({ speaker: m[1], body: (parts[i + 1] || "").trim() }); i++; }
    else if (parts[i].trim()) out.push({ speaker: null, body: parts[i].trim() });
  }
  return out.length ? out : [{ speaker: null, body: text }];
}

const pickCase = (excludeId) => {
function toApiMessages(history){ const m=[...history]; while(m.length && m[0].role==="assistant") m.shift(); return m; }
  const pool = CASES.filter((c) => c.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
};

export default function IPEHuddle() {
  const [current, setCurrent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fbLoading, setFbLoading] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, loading, feedback, fbLoading]);

  async function callClaude(history, extraSystem) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: buildSystem(current) + (extraSystem || ""),
        messages: toApiMessages(history),
      }),
    });
    const data = await res.json();
    return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  }

  function loadCase(c) {
    setCurrent(c);
    setMessages([{ role: "assistant", content: c.opening }]);
    setFeedback(null); setInput(""); setLoading(false); setFbLoading(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const reply = await callClaude(next);
      setMessages([...next, { role: "assistant", content: reply || "…" }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "**System:** The team connection dropped — try sending that again." }]);
    }
    setLoading(false);
  }

  async function getFeedback() {
    if (fbLoading) return;
    setFbLoading(true); setFeedback(null);
    const ask = [...messages, { role: "user", content:
      "[COACH MODE] Step out of the meeting. As a supportive IPE facilitator for a beginner, give brief, specific, encouraging feedback on MY performance as the PT under the four IPEC competencies: (1) Values/Ethics, (2) Roles/Responsibilities, (3) Interprofessional Communication, (4) Teams & Teamwork. Also say one thing about my SBAR structure. Quote something I actually said as evidence. End with the single most useful thing to try next time. Keep it kind — this is a first-year student." }];
    try {
      const fb = await callClaude(ask, "\n\nWhen the user sends [COACH MODE], drop character and reply only as the coach, in plain prose with clear headings.");
      setFeedback(fb || "No feedback returned.");
    } catch (e) { setFeedback("Couldn't reach the coach just now — try again in a moment."); }
    setFbLoading(false);
  }

  function downloadTranscript() {
    let out = `IPE TEAM MEETING — TRANSCRIPT\nSetting: ${current.setting}\nPatient: ${current.name}\nDate: ${new Date().toLocaleDateString()}\n\n`;
    messages.forEach((m) => {
      if (m.role === "user") out += `YOU (PT): ${m.content}\n\n`;
      else out += m.content.replace(/\*\*/g, "") + "\n\n";
    });
    if (feedback) out += `\n===== COACHING — FOUR IPEC COMPETENCIES =====\n\n${feedback}\n`;
    else out += `\n(Coaching not generated — click "Get coaching" before downloading if your instructor wants it included.)\n`;
    const blob = new Blob([out], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IPE_meeting_${current.name.split(",")[0].replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div style={{ fontFamily: "Calibri, system-ui, sans-serif", color: INK, background: PAPER, minHeight: "100%", padding: 20 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "Cambria, Georgia, serif", color: MAROON, fontSize: 26, margin: "0 6px 0 0" }}>The Team Meeting</h1>
          <span style={{ background: MAROON, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.4 }}>LEVEL 1</span>
          <span style={{ color: GOLD, fontStyle: "italic", fontSize: 15 }}>Level 1 IPE Simulator · practice your SBAR · you are the PT</span>
        </div>
        <div style={{ height: 3, background: GOLD, borderRadius: 2, margin: "8px 0 16px" }} />

        {!current ? (
          <div style={{ textAlign: "center", padding: "6px 0 20px" }}>
            <p style={{ fontSize: 15, color: "#4a5560", maxWidth: 670, margin: "0 auto 18px", lineHeight: 1.55 }}>
              You'll get a patient you're treating, with everything you need already written up. Your job is to <b>read the notes,
              organize them into an SBAR</b>, and share it with the team — then talk it through with the other professionals and reach a plan.
              This is about <b>communicating clearly</b> and <b>learning who's on the team</b> in different settings, not knowing all the answers.
              <br /><br />You'll get a random patient — in an outpatient clinic, a hospital, rehab, home health, or a school — and you can pull a new one anytime.
            </p>
            <button onClick={() => loadCase(pickCase(null))} style={btn(MAROON)}>Start with a random patient</button>
          </div>
        ) : (
          <>
            {/* Case card */}
            <div style={{ background: "#fff", border: "1px solid #E4D6D9", borderLeft: `6px solid ${MAROON}`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: MAROON }}>Your patient — {current.name}</span>
                  <span style={{ background: GOLD, color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.3 }}>{current.setting}</span>
                </div>
                <button onClick={() => loadCase(pickCase(current.id))} style={{ ...btn(GOLD), padding: "6px 12px", fontSize: 13 }}>New patient ↻</button>
              </div>
              <div style={{ fontSize: 12.5, color: "#6b5a5d", fontStyle: "italic", marginTop: 6, lineHeight: 1.45 }}>{current.settingNote}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 8 }}>{current.brief}</div>
              <div style={{ marginTop: 10, background: TINT, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MAROON, letterSpacing: 0.3, marginBottom: 5 }}>WHAT YOUR PT EVALUATION FOUND</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {current.findings.map((f, i) => (<li key={i} style={{ fontSize: 13.5, lineHeight: 1.5, marginBottom: 2 }}>{f}</li>))}
                </ul>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 10, color: MAROON, fontWeight: 600 }}>
                Your job: turn the notes above into an SBAR, share it with the team, and work out a plan together.
              </div>
            </div>

            {/* SBAR reminder */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              {[
                ["S", "Situation", "State what is happening right now, who you are, and the patient's name and location."],
                ["B", "Background", "Give brief, relevant history connected to the current event."],
                ["A", "Assessment", "Share your clinical findings (mobility, range of motion, strength, vitals, etc.) and what you think the problem is."],
                ["R", "Recommendation", "Ask for specific actions, tests, or changes in treatment."],
              ].map(([k, word, desc]) => (
                <div key={k} style={{ flex: "1 1 345px", background: "#fff", border: "1px solid #E4D6D9", borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
                  <div style={{ marginBottom: 2 }}>
                    <span style={{ color: MAROON, fontWeight: 700 }}>{k}</span>
                    <span style={{ fontWeight: 700 }}> · {word}</span>
                  </div>
                  <div style={{ color: "#4a5560", lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Transcript */}
            <div ref={scroller} style={{ background: "#fff", border: "1px solid #E4D6D9", borderRadius: 10, padding: 16, height: 330, overflowY: "auto" }}>
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
                    <div style={{ background: MAROON, color: "#fff", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", maxWidth: "80%", fontSize: 15, lineHeight: 1.5 }}>
                      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>You (PT)</div>{m.content}
                    </div>
                  </div>
                ) : (
                  renderSpeakers(m.content).map((s, j) => (
                    <div key={i + "-" + j} style={{ margin: "10px 0", maxWidth: "88%" }}>
                      {s.speaker && <div style={{ fontWeight: 700, color: GOLD, fontSize: 13.5, marginBottom: 2 }}>{s.speaker}</div>}
                      <div style={{ background: "#F1F4F6", borderRadius: "12px 12px 12px 2px", padding: "8px 12px", fontSize: 15, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{s.body}</div>
                    </div>
                  ))
                )
              )}
              {loading && <div style={{ color: GOLD, fontStyle: "italic", fontSize: 14, margin: "8px 0" }}>the team is responding…</div>}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Speak to the team as the PT…  (Enter to send, Shift+Enter for a new line)"
                rows={2} style={{ flex: 1, resize: "none", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbb8bc", fontFamily: "inherit", fontSize: 15 }} />
              <button onClick={send} disabled={loading || !input.trim()} style={btn(MAROON, loading || !input.trim())}>Send</button>
            </div>

            {/* Coach + download */}
            <div style={{ marginTop: 14, borderTop: "1px dashed #d8c4c8", paddingTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={getFeedback} disabled={fbLoading || userTurns < 2} style={btn(GOLD, fbLoading || userTurns < 2)}>
                {fbLoading ? "Coaching…" : "Get coaching on my communication"}
              </button>
              <button onClick={downloadTranscript} disabled={userTurns < 1} style={{ ...btnOutline(MAROON, userTurns < 1) }}>
                ⭳ Download transcript to submit
              </button>
              {userTurns < 2 && <span style={{ fontSize: 12.5, color: "#7d6b6e" }}>Take a few turns first.</span>}
            </div>
            {feedback && (
              <div style={{ marginTop: 12, background: TINT, border: "1px solid #e2cdd2", borderRadius: 10, padding: "14px 18px", fontSize: 14.5, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                <div style={{ fontWeight: 700, color: MAROON, marginBottom: 6 }}>Coaching — mapped to the four IPEC competencies</div>
                {feedback}
                <div style={{ fontSize: 12.5, color: "#7d6b6e", marginTop: 10 }}>Tip: download your transcript now — it will include this coaching.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function btn(bg, disabled) {
  return { background: disabled ? "#c9b6ba" : bg, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer", fontFamily: "inherit" };
}
function btnOutline(color, disabled) {
  return { background: "#fff", color: disabled ? "#b9a7ab" : color, border: `1.5px solid ${disabled ? "#d8c4c8" : color}`, borderRadius: 8, padding: "9px 16px", fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer", fontFamily: "inherit" };
}
