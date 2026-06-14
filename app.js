const questions = [
  {
    id: "choiceReason",
    trust: true,
    ai: false,
    kicker: "信任资产 01",
    title: "当客户第一次了解贵企业时，是否能在30秒内说清楚：你是谁、做什么、凭什么被选择？",
    action: ["统一“客户为什么选择你”的品牌表达", "把企业定位、业务边界和核心优势整理为内外一致的表达。"],
  },
  {
    id: "positioning",
    trust: true,
    ai: false,
    kicker: "信任资产 02",
    title: "贵企业是否有一句内外一致使用的品牌定位、品类表达或核心价值主张？",
    action: ["明确品牌定位与品类表达", "让官网、PPT、销售话术和对外介绍使用同一套核心价值表达。"],
  },
  {
    id: "productProof",
    trust: true,
    ai: false,
    kicker: "信任资产 03",
    title: "贵企业核心产品或服务，是否已经形成可验证的客户案例、应用场景、成果数据或对比证据？",
    action: ["系统整理客户案例和产品价值证明", "把应用场景、成果数据、客户案例和对比证据整理成可信证据。"],
  },
  {
    id: "endorsement",
    trust: true,
    ai: false,
    kicker: "信任资产 04",
    title: "贵企业的资质、荣誉、专利、媒体报道、行业背书，是否已经整理成可对外使用的信任资产库？",
    action: ["建立信任资产库", "系统整理资质、荣誉、专利、媒体报道和行业背书，方便销售、招商和传播复用。"],
  },
  {
    id: "founderStory",
    trust: true,
    ai: false,
    kicker: "信任资产 05",
    title: "创始人经历、企业关键选择、长期坚持的价值观，是否已经形成正式、可信、可传播的表达？",
    action: ["系统化创始人与企业品牌故事", "把创始人经历、企业关键选择和长期价值观整理为正式可信的品牌故事资产。"],
  },
  {
    id: "contentConsistency",
    trust: true,
    ai: true,
    kicker: "信任资产 / AI可见 06",
    title: "官网、公众号、视频号、PPT、招商资料、销售话术中的企业介绍和优势表达是否一致？",
    action: ["统一官网、PPT、招商资料和销售话术", "让企业介绍和优势表达在所有对外触点保持一致，便于客户理解和AI识别。"],
  },
  {
    id: "searchVisibility",
    trust: false,
    ai: true,
    kicker: "AI可见 07",
    title: "在百度、微信、抖音、视频号等平台搜索企业或品牌名称时，是否能看到最新、权威、正面、完整的信息？",
    action: ["补强官网、媒体和平台公开信息", "让企业名称搜索结果呈现最新、权威、正面、完整的公开信息。"],
  },
  {
    id: "aiUnderstanding",
    trust: false,
    ai: true,
    kicker: "AI可见 08",
    title: "当向AI提问“某某企业是做什么的、有什么优势、适合什么客户”时，AI是否能基本正确地理解和概括贵企业？",
    action: ["补强AI可引用的信息资产", "整理官网、案例、荣誉、产品和FAQ内容，帮助AI准确理解企业业务和优势。"],
  },
];

const optionSet = [
  ["A. 基本没有", "相关信息很少，主要依赖口头解释。", 0],
  ["B. 有一些，但比较分散", "信息存在，但分散在不同材料或人员表达中。", 1],
  ["C. 已经形成材料，但使用不稳定", "已有内容基础，但在官网、媒体、销售和传播中使用不够稳定。", 2],
  ["D. 已经系统沉淀，并在官网、媒体、销售和传播中持续使用", "已经成为企业可复用、可搜索、可引用的信息资产。", 3],
];

const screens = {
  intro: document.querySelector('[data-screen="intro"]'),
  quiz: document.querySelector('[data-screen="quiz"]'),
  result: document.querySelector('[data-screen="result"]'),
};

const state = {
  profile: {
    brandName: "",
    stage: "客户信任",
  },
  index: 0,
  answers: [],
  latestResult: null,
};

