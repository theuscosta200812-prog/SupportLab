
const tickets = [
  {
    id: 1001,
    subject: "Pedido ainda não chegou",
    customer: "Mariana Costa",
    priority: "Alta",
    status: "Aberto",
    category: "Entrega"
  },
  {
    id: 1002,
    subject: "Solicitação de reembolso",
    customer: "Pedro Almeida",
    priority: "Média",
    status: "Em andamento",
    category: "Pagamento"
  },
  {
    id: 1003,
    subject: "Dúvida sobre troca de produto",
    customer: "Ana Martins",
    priority: "Baixa",
    status: "Resolvido",
    category: "Trocas"
  }
];

const customers = [
  { name: "Mariana Costa", email: "mariana@example.com", tickets: 2 },
  { name: "Pedro Almeida", email: "pedro@example.com", tickets: 1 },
  { name: "Ana Martins", email: "ana@example.com", tickets: 3 }
];

const articles = [
  {
    title: "Como consultar um pedido",
    category: "Pedidos",
    body: "Confirme o número do pedido e consulte o status da entrega."
  },
  {
    title: "Como processar um reembolso",
    category: "Pagamentos",
    body: "Verifique a elegibilidade do pedido e explique os próximos passos ao cliente."
  },
  {
    title: "Como orientar uma troca",
    category: "Trocas",
    body: "Confirme o prazo de troca, as condições do produto e o procedimento aplicável."
  }
];

const scenarios = [
  {
    title: "Cliente irritado com atraso",
    level: "Intermediário",
    situation: "O cliente informa que a encomenda está atrasada e exige uma solução imediata.",
    task: "Escreva uma resposta empática, reconheça o problema e explique o próximo passo."
  },
  {
    title: "Pedido de reembolso",
    level: "Iniciante",
    situation: "O cliente quer receber o dinheiro de volta, mas você ainda precisa verificar o pedido.",
    task: "Explique como você verificaria a solicitação sem prometer algo antes da confirmação."
  },
  {
    title: "Dúvida sobre troca",
    level: "Iniciante",
    situation: "O cliente recebeu um produto e quer saber se pode trocá-lo.",
    task: "Faça perguntas relevantes e oriente o cliente com clareza."
  }
];

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("supportlab-tickets") || "null");
  } catch {
    return null;
  }
})();

let currentTickets = Array.isArray(saved) ? saved : [...tickets];

const content = document.getElementById("app-content");
const pageTitle = document.getElementById("page-title");

