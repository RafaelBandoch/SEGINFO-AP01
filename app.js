const USERS = [
  {
    id: 1,
    name: "Ana Souza",
    email: "aluno@faculdade.local",
    password: "123456",
    role: "ALUNO",
    studentId: "202400001"
  },
  {
    id: 2,
    name: "Prof. Carlos Lima",
    email: "professor@faculdade.local",
    password: "123456",
    role: "PROFESSOR",
    classes: ["5A", "5B"]
  },
  {
    id: 3,
    name: "Administrador Geral",
    email: "admin@faculdade.local",
    password: "admin",
    role: "ADMIN"
  }
];

const FAKE_API_TOKEN = "TOKEN_SECRETO_DEMO_ABC123_PUBLICO_NO_FRONTEND";

const STORAGE_KEYS = {
  session: "ocorrencias_sessao",
  occurrences: "ocorrencias_registros",
  audit: "ocorrencias_logs"
};

const INITIAL_OCCURRENCES = [
  {
    id: "OC-1001",
    studentName: "Marina Alves",
    studentId: "202300145",
    studentCpf: "123.456.789-10",
    studentEmail: "marina.alves@email.local",
    studentPhone: "(47) 99999-1010",
    category: "Nota",
    priority: "Média",
    description: "Solicitação de revisão de nota da avaliação bimestral.",
    internalNote: "Verificar com a coordenação antes de responder.",
    status: "Aberta",
    createdBy: "professor@faculdade.local",
    createdAt: "2026-05-05T18:40:00.000Z"
  },
  {
    id: "OC-1002",
    studentName: "Rafael Martins",
    studentId: "202200771",
    studentCpf: "987.654.321-00",
    studentEmail: "rafael.martins@email.local",
    studentPhone: "(47) 98888-2020",
    category: "Frequência",
    priority: "Alta",
    description: "Aluno contesta lançamento de falta em aula prática.",
    internalNote: "Conferir chamada manual.",
    status: "Em análise",
    createdBy: "professor@faculdade.local",
    createdAt: "2026-05-05T18:50:00.000Z"
  },
  {
    id: "OC-1003",
    studentName: "Beatriz Costa",
    studentId: "202100441",
    studentCpf: "111.222.333-44",
    studentEmail: "beatriz.costa@email.local",
    studentPhone: "(47) 97777-3030",
    category: "Solicitação administrativa",
    priority: "Crítica",
    description: "Solicitação envolvendo documentação acadêmica e prazo de matrícula.",
    internalNote: "Priorizar atendimento.",
    status: "Aberta",
    createdBy: "admin@faculdade.local",
    createdAt: "2026-05-05T19:00:00.000Z"
  }
];

const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const occurrenceForm = document.querySelector("#occurrenceForm");
const logoutBtn = document.querySelector("#logoutBtn");
const exportBtn = document.querySelector("#exportBtn");
const clearLogsBtn = document.querySelector("#clearLogsBtn");
const resetBtn = document.querySelector("#resetBtn");
const searchInput = document.querySelector("#search");
const roleSelect = document.querySelector("#roleSelect");

const sessionBadge = document.querySelector("#sessionBadge");
const currentUserName = document.querySelector("#currentUserName");
const currentUserDetails = document.querySelector("#currentUserDetails");
const occurrencesTable = document.querySelector("#occurrencesTable");
const auditLog = document.querySelector("#auditLog");
const totalOccurrences = document.querySelector("#totalOccurrences");
const criticalOccurrences = document.querySelector("#criticalOccurrences");
const lastUpdate = document.querySelector("#lastUpdate");

function boot() {
  if (!localStorage.getItem(STORAGE_KEYS.occurrences)) {
    localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(INITIAL_OCCURRENCES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.audit)) {
    localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify([
      {
        when: new Date().toISOString(),
        user: "sistema",
        action: "BASE_INICIAL_CRIADA",
        detail: "Dados fictícios carregados no localStorage."
      }
    ]));
  }

  const session = getSession();

  if (session) {
    showApp(session);
  } else {
    showLogin();
  }
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
  const logs = getAuditLogs();

  logs.unshift({
    when: new Date().toISOString(),
    user: session ? session.email : "anonimo",
    role: session ? session.role : "SEM_SESSAO",
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

  currentUserName.textContent = user.name;
  currentUserDetails.textContent = `${user.email} | Perfil: ${user.role}`;
  roleSelect.value = user.role;

  render();
}

function login(email, password) {
  const user = USERS.find((item) => item.email === email && item.password === password);

  if (!user) {
    alert("Usuário ou senha inválidos.");
    writeLog("LOGIN_FALHOU", `Tentativa para ${email}`);
    return;
  }

  saveSession(user);
  writeLog("LOGIN_OK", `Usuário ${user.email} entrou no sistema.`);
  showApp(user);
}

function logout() {
  const session = getSession();
  writeLog("LOGOUT", session ? `${session.email} saiu do sistema.` : "Sessão encerrada.");
  localStorage.removeItem(STORAGE_KEYS.session);
  showLogin();
}

function changeRole(newRole) {
  const session = getSession();

  if (!session) {
    return;
  }

  session.role = newRole;
  saveSession(session);
  writeLog("PERFIL_ALTERADO", `Perfil ativo alterado manualmente para ${newRole}.`);
  showApp(session);
}

function createOccurrence(event) {
  event.preventDefault();

  const session = getSession();

  const occurrence = {
    id: `OC-${Math.floor(Math.random() * 9000) + 1000}`,
    studentName: document.querySelector("#studentName").value,
    studentId: document.querySelector("#studentId").value,
    studentCpf: document.querySelector("#studentCpf").value,
    studentEmail: document.querySelector("#studentEmail").value,
    studentPhone: document.querySelector("#studentPhone").value,
    category: document.querySelector("#category").value,
    priority: document.querySelector("#priority").value,
    description: document.querySelector("#description").value,
    internalNote: document.querySelector("#internalNote").value,
    privacyAck: document.querySelector("#privacyAck").checked,
    status: "Aberta",
    createdBy: session ? session.email : "desconhecido",
    createdAt: new Date().toISOString()
  };

  const occurrences = getOccurrences();
  occurrences.unshift(occurrence);
  saveOccurrences(occurrences);

  writeLog(
    "OCORRENCIA_CRIADA",
    `Criada ocorrência ${occurrence.id} para ${occurrence.studentName} / ${occurrence.studentCpf}. Descrição: ${occurrence.description}`
  );

  occurrenceForm.reset();
  render();
}

function deleteOccurrence(id) {
  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === id);
  const updated = occurrences.filter((item) => item.id !== id);

  saveOccurrences(updated);
  writeLog("OCORRENCIA_EXCLUIDA", `Ocorrência ${id} excluída. Registro: ${JSON.stringify(occurrence)}`);
  render();
}

