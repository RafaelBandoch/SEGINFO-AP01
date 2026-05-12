const CREDENTIALS = {
  "aluno@faculdade.local":     "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "professor@faculdade.local": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "admin@faculdade.local":     "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
};
 
const USERS = [
  { id: 1, name: "Ana Souza",           email: "aluno@faculdade.local",     role: "ALUNO",     studentId: "202400001" },
  { id: 2, name: "Prof. Carlos Lima",   email: "professor@faculdade.local", role: "PROFESSOR", classes: ["5A", "5B"] },
  { id: 3, name: "Administrador Geral", email: "admin@faculdade.local",     role: "ADMIN" }
];
 
const STORAGE_KEYS = {
  session:     "ocorrencias_sessao",
  occurrences: "ocorrencias_registros",
  audit:       "ocorrencias_logs"
};
 
const loginAttempts = {};
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 60_000;
 
const INITIAL_OCCURRENCES = [
  {
    id: "OC-1001",
    studentName:  "Marina Alves",
    studentId:    "202300145",
    studentCpf:   "123.456.789-10",
    studentEmail: "marina.alves@email.local",
    studentPhone: "(47) 99999-1010",
    category:     "Nota",
    priority:     "Média",
    description:  "Solicitação de revisão de nota da avaliação bimestral.",
    internalNote: "Verificar com a coordenação antes de responder.",
    status:       "Aberta",
    createdBy:    "professor@faculdade.local",
    createdAt:    "2026-05-05T18:40:00.000Z"
  },
  {
    id: "OC-1002",
    studentName:  "Rafael Martins",
    studentId:    "202200771",
    studentCpf:   "987.654.321-00",
    studentEmail: "rafael.martins@email.local",
    studentPhone: "(47) 98888-2020",
    category:     "Frequência",
    priority:     "Alta",
    description:  "Aluno contesta lançamento de falta em aula prática.",
    internalNote: "Conferir chamada manual.",
    status:       "Em análise",
    createdBy:    "professor@faculdade.local",
    createdAt:    "2026-05-05T18:50:00.000Z"
  },
  {
    id: "OC-1003",
    studentName:  "Beatriz Costa",
    studentId:    "202100441",
    studentCpf:   "111.222.333-44",
    studentEmail: "beatriz.costa@email.local",
    studentPhone: "(47) 97777-3030",
    category:     "Solicitação administrativa",
    priority:     "Crítica",
    description:  "Solicitação envolvendo documentação acadêmica e prazo de matrícula.",
    internalNote: "Priorizar atendimento.",
    status:       "Aberta",
    createdBy:    "admin@faculdade.local",
    createdAt:    "2026-05-05T19:00:00.000Z"
  }
];
 
const loginView      = document.querySelector("#loginView");
const appView        = document.querySelector("#appView");
const loginForm      = document.querySelector("#loginForm");
const occurrenceForm = document.querySelector("#occurrenceForm");
const logoutBtn      = document.querySelector("#logoutBtn");
const exportBtn      = document.querySelector("#exportBtn");
const clearLogsBtn   = document.querySelector("#clearLogsBtn");
const resetBtn       = document.querySelector("#resetBtn");
const searchInput    = document.querySelector("#search");
const roleSelect     = document.querySelector("#roleSelect");
 
const sessionBadge       = document.querySelector("#sessionBadge");
const currentUserName    = document.querySelector("#currentUserName");
const currentUserDetails = document.querySelector("#currentUserDetails");
const occurrencesTable   = document.querySelector("#occurrencesTable");
const auditLog           = document.querySelector("#auditLog");
const totalOccurrences   = document.querySelector("#totalOccurrences");
const criticalOccurrences = document.querySelector("#criticalOccurrences");
const lastUpdate         = document.querySelector("#lastUpdate");
 
function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, tag => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[tag] || tag));
}
 
async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer  = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
 
function generateId() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `OC-${ts}-${rnd}`;
}
 
function getOccurrences() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.occurrences) || "[]");
}
 
function saveOccurrences(occurrences) {
  localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(occurrences));
}
 
function getAuditLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.audit) || "[]");
}
 
function saveAuditLogs(logs) {
  localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify(logs));
}
 
function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");
}
 
function saveSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}
 
function writeLog(action, detail) {
  const session = getSession();
  const logs    = getAuditLogs();
 
  logs.unshift({
    when:   new Date().toISOString(),
    user:   session ? session.email : "anonimo",
    role:   session ? session.role  : "SEM_SESSAO",
    action,
    detail
  });
 
  saveAuditLogs(logs);
}
 
