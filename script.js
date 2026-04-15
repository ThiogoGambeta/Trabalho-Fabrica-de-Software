let tarefas = [
  {
    id: 1,
    titulo: "Estudar JavaScript",
    descricao: "Revisar DOM e eventos",
    status: "pendente"
  },
  {
    id: 2,
    titulo: "Montar tela do projeto",
    descricao: "Criar estrutura do kanban",
    status: "fazendo"
  }
];

const btnNovaTarefa = document.getElementById("btnNovaTarefa");
const modalOverlay = document.getElementById("modalOverlay");
const formTarefa = document.getElementById("formTarefa");
const modalTitulo = document.getElementById("modalTitulo");
const btnCancelar = document.getElementById("btnCancelar");

const tarefaIdInput = document.getElementById("tarefaId");
const tituloInput = document.getElementById("tituloInput");
const descricaoInput = document.getElementById("descricaoInput");
const statusInput = document.getElementById("statusInput");

const colunas = {
  pendente: document.getElementById("pendente"),
  fazendo: document.getElementById("fazendo"),
  concluida: document.getElementById("concluida"),
  refazer: document.getElementById("refazer")
};

function abrirModalNovaTarefa() {
  modalTitulo.textContent = "Nova tarefa";
  tarefaIdInput.value = "";
  tituloInput.value = "";
  descricaoInput.value = "";
  statusInput.value = "pendente";
  modalOverlay.classList.remove("hidden");
}

function abrirModalEditarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  modalTitulo.textContent = "Editar tarefa";
  tarefaIdInput.value = tarefa.id;
  tituloInput.value = tarefa.titulo;
  descricaoInput.value = tarefa.descricao;
  statusInput.value = tarefa.status;
  modalOverlay.classList.remove("hidden");
}

function fecharModal() {
  modalOverlay.classList.add("hidden");
  formTarefa.reset();
  tarefaIdInput.value = "";
}

function criarCardTarefa(tarefa) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <strong>${tarefa.titulo}</strong>
    <p>${tarefa.descricao || "Sem descrição"}</p>

    <div class="acoes">
      <button class="btn-editar" onclick="editarTarefa(${tarefa.id})">Editar</button>
      <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>

      <select class="status-select" onchange="alterarStatus(${tarefa.id}, this.value)">
        <option value="pendente" ${tarefa.status === "pendente" ? "selected" : ""}>A fazer</option>
        <option value="fazendo" ${tarefa.status === "fazendo" ? "selected" : ""}>Fazendo</option>
        <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
        <option value="refazer" ${tarefa.status === "refazer" ? "selected" : ""}>Refazer</option>
      </select>
    </div>
  `;

  return card;
}

function renderizarTarefas() {
  Object.values(colunas).forEach(coluna => {
    coluna.innerHTML = "";
  });

  tarefas.forEach(tarefa => {
    colunas[tarefa.status].appendChild(criarCardTarefa(tarefa));
  });

  Object.keys(colunas).forEach(status => {
    if (colunas[status].children.length === 0) {
      colunas[status].innerHTML = `<div class="vazio">Nenhuma tarefa aqui</div>`;
    }
  });
}

function adicionarTarefa(titulo, descricao, status) {
  tarefas.push({
    id: Date.now(),
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    status
  });

  renderizarTarefas();
}

function atualizarTarefa(id, titulo, descricao, status) {
  const tarefa = tarefas.find(t => t.id === Number(id));
  if (!tarefa) return;

  tarefa.titulo = titulo.trim();
  tarefa.descricao = descricao.trim();
  tarefa.status = status;

  renderizarTarefas();
}

function excluirTarefa(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");
  if (!confirmar) return;

  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
}

function editarTarefa(id) {
  abrirModalEditarTarefa(id);
}

function alterarStatus(id, novoStatus) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  tarefa.status = novoStatus;
  renderizarTarefas();
}

btnNovaTarefa.addEventListener("click", abrirModalNovaTarefa);
btnCancelar.addEventListener("click", fecharModal);

modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) {
    fecharModal();
  }
});

formTarefa.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = tarefaIdInput.value;
  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const status = statusInput.value;

  if (!titulo) {
    alert("Digite o título da tarefa.");
    return;
  }

  if (id) {
    atualizarTarefa(id, titulo, descricao, status);
  } else {
    adicionarTarefa(titulo, descricao, status);
  }

  fecharModal();
});

renderizarTarefas();