function changeStatus(id, status) {
  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === id);

  if (!occurrence) {
    return;
  }

  occurrence.status = status;
  occurrence.updatedAt = new Date().toISOString();

  saveOccurrences(occurrences);
  writeLog("STATUS_ALTERADO", `Ocorrência ${id} alterada para ${status}.`);
  render();
}

function exportEverything() {
  const payload = {
    exportedAt: new Date().toISOString(),
    exportedBy: getSession(),
    token: FAKE_API_TOKEN,
    users: USERS,
    occurrences: getOccurrences(),
    audit: getAuditLogs(),
    localStorageCopy: { ...localStorage }
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "backup-completo-ocorrencias.json";
  anchor.click();

  URL.revokeObjectURL(url);

  writeLog("EXPORTACAO_TOTAL", "Usuário exportou todos os dados do sistema.");
}

function clearLogs() {
  saveAuditLogs([]);
  render();
}

function resetData() {
  localStorage.setItem(STORAGE_KEYS.occurrences, JSON.stringify(INITIAL_OCCURRENCES));
  localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEYS.session);
  boot();
}

function render() {
  const term = searchInput.value.toLowerCase();
  const occurrences = getOccurrences();

  const filtered = occurrences.filter((item) => {
    const content = JSON.stringify(item).toLowerCase();
    return content.includes(term);
  });

  totalOccurrences.textContent = occurrences.length;
  criticalOccurrences.textContent = occurrences.filter((item) => item.priority === "Crítica").length;
  lastUpdate.textContent = `Atualizado em ${new Date().toLocaleTimeString("pt-BR")}`;

  occurrencesTable.innerHTML = filtered.map((item) => `
    <tr>
      <td>
        <strong>${item.studentName}</strong><br />
        <span class="muted-text">${item.studentId}</span>
      </td>
      <td>${item.studentCpf}</td>
      <td>
        ${item.studentEmail}<br />
        ${item.studentPhone}
      </td>
      <td>${item.category}</td>
      <td><span class="priority ${item.priority}">${item.priority}</span></td>
      <td>${item.status}</td>
      <td>
        <strong>Descrição:</strong> ${item.description}<br />
        <strong>Obs. interna:</strong> ${item.internalNote}
      </td>
      <td>
        <div class="row-actions">
          <button class="btn secondary" onclick="changeStatus('${item.id}', 'Em análise')">Em análise</button>
          <button class="btn secondary" onclick="changeStatus('${item.id}', 'Resolvida')">Resolver</button>
          <button class="btn danger" onclick="deleteOccurrence('${item.id}')">Excluir</button>
        </div>
      </td>
    </tr>
  `).join("");

  const logs = getAuditLogs();

  if (logs.length === 0) {
    auditLog.innerHTML = `<div class="notice">Nenhum log registrado.</div>`;
  } else {
    auditLog.innerHTML = logs.map((log) => `
      <div class="log-item">
        <strong>${log.when}</strong><br />
        usuário=${log.user || "—"} | perfil=${log.role || "—"} | ação=${log.action}<br />
        detalhe=${log.detail}
      </div>
    `).join("");
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  login(
    document.querySelector("#email").value,
    document.querySelector("#password").value
  );
});

occurrenceForm.addEventListener("submit", createOccurrence);
logoutBtn.addEventListener("click", logout);
exportBtn.addEventListener("click", exportEverything);
clearLogsBtn.addEventListener("click", clearLogs);
resetBtn.addEventListener("click", resetData);
searchInput.addEventListener("input", render);
roleSelect.addEventListener("change", (event) => changeRole(event.target.value));

window.deleteOccurrence = deleteOccurrence;
window.changeStatus = changeStatus;

boot();