function showLogin() {
  loginView.classList.remove("hidden");
  appView.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  sessionBadge.textContent = "Sessão não iniciada";
  sessionBadge.classList.add("muted");
}
 
function showApp(user) {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
 
  sessionBadge.textContent = `${user.name} — ${user.role}`;
  sessionBadge.classList.remove("muted");
 
  currentUserName.textContent    = user.name;
  currentUserDetails.textContent = `${user.email} | Perfil: ${user.role}`;
  roleSelect.value               = user.role;
 
  const adminOnlyElements = [exportBtn, clearLogsBtn, resetBtn, roleSelect.closest(".role-switch")];
  if (user.role !== "ADMIN") {
    adminOnlyElements.forEach(el => el && el.classList.add("hidden"));
  } else {
    adminOnlyElements.forEach(el => el && el.classList.remove("hidden"));
  }
 
  const auditSection = document.querySelector("#auditSection");
  if (auditSection) auditSection.classList.remove("hidden");
 
  const searchNotice = document.querySelector("#searchNotice");
  if (searchNotice) {
    searchNotice.textContent = user.role === "ALUNO"
      ? "A busca percorre apenas os seus próprios registros."
      : "A busca percorre todos os registros cadastrados na base.";
  }
 
  render();
}
 
async function login(email, password) {
  const attempt = loginAttempts[email] || { count: 0, lastAttempt: 0 };
  const now     = Date.now();
 
  if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < LOCKOUT_MS) {
    const remaining = Math.ceil((LOCKOUT_MS - (now - attempt.lastAttempt)) / 1000);
    alert(`Muitas tentativas incorretas. Aguarde ${remaining} segundo(s) e tente novamente.`);
    return;
  }
 
  const hash         = await hashPassword(password);
  const expectedHash = CREDENTIALS[email];
 
  if (!expectedHash || hash !== expectedHash) {
    attempt.count++;
    attempt.lastAttempt = now;
    loginAttempts[email] = attempt;
 
    const restantes = MAX_ATTEMPTS - attempt.count;
    writeLog("LOGIN_FALHOU", `Tentativa inválida detectada. Tentativas restantes: ${restantes >= 0 ? restantes : 0}.`);
    alert(`Usuário ou senha inválidos.${restantes > 0 ? ` Tentativas restantes: ${restantes}.` : " Conta temporariamente bloqueada."}`);
    return;
  }
 
  delete loginAttempts[email];
 
  const user = USERS.find(u => u.email === email);
  saveSession({ ...user });
  writeLog("LOGIN_OK", `Sessão iniciada com sucesso.`);
  showApp(user);
}
 
function logout() {
  writeLog("LOGOUT", "Sessão encerrada pelo usuário.");
  localStorage.removeItem(STORAGE_KEYS.session);
  showLogin();
}
 
function changeRole(newRole) {
  const session = getSession();
 
  if (!session || session.role !== "ADMIN") {
    writeLog("TENTATIVA_TROCA_PAPEL_NEGADA", "Tentativa não autorizada de alteração de perfil.");
    alert("Erro de Segurança: Apenas Administradores podem alterar perfis.");
    return;
  }
 
  session.role = newRole;
  saveSession(session);
  writeLog("PERFIL_ALTERADO", `Perfil ativo alterado para ${newRole}.`);
  showApp(session);
}
 
function validateOccurrenceForm() {
  const name    = document.querySelector("#studentName").value.trim();
  const id      = document.querySelector("#studentId").value.trim();
  const cpf     = document.querySelector("#studentCpf").value.trim();
  const email   = document.querySelector("#studentEmail").value.trim();
  const desc    = document.querySelector("#description").value.trim();
  const privacy = document.querySelector("#privacyAck").checked;
 
  if (!name)    { alert("Informe o nome do aluno.");                          return false; }
  if (!id)      { alert("Informe a matrícula.");                              return false; }
  if (!cpf)     { alert("Informe o CPF.");                                    return false; }
  if (!email)   { alert("Informe o e-mail pessoal.");                         return false; }
  if (!desc)    { alert("Informe a descrição da ocorrência.");                return false; }
  if (!privacy) { alert("Você deve confirmar que pode registrar estes dados."); return false; }
 
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Formato de e-mail inválido.");
    return false;
  }
 
  return true;
}
 
function createOccurrence(event) {
  event.preventDefault();
 
  if (!validateOccurrenceForm()) return;
 
  const session = getSession();
 
  const occurrence = {
    id:           generateId(),
    studentName:  document.querySelector("#studentName").value.trim(),
    studentId:    document.querySelector("#studentId").value.trim(),
    studentCpf:   document.querySelector("#studentCpf").value.trim(),
    studentEmail: document.querySelector("#studentEmail").value.trim(),
    studentPhone: document.querySelector("#studentPhone").value.trim(),
    category:     document.querySelector("#category").value,
    priority:     document.querySelector("#priority").value,
    description:  document.querySelector("#description").value.trim(),
    internalNote: document.querySelector("#internalNote").value.trim(),
    privacyAck:   true,
    status:       "Aberta",
    createdBy:    session ? session.email : "desconhecido",
    createdAt:    new Date().toISOString()
  };
 
  const occurrences = getOccurrences();
  occurrences.unshift(occurrence);
  saveOccurrences(occurrences);
 
  writeLog(
    "OCORRENCIA_CRIADA",
    `Ocorrência ${occurrence.id} registrada para matrícula ${occurrence.studentId} — categoria: ${occurrence.category}.`
  );
 
  occurrenceForm.reset();
  render();
}
 
function deleteOccurrence(id) {
  const session = getSession();
 
  if (!session || session.role !== "ADMIN") {
    alert("Erro de Segurança: Apenas Administradores podem excluir ocorrências.");
    writeLog("TENTATIVA_EXCLUSAO_NEGADA", `Tentativa negada — ocorrência ${escapeHTML(id)}.`);
    return;
  }
 
  if (!confirm(`Atenção: Tem certeza que deseja excluir a ocorrência ${id}?\nEsta ação não pode ser desfeita.`)) {
    return;
  }
 
  const occurrences = getOccurrences();
  const updated     = occurrences.filter(item => item.id !== id);
 
  saveOccurrences(updated);
  writeLog("OCORRENCIA_EXCLUIDA", `Ocorrência ${id} excluída pelo administrador.`);
  render();
}
 
function changeStatus(id, status) {
  const session = getSession();
 
  if (!session || (session.role !== "ADMIN" && session.role !== "PROFESSOR")) {
    alert("Erro de Segurança: Apenas Professores ou Administradores podem alterar o status.");
    writeLog("TENTATIVA_ALTERACAO_STATUS_NEGADA", `Tentativa negada — ocorrência ${escapeHTML(id)}.`);
    return;
  }
 
  const occurrences = getOccurrences();
  const occurrence  = occurrences.find(item => item.id === id);
 
  if (!occurrence) return;
 
  occurrence.status    = status;
  occurrence.updatedAt = new Date().toISOString();
 
  saveOccurrences(occurrences);
  writeLog("STATUS_ALTERADO", `Ocorrência ${id} alterada para "${status}".`);
  render();
}
 
function exportEverything() {
  const session = getSession();
 
  if (!session || session.role !== "ADMIN") {
    alert("Erro de Segurança: Apenas Administradores podem exportar dados.");
    return;
  }
 
  const payload = {
    exportedAt:  new Date().toISOString(),
    exportedBy:  session.email,
    occurrences: getOccurrences(),
    audit:       getAuditLogs()
  };
 
  const blob   = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url    = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
 
  anchor.href     = url;
  anchor.download = "backup-ocorrencias.json";
  anchor.click();
 
  URL.revokeObjectURL(url);
  writeLog("EXPORTACAO_TOTAL", "Exportação de dados realizada pelo administrador.");
}
 
function clearLogs() {
  const session = getSession();
 
  if (!session || session.role !== "ADMIN") {
    alert("Erro de Segurança: Apenas Administradores podem limpar logs.");
    return;
  }
 
  saveAuditLogs([]);
  render();
}
 
function resetData() {
  const session = getSession();
 
  if (!session || session.role !== "ADMIN") {
    alert("Erro de Segurança: Apenas Administradores podem restaurar dados.");
    writeLog("TENTATIVA_RESET_NEGADA", "Tentativa de reset não autorizada.");
    return;
  }
 
  if (!confirm("Atenção: Todos os dados serão restaurados para o estado inicial. Confirmar?")) return;
 
  localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(INITIAL_OCCURRENCES));
  localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEYS.session);
  boot();
}
 