function saveTickets() {
  try {
    localStorage.setItem("supportlab-tickets", JSON.stringify(currentTickets));
  } catch (error) {
    console.warn("Não foi possível salvar os tickets neste navegador.", error);
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderDashboard() {
  const open = currentTickets.filter(ticket => ticket.status !== "Resolvido");
  const high = open.filter(ticket => ticket.priority === "Alta");
  const resolved = currentTickets.filter(ticket => ticket.status === "Resolvido");

  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">CENTRAL DE ATENDIMENTO</p>
        <h2>Bem-vindo ao SupportLab!</h2>
        <p>Pratique atendimento ao cliente em um ambiente de simulação.</p>
      </div>
      <button class="primary-btn" id="new-ticket-btn">+ Novo ticket</button>
    </div>

    <div class="metrics-grid">
      <div class="metric-card"><p>Tickets abertos</p><h2>${open.length}</h2></div>
      <div class="metric-card"><p>Prioridade alta</p><h2>${high.length}</h2></div>
      <div class="metric-card"><p>Tickets resolvidos</p><h2>${resolved.length}</h2></div>
      <div class="metric-card"><p>Clientes cadastrados</p><h2>${customers.length}</h2></div>
    </div>

    <div class="content-grid">
      <section class="panel">
        <div class="panel-heading">
          <h3>Tickets recentes</h3>
          <button class="text-btn" data-page="tickets">Ver todos</button>
        </div>
        <div id="recent-tickets">
          ${currentTickets.slice(0, 5).map(ticket => `
            <div class="ticket-row">
              <strong>#${ticket.id} — ${escapeHTML(ticket.subject)}</strong>
              <p>${escapeHTML(ticket.customer)} · ${escapeHTML(ticket.status)}</p>
              <p>Prioridade: ${escapeHTML(ticket.priority)}</p>
              <button class="text-btn" data-open-ticket="${ticket.id}">Abrir ticket</button>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading"><h3>Ações rápidas</h3></div>
        <button class="quick-action" data-page="tickets">Consultar tickets</button>
        <button class="quick-action" data-page="customers">Consultar clientes</button>
        <button class="quick-action" data-page="training">Praticar atendimento</button>
        <button class="quick-action" data-page="knowledge">Consultar central de ajuda</button>
      </section>
    </div>

    <p class="disclaimer">Ambiente de treinamento com dados fictícios. Nenhum atendimento real é realizado.</p>
  `;
}

function renderTickets() {
  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">GERENCIAMENTO</p>
        <h2>Fila de tickets</h2>
        <p>Consulte os casos e pratique o fluxo de atendimento.</p>
      </div>
      <button class="primary-btn" id="new-ticket-btn">+ Novo ticket</button>
    </div>
    <section class="panel">
      <div class="panel-heading"><h3>Todos os tickets (${currentTickets.length})</h3></div>
      <div id="recent-tickets">
        ${currentTickets.map(ticket => `
          <div class="ticket-row">
            <strong>#${ticket.id} — ${escapeHTML(ticket.subject)}</strong>
            <p>Cliente: ${escapeHTML(ticket.customer)}</p>
            <p>Categoria: ${escapeHTML(ticket.category)}</p>
            <p>Prioridade: ${escapeHTML(ticket.priority)} · Status: ${escapeHTML(ticket.status)}</p>
            <button class="text-btn" data-open-ticket="${ticket.id}">Ver detalhes</button>
          </div>
        `).join("") || "<p>Nenhum ticket cadastrado.</p>"}
      </div>
    </section>
    <p class="disclaimer">Os tickets são fictícios e servem apenas para treinamento.</p>
  `;
}

function renderCustomers() {
  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">CRM SIMULADO</p>
        <h2>Clientes</h2>
        <p>Consulte perfis e histórico fictício de atendimento.</p>
      </div>
    </div>
    <section class="panel">
      <div class="panel-heading"><h3>Base de clientes</h3></div>
      ${customers.map(customer => `
        <div class="ticket-row">
          <strong>${escapeHTML(customer.name)}</strong>
          <p>${escapeHTML(customer.email)}</p>
          <p>Tickets associados: ${customer.tickets}</p>
        </div>
      `).join("")}
    </section>
    <p class="disclaimer">Todos os nomes, endereços de e-mail e registros são dados de demonstração.</p>
  `;
}

function renderKnowledge() {
  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">BASE DE CONHECIMENTO</p>
        <h2>Central de ajuda</h2>
        <p>Consulte orientações para resolver casos de suporte.</p>
      </div>
    </div>
    <section class="panel">
      ${articles.map(article => `
        <div class="ticket-row">
          <p class="eyebrow">${escapeHTML(article.category)}</p>
          <h3>${escapeHTML(article.title)}</h3>
          <p style="margin-top:8px;line-height:1.6">${escapeHTML(article.body)}</p>
        </div>
      `).join("")}
    </section>
  `;
}

function renderTraining() {
  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">PRÁTICA GUIADA</p>
        <h2>Treinamento</h2>
        <p>Pratique situações comuns do atendimento ao cliente.</p>
      </div>
    </div>
    <div class="content-grid">
      ${scenarios.map((scenario, index) => `
        <section class="panel">
          <p class="eyebrow">${escapeHTML(scenario.level)}</p>
          <h3 style="margin:10px 0">${escapeHTML(scenario.title)}</h3>
          <p style="line-height:1.7">${escapeHTML(scenario.situation)}</p>
          <p style="margin-top:12px;line-height:1.7"><strong>Sua tarefa:</strong> ${escapeHTML(scenario.task)}</p>
          <button class="primary-btn" style="margin-top:18px" data-scenario="${index}">Começar exercício</button>
        </section>
      `).join("")}
    </div>
    <div id="exercise-area"></div>
  `;
}

function renderPerformance() {
  const total = currentTickets.length;
  const resolved = currentTickets.filter(ticket => ticket.status === "Resolvido").length;
  const open = total - resolved;
  const rate = total ? Math.round(resolved / total * 100) : 0;

  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">ACOMPANHAMENTO</p>
        <h2>Desempenho</h2>
        <p>Métricas básicas dos casos simulados.</p>
      </div>
    </div>
    <div class="metrics-grid">
      <div class="metric-card"><p>Total de tickets</p><h2>${total}</h2></div>
      <div class="metric-card"><p>Em aberto ou andamento</p><h2>${open}</h2></div>
      <div class="metric-card"><p>Resolvidos</p><h2>${resolved}</h2></div>
      <div class="metric-card"><p>Taxa de resolução</p><h2>${rate}%</h2></div>
    </div>
    <p class="disclaimer">Indicadores demonstrativos. Eles não representam métricas de um emprego real.</p>
  `;
}

function renderPortfolio() {
  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">SEU PORTFÓLIO</p>
        <h2>Experiência prática demonstrável</h2>
        <p>Organize as atividades realizadas no simulador.</p>
      </div>
    </div>
    <section class="panel">
      <h3>Resumo do projeto</h3>
      <p style="margin-top:12px;line-height:1.8">
        O SupportLab é um projeto pessoal de simulação de atendimento ao cliente.
        Ele permite praticar organização de tickets, comunicação escrita, consulta
        à base de conhecimento e acompanhamento de indicadores usando dados fictícios.
      </p>
      <div style="margin-top:22px">
        <p><strong>Tickets cadastrados:</strong> ${currentTickets.length}</p>
        <p style="margin-top:8px"><strong>Casos resolvidos:</strong> ${currentTickets.filter(ticket => ticket.status === "Resolvido").length}</p>
      </div>
      <button class="primary-btn" style="margin-top:20px" id="export-report-btn">Exportar relatório</button>
    </section>
    <p class="disclaimer">Apresente este projeto como prática pessoal e não como experiência de emprego real.</p>
  `;
}

const pages = {
  dashboard: ["Dashboard", renderDashboard],
  tickets: ["Tickets", renderTickets],
  customers: ["Clientes", renderCustomers],
  knowledge: ["Central de ajuda", renderKnowledge],
  training: ["Treinamento", renderTraining],
  performance: ["Desempenho", renderPerformance],
  portfolio: ["Meu portfólio", renderPortfolio]
};

function navigate(page) {
  if (!pages[page]) return;

  pageTitle.textContent = pages[page][0];

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  pages[page][1]();
}

function renderNewTicketForm() {
  const oldForm = document.getElementById("new-ticket-form");
  if (oldForm) {
    oldForm.remove();
    return;
  }

  const form = document.createElement("section");
  form.id = "new-ticket-form";
  form.className = "panel";
  form.style.marginBottom = "22px";

  form.innerHTML = `
    <div class="panel-heading"><h3>Criar ticket fictício</h3></div>
    <form id="ticket-form">
      <label for="ticket-subject">Assunto</label>
      <input id="ticket-subject" required maxlength="120" placeholder="Ex.: Dúvida sobre pedido">

      <label for="ticket-customer" style="margin-top:14px">Nome do cliente fictício</label>
      <input id="ticket-customer" required maxlength="80" placeholder="Ex.: João Silva">

      <label for="ticket-category" style="margin-top:14px">Categoria</label>
      <select id="ticket-category">
        <option>Entrega</option>
        <option>Pagamento</option>
        <option>Trocas</option>
        <option>Produto</option>
        <option>Outro</option>
      </select>

      <label for="ticket-priority" style="margin-top:14px">Prioridade</label>
      <select id="ticket-priority">
        <option>Baixa</option>
        <option selected>Média</option>
        <option>Alta</option>
      </select>

      <button class="primary-btn" type="submit" style="margin-top:18px">Salvar ticket</button>
    </form>
  `;

  content.prepend(form);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTicketDetails(id) {
  const ticket = currentTickets.find(item => item.id === Number(id));
  if (!ticket) return;

  content.innerHTML = `
    <div class="welcome">
      <div>
        <p class="eyebrow">TICKET #${ticket.id}</p>
        <h2>${escapeHTML(ticket.subject)}</h2>
        <p>Cliente: ${escapeHTML(ticket.customer)}</p>
      </div>
      <button class="primary-btn" id="back-to-tickets">Voltar aos tickets</button>
    </div>
    <section class="panel">
      <p><strong>Categoria:</strong> ${escapeHTML(ticket.category)}</p>
      <p style="margin-top:10px"><strong>Prioridade:</strong> ${escapeHTML(ticket.priority)}</p>
      <p style="margin-top:10px"><strong>Status atual:</strong> ${escapeHTML(ticket.status)}</p>
      <div style="margin-top:22px">
        <label for="ticket-status">Atualizar status</label>
        <select id="ticket-status">
          <option ${ticket.status === "Aberto" ? "selected" : ""}>Aberto</option>
          <option ${ticket.status === "Em andamento" ? "selected" : ""}>Em andamento</option>
          <option ${ticket.status === "Resolvido" ? "selected" : ""}>Resolvido</option>
        </select>
        <button class="primary-btn" id="save-ticket-status" style="margin-top:12px">Salvar status</button>
      </div>
      <div style="margin-top:24px">
        <label for="ticket-note">Nota de atendimento (simulada)</label>
        <textarea id="ticket-note" rows="4" placeholder="Registre o que você verificaria ou responderia ao cliente."></textarea>
        <button class="primary-btn" id="save-ticket-note" style="margin-top:12px">Salvar nota</button>
        <p id="note-feedback" style="margin-top:10px;color:#526076"></p>
      </div>
      <p class="disclaimer">Este caso é fictício. Não existe envio de mensagens para clientes reais.</p>
    </section>
  `;

  document.getElementById("back-to-tickets").addEventListener("click", () => navigate("tickets"));

  document.getElementById("save-ticket-status").addEventListener("click", () => {
    ticket.status = document.getElementById("ticket-status").value;
    saveTickets();
    renderTicketDetails(ticket.id);
  });

  document.getElementById("save-ticket-note").addEventListener("click", () => {
    const note = document.getElementById("ticket-note").value.trim();
    document.getElementById("note-feedback").textContent = note
      ? "Nota registrada nesta sessão. Ela ainda não é salva permanentemente."
      : "Escreva uma nota antes de salvar.";
  });
}

document.addEventListener("click", event => {
  const navButton = event.target.closest("[data-page]");
  if (navButton) {
    navigate(navButton.dataset.page);
    return;
  }

  const newTicketButton = event.target.closest("#new-ticket-btn");
  if (newTicketButton) {
    renderNewTicketForm();
    return;
  }

  const openTicketButton = event.target.closest("[data-open-ticket]");
  if (openTicketButton) {
    renderTicketDetails(openTicketButton.dataset.openTicket);
    return;
  }

  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    const scenario = scenarios[Number(scenarioButton.dataset.scenario)];
    const area = document.getElementById("exercise-area");
    area.innerHTML = `
      <section class="panel" style="margin-top:20px">
        <h3>${escapeHTML(scenario.title)}</h3>
        <p style="margin:12px 0;line-height:1.7">${escapeHTML(scenario.situation)}</p>
        <p style="margin-bottom:12px"><strong>${escapeHTML(scenario.task)}</strong></p>
        <label for="scenario-answer">Sua resposta</label>
        <textarea id="scenario-answer" rows="6" placeholder="Escreva aqui sua resposta simulada..."></textarea>
        <button class="primary-btn" id="save-exercise" style="margin-top:12px">Registrar exercício</button>
        <p id="exercise-feedback" style="margin-top:12px"></p>
      </section>
    `;
    area.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const exportButton = event.target.closest("#export-report-btn");
  if (exportButton) {
    const report = {
      project: "SupportLab",
      type: "Simulação com dados fictícios",
      generatedAt: new Date().toLocaleString("pt-BR"),
      totalTickets: currentTickets.length,
      resolvedTickets: currentTickets.filter(ticket => ticket.status === "Resolvido").length,
      tickets: currentTickets
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "supportlab-relatorio.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (event.target.closest("#save-exercise")) {
    const answer = document.getElementById("scenario-answer").value.trim();
    document.getElementById("exercise-feedback").textContent = answer
      ? "Exercício registrado nesta sessão. Você pode revisar sua resposta e aprimorá-la."
      : "Escreva sua resposta antes de registrar o exercício.";
  }
});

document.addEventListener("submit", event => {
  if (event.target.id !== "ticket-form") return;
  event.preventDefault();

  const subject = document.getElementById("ticket-subject").value.trim();
  const customer = document.getElementById("ticket-customer").value.trim();
  const category = document.getElementById("ticket-category").value;
  const priority = document.getElementById("ticket-priority").value;

  if (!subject || !customer) return;

  const nextId = Math.max(1000, ...currentTickets.map(ticket => ticket.id)) + 1;

  currentTickets.unshift({
    id: nextId,
    subject,
    customer,
    category,
    priority,
    status: "Aberto"
  });

  saveTickets();
  navigate("tickets");
});

navigate("dashboard");