const els = {
  profileForm: document.querySelector("#profileForm"),
  brandName: document.querySelector("#brandName"),
  stage: document.querySelector("#stage"),
  backBtn: document.querySelector("#backBtn"),
  progressFill: document.querySelector("#progressFill"),
  stepText: document.querySelector("#stepText"),
  axisText: document.querySelector("#axisText"),
  questionKicker: document.querySelector("#questionKicker"),
  questionTitle: document.querySelector("#questionTitle"),
  options: document.querySelector("#options"),
  restartBtn: document.querySelector("#restartBtn"),
  resultTitle: document.querySelector("#resultTitle"),
  totalScore: document.querySelector("#totalScore"),
  overallScore: document.querySelector("#overallScore"),
  trustScore: document.querySelector("#trustScore"),
  aiScore: document.querySelector("#aiScore"),
  overallMeter: document.querySelector("#overallMeter"),
  trustMeter: document.querySelector("#trustMeter"),
  aiMeter: document.querySelector("#aiMeter"),
  resultSummary: document.querySelector("#resultSummary"),
  lossList: document.querySelector("#lossList"),
  aiScenario: document.querySelector("#aiScenario"),
  actionList: document.querySelector("#actionList"),
  leadForm: document.querySelector("#leadForm"),
  leadName: document.querySelector("#leadName"),
  leadCompany: document.querySelector("#leadCompany"),
  leadRole: document.querySelector("#leadRole"),
  leadContact: document.querySelector("#leadContact"),
  leadIssue: document.querySelector("#leadIssue"),
  consultBox: document.querySelector("#consultBox"),
  consultText: document.querySelector("#consultText"),
  copyBtn: document.querySelector("#copyBtn"),
  returnBtn: document.querySelector("#returnBtn"),
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const question = questions[state.index];
  const progress = ((state.index + 1) / questions.length) * 100;

  els.progressFill.style.width = `${progress}%`;
  els.stepText.textContent = `${state.index + 1} / ${questions.length}`;
  els.axisText.textContent = question.ai && question.trust ? "信任资产 / AI可见" : question.trust ? "信任资产" : "AI可见";
  els.questionKicker.textContent = question.kicker;
  els.questionTitle.textContent = question.title;
  els.backBtn.disabled = state.index === 0;
  els.backBtn.style.opacity = state.index === 0 ? "0.36" : "1";

  els.options.replaceChildren();
  optionSet.forEach(([label, detail, score], optionIndex) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.innerHTML = `<strong>${label}</strong><span>${detail}</span>`;
    button.addEventListener("click", () => answerQuestion(optionIndex, score));
    els.options.appendChild(button);
  });
}

function answerQuestion(optionIndex, score) {
  state.answers[state.index] = {
    questionId: questions[state.index].id,
    axis: questions[state.index].axis,
    optionIndex,
    score,
  };

  if (state.index < questions.length - 1) {
    state.index += 1;
    renderQuestion();
    return;
  }

  renderResult();
}

function calculateResult() {
  const allRaw = state.answers.reduce((sum, answer) => sum + answer.score, 0);
  const trustRaw = questions
    .filter((question) => question.trust)
    .reduce((sum, question) => sum + getAnswerScore(question.id), 0);
  const aiRaw = questions
    .filter((question) => question.ai)
    .reduce((sum, question) => sum + getAnswerScore(question.id), 0);
  const total = Math.round((allRaw / 24) * 100);
  const trust = Math.round((trustRaw / 18) * 100);
  const ai = Math.round((aiRaw / 9) * 100);
  const weakQuestions = questions
    .map((question) => {
      const answer = state.answers.find((item) => item.questionId === question.id);
      return {
        ...question,
        score: answer?.score ?? 0,
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return {
    trust,
    ai,
    total,
    weakQuestions,
    title: getResultTitle(trust, ai, total),
    summary: getResultSummary(trust, ai, total),
  };
}

function getAnswerScore(questionId) {
  return state.answers.find((answer) => answer.questionId === questionId)?.score ?? 0;
}

function getResultTitle(trust, ai, total) {
  if (total >= 80 && trust >= 75 && ai >= 70) return "品牌资产成熟型";
  if (trust >= 65 && ai < 65) return "AI可见资产待系统化型";
  if (trust < 65 && ai >= 65) return "信任资产待补强型";
  return "价值有积累，品牌资产待系统化型";
}

function getResultSummary(trust, ai, total) {
  const brandName = state.profile.brandName || "你的企业";
  const title = getResultTitle(trust, ai, total);
  if (title === "品牌资产成熟型") {
    return `您的企业已经具备较完整的品牌表达、信任证据和公开信息基础。下一步可重点提升品牌资产的持续传播、权威引用和AI语义可见度，让企业价值在客户、渠道、媒体和AI场景中被更稳定地识别。`;
  }
  if (title === "AI可见资产待系统化型") {
    return `贵企业在线下经营、客户合作或行业积累方面已有基础，但官网、媒体、平台内容和AI可引用信息仍不够系统。下一步应把企业优势转化为可搜索、可引用、可被AI理解的公开信息资产。`;
  }
  if (title === "信任资产待补强型") {
    return `贵企业已经有一定线上可见基础，但客户案例、资质荣誉、权威背书、产品价值证明等信任资产还需要进一步系统化。下一步应优先补强“凭什么信任你”的证据体系。`;
  }
  return `${brandName}已经具备一定产品、客户、技术或行业积累，但这些价值还没有充分沉淀为清晰的品牌表达、可信的证据体系和可被搜索、可被AI理解的信息资产。`;
}

function getAiScenario() {
  return "当客户、渠道商或合作伙伴使用AI工具进行行业调研时，公开信息完整、表达统一、案例清晰、权威背书充分的企业，更容易被准确识别和理解。如果企业真实实力很强，但官网、媒体、案例、荣誉和产品信息分散，AI可能无法准确概括企业优势。";
}

function renderResult() {
  const result = calculateResult();
  state.latestResult = result;
  showScreen("result");

  els.resultTitle.textContent = result.title;
  els.totalScore.textContent = result.total;
  els.overallScore.textContent = result.total;
  els.trustScore.textContent = result.trust;
  els.aiScore.textContent = result.ai;
  els.overallMeter.style.width = `${result.total}%`;
  els.trustMeter.style.width = `${result.trust}%`;
  els.aiMeter.style.width = `${result.ai}%`;
  els.resultSummary.textContent = result.summary;
  els.aiScenario.textContent = getAiScenario();

  els.lossList.replaceChildren();
  result.weakQuestions.forEach((question, index) => {
    const item = document.createElement("article");
    item.className = "loss-item";
    item.innerHTML = `
      <span class="loss-tag">方向 ${index + 1}</span>
      <strong>${question.action[0]}</strong>
      <p>${question.action[1]}</p>
    `;
    els.lossList.appendChild(item);
  });

  els.actionList.replaceChildren();
  result.weakQuestions.forEach((question, index) => {
    const item = document.createElement("article");
    item.className = "action-item";
    item.innerHTML = `
      <span class="action-index">${index + 1}</span>
      <div>
        <strong>${question.action[0]}</strong>
        <p>${question.action[1]}</p>
      </div>
    `;
    els.actionList.appendChild(item);
  });
}

function buildConsultText(name = "", contact = "") {
  const result = state.latestResult;
  const brandName = els.leadCompany.value.trim() || state.profile.brandName || "未填写企业";
  const role = els.leadRole.value.trim();
  const issue = els.leadIssue.value;
  const actions = result.weakQuestions.map((question) => question.action[0]).join("、");
  return `企业/品牌：${brandName}｜关注任务：${state.profile.stage}｜诊断结果：${result.title}｜综合品牌资产分：${result.total}｜品牌信任资产：${result.trust}｜AI可见资产：${result.ai}｜优先补强：${actions}｜申请会后人工初筛｜联系人：${name || "未填写"}｜职务：${role || "未填写"}｜联系方式：${contact || "未填写"}｜当前问题：${issue}`;
}

// ========== 飞书相关函数（新增/修复）==========

// 写入飞书多维表格（修复版）
// 修改 writeToFeishu 函数
async function writeToFeishu(record) {
  const res = await fetch('/.netlify/functions/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: record }),
  });
  
  // 先检查 HTTP 状态，避免解析 HTML 错误页面
  if (!res.ok) {
    const text = await res.text();
    console.error('HTTP错误:', res.status, text.substring(0, 200));
    throw new Error(`服务器错误 ${res.status}: ${text.substring(0, 100)}`);
  }
  
  const data = await res.json();
  console.log('【后端响应】', data);
  
  if (!data.success) {
    throw new Error(`提交失败: ${data.error}`);
  }
  return data;
}

// 辅助函数：获取某题答案文本
function getAnswerText(index) {
  const answer = state.answers[index];
  if (!answer) return "未作答";
  const opt = optionSet[answer.optionIndex];
  return opt ? opt[0] : "未知";
}

// ========== 修改后的 saveLead（修复日期格式和类型）==========
function saveLead(name, contact) {
  // 1. 组装本地数据
  const leadData = {
    createdAt: new Date().toLocaleString("zh-CN"),
    name,
    role: els.leadRole.value.trim(),
    contact,
    brandName: els.leadCompany.value.trim() || state.profile.brandName || "未填写企业",
    stage: state.profile.stage,
    issue: els.leadIssue.value,
    resultTitle: state.latestResult.title,
    total: state.latestResult.total,
    trust: state.latestResult.trust,
    ai: state.latestResult.ai,
    actions: state.latestResult.weakQuestions.map((question) => question.action[0]).join(" / "),
  };
  
  // 2. 保存到 localStorage（本地备份）
  const leads = JSON.parse(localStorage.getItem("brandAiDiagnosticLeads") || "[]");
  leads.push(leadData);
  localStorage.setItem("brandAiDiagnosticLeads", JSON.stringify(leads));

  // 3. 组装飞书记录（关键修复：日期用毫秒时间戳，分数用数字）
  const now = new Date();
  const feishuRecord = {
    "提交时间": now.getTime(),  // ← 修复：13位毫秒时间戳
    "企业/品牌名称": leadData.brandName,
    "关注项": leadData.stage,
    "姓名": leadData.name,
    "企业名称（留资）": els.leadCompany.value.trim(),
    "职务": leadData.role,
    "微信或手机号": leadData.contact,
    "当前最想解决的品牌问题": leadData.issue,
    "综合品牌资产分": Number(leadData.total),  // ← 修复：确保是数字
    "品牌信任资产分": Number(leadData.trust),   // ← 修复：确保是数字
    "AI可见资产分": Number(leadData.ai),         // ← 修复：确保是数字
    "诊断类型": leadData.resultTitle,
    "优先补强方向": leadData.actions,
    "Q1答案": getAnswerText(0),
    "Q2答案": getAnswerText(1),
    "Q3答案": getAnswerText(2),
    "Q4答案": getAnswerText(3),
    "Q5答案": getAnswerText(4),
    "Q6答案": getAnswerText(5),
    "Q7答案": getAnswerText(6),
    "Q8答案": getAnswerText(7),
    "跟进状态": "待联系",
    "备注": "",
  };

  // 4. 提交到飞书（增加错误处理）
  writeToFeishu(feishuRecord).then((res) => {
    console.log("✅ 飞书提交成功:", res);
  }).catch((err) => {
    console.error("❌ 飞书提交失败:", err);
    // 失败时给用户提示（可选）
    // alert("提交暂未同步到后台，请稍后重试或联系工作人员");
  });
}

function downloadLeads() {
  const leads = JSON.parse(localStorage.getItem("brandAiDiagnosticLeads") || "[]");
  const headers = ["时间", "姓名", "职务", "联系方式", "企业/品牌", "关注任务", "当前问题", "结果", "综合品牌资产分", "品牌信任资产", "AI可见资产", "优先补强"];
  const rows = leads.map((lead) => [
    lead.createdAt,
    lead.name,
    lead.role,
    lead.contact,
    lead.brandName,
    lead.stage,
    lead.issue,
    lead.resultTitle,
    lead.total,
    lead.trust,
    lead.ai,
    lead.actions,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "brand-ai-diagnostic-leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

els.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.profile.brandName = els.brandName.value.trim();
  state.profile.stage = els.stage.value;
  els.leadCompany.value = state.profile.brandName;
  state.index = 0;
  state.answers = [];
  renderQuestion();
  showScreen("quiz");
});

els.backBtn.addEventListener("click", () => {
  if (state.index === 0) return;
  state.index -= 1;
  renderQuestion();
});

els.restartBtn.addEventListener("click", () => {
  state.index = 0;
  state.answers = [];
  els.leadForm.hidden = false;
  els.consultBox.hidden = true;
  showScreen("intro");
});

els.leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = els.leadName.value.trim();
  const contact = els.leadContact.value.trim();
  
  if (!name || !contact) {
    alert("请填写姓名和联系方式");
    return;
  }

  saveLead(name, contact);
  
  els.consultText.textContent = buildConsultText(name, contact);
  els.leadForm.hidden = true;
  els.consultBox.hidden = false;
});

els.copyBtn.addEventListener("click", async () => {
  const text = els.consultText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.textContent = "已复制";
    setTimeout(() => {
      els.copyBtn.textContent = "复制摘要";
    }, 1200);
  } catch {
    els.copyBtn.textContent = "可手动复制";
  }
});

els.returnBtn.addEventListener("click", () => {
  els.consultBox.hidden = true;
  els.leadForm.hidden = false;
  document.querySelector(".screen-result").scrollIntoView({ behavior: "smooth", block: "start" });
});