function render() {
  const term    = searchInput.value.toLowerCase();
  const session = getSession();
  let baseOccurrences = getOccurrences();
 
  if (session && session.role === "ALUNO") {
    baseOccurrences = baseOccurrences.filter(item => item.studentId === session.studentId);
  }
 
  const filtered = baseOccurrences.filter(item => {
    const content = JSON.stringify(item).toLowerCase();
    return content.includes(term);
  });
 
  totalOccurrences.textContent   = baseOccurrences.length;
  criticalOccurrences.textContent = baseOccurrences.filter(i => i.priority === "Crítica").length;
  lastUpdate.textContent         = `Atualizado em ${new Date().toLocaleTimeString("pt-BR")}`;
 
  occurrencesTable.innerHTML = filtered.map(item => `
    <tr>
      <td>
        <strong>${escapeHTML(item.studentName)}</strong><br />
        <span class="muted-text">${escapeHTML(item.studentId)}</span>
      </td>
      <td>${escapeHTML(item.studentCpf)}</td>
      <td>
        ${escapeHTML(item.studentEmail)}<br />
        ${escapeHTML(item.studentPhone)}
      </td>
      <td>${escapeHTML(item.category)}</td>
      <td><span class="priority ${escapeHTML(item.priority)}">${escapeHTML(item.priority)}</span></td>
      <td>${escapeHTML(item.status)}</td>
      <td>
        <strong>Descrição:</strong> ${escapeHTML(item.description)}<br />
        <strong>Obs. interna:</strong> ${
          session && session.role !== "ALUNO"
            ? escapeHTML(item.internalNote)
            : "<em>Acesso restrito</em>"
        }
      </td>
      <td>
        <div class="row-actions">
          ${session && session.role !== "ALUNO" ? `
            <button class="btn secondary"
              data-action="changeStatus"
              data-id="${escapeHTML(item.id)}"
              data-status="Em análise">Em análise</button>
            <button class="btn secondary"
              data-action="changeStatus"
              data-id="${escapeHTML(item.id)}"
              data-status="Resolvida">Resolver</button>
          ` : ""}
          ${session && session.role === "ADMIN" ? `
            <button class="btn danger"
              data-action="deleteOccurrence"
              data-id="${escapeHTML(item.id)}">Excluir</button>
          ` : ""}
        </div>
      </td>
    </tr>
  `).join("");
 
  let logs = getAuditLogs();
 
  if (session && session.role !== "ADMIN") {
    logs = logs.filter(log => log.user === session.email);
  }
 
  if (logs.length === 0) {
    auditLog.innerHTML = `<div class="notice">Nenhum log registrado.</div>`;
  } else {
    auditLog.innerHTML = logs.map(log => `
      <div class="log-item">
        <strong>${escapeHTML(log.when)}</strong><br />
        usuário=${escapeHTML(log.user || "—")} | perfil=${escapeHTML(log.role || "—")} | ação=${escapeHTML(log.action)}<br />
        detalhe=${escapeHTML(log.detail)}
      </div>
    `).join("");
  }
}
 
loginForm.addEventListener("submit", event => {
  event.preventDefault();
  login(
    document.querySelector("#email").value.trim(),
    document.querySelector("#password").value
  );
});
 
occurrenceForm.addEventListener("submit", createOccurrence);
logoutBtn.addEventListener("click", logout);
exportBtn.addEventListener("click", exportEverything);
clearLogsBtn.addEventListener("click", clearLogs);
resetBtn.addEventListener("click", resetData);
searchInput.addEventListener("input", render);
roleSelect.addEventListener("change", event => changeRole(event.target.value));
 
occurrencesTable.addEventListener("click", event => {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
 
  const action = btn.dataset.action;
  const id     = btn.dataset.id;
 
  if (action === "changeStatus") {
    changeStatus(id, btn.dataset.status);
  } else if (action === "deleteOccurrence") {
    deleteOccurrence(id);
  }
});
 
const studentCpfInput   = document.querySelector("#studentCpf");
const studentPhoneInput = document.querySelector("#studentPhone");
 
if (studentCpfInput) {
  studentCpfInput.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    e.target.value = v;
  });
}
 
if (studentPhoneInput) {
  studentPhoneInput.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10)     v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,4})/, "($1) $2");
    else if (v.length > 0) v = v.replace(/(\d{1,2})/, "($1");
    e.target.value = v;
  });
}
 
function boot() {
  if (!localStorage.getItem(STORAGE_KEYS.occurrences)) {
    localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(INITIAL_OCCURRENCES));
  }
 
  if (!localStorage.getItem(STORAGE_KEYS.audit)) {
    localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify([{
      when:   new Date().toISOString(),
      user:   "sistema",
      action: "BASE_INICIAL_CRIADA",
      detail: "Dados fictícios carregados no localStorage."
    }]));
  }
 
  const session = getSession();
  if (session) showApp(session);
  else         showLogin();
}
 
boot();