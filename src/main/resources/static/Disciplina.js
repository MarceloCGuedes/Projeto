const API_URL_DISCIPLINAS = "http://localhost:8084/api/disciplina";
const API_URL_TURMA = "http://localhost:8084/api/turma/selecionada"; // Endpoint para obter a turma selecionada

// Preencher o formulário com dados da disciplina
function preencherFormulario(disciplina) {
    document.getElementById("disciplinaId").value = disciplina.disciplinaId || "";
    document.getElementById("nome").value = disciplina.nome || "";

    // Atualizar o campo turma com o nome da turma
    if (disciplina.turma && disciplina.turma.nome) {
        document.getElementById("turma").value = disciplina.turma.nome; // Exibe apenas o nome da turma
        document.getElementById("turma").dataset.id = disciplina.turma.id; // Salva o ID no dataset
    } else {
        document.getElementById("turma").value = ""; // Limpa caso não exista turma
        document.getElementById("turma").dataset.id = ""; // Remove o ID do dataset
    }
}

// Validar campos obrigatórios
function validarCamposObrigatorios() {
    const camposObrigatorios = ["nome", "turma"];
    for (const campo of camposObrigatorios) {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
            alert(`O campo "${campo}" é obrigatório.`);
            elemento.focus();
            return false;
        }
    }
    return true;
}

// Função para salvar disciplina
async function salvarDisciplina(event) {
    event.preventDefault();

    if (!validarCamposObrigatorios()) return;

    const disciplina = {
        nome: document.getElementById("nome").value.trim(),
        turma: {
            id: document.getElementById("turma").dataset.id, // Envia o ID da turma
        },
    };

    const isEdicao = document.getElementById("disciplinaId").value.trim() !== "";
    const method = isEdicao ? "PUT" : "POST";
    const url = isEdicao
        ? `${API_URL_DISCIPLINAS}/${document.getElementById("disciplinaId").value.trim()}`
        : API_URL_DISCIPLINAS;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(disciplina),
        });

        if (response.ok) {
            alert(isEdicao ? "Disciplina atualizada com sucesso!" : "Disciplina salva com sucesso!");
            limparFormulario();
            await carregarDisciplinasPorTurma(); // Atualiza a tabela
        } else {
            const errorDetails = await response.json().catch(() => ({ message: "Erro desconhecido" }));
            console.error("Erro ao salvar disciplina:", errorDetails);
            alert(`Erro ao salvar disciplina: ${errorDetails.message || "Verifique os dados e tente novamente."}`);
        }
    } catch (error) {
        console.error("Erro ao salvar disciplina:", error.message || error);
        alert("Erro inesperado. Por favor, tente novamente.");
    }
}

// Buscar disciplinas por nome e turma
async function filtrarNomes() {
    const nome = document.getElementById("filtroNome").value.trim();
    const turmaId = document.getElementById("turma").dataset.id;

    if (!turmaId) {
        alert("Turma não selecionada. Por favor, selecione uma turma primeiro.");
        return;
    }

    if (nome.length < 2) {
        document.getElementById("listaSugestoes").style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${API_URL_DISCIPLINAS}/buscarPorNomeETurma?nome=${encodeURIComponent(nome)}&turmaId=${turmaId}`);
        if (response.ok) {
            const disciplinas = await response.json();
            mostrarSugestoes(disciplinas);
        } else {
            document.getElementById("listaSugestoes").style.display = "none";
            console.warn("Nenhuma disciplina encontrada para os critérios especificados.");
        }
    } catch (error) {
        console.error("Erro ao filtrar nomes:", error);
    }
}

// Mostrar sugestões de disciplinas por nome
function mostrarSugestoes(disciplinas) {
    const listaSugestoes = document.getElementById("listaSugestoes");
    listaSugestoes.innerHTML = "";

    if (disciplinas.length > 0) {
        disciplinas.forEach((disciplina) => {
            const item = document.createElement("div");
            item.textContent = disciplina.nome;
            item.className = "list-group-item list-group-item-action";
            item.style.cursor = "pointer";
            item.onclick = () => {
                preencherFormulario(disciplina);
                alert("Disciplina carregada com sucesso!");
                document.getElementById("filtroNome").value = "";
                document.getElementById("listaSugestoes").style.display = "none";
            };
            listaSugestoes.appendChild(item);
        });
        listaSugestoes.style.display = "block";
    } else {
        listaSugestoes.style.display = "none";
    }
}

// Função para excluir disciplina
async function excluirDisciplina() {
    const disciplinaId = document.getElementById("disciplinaId").value;

    if (!disciplinaId) {
        alert("Nenhuma disciplina selecionada para exclusão.");
        return;
    }

    const confirmacao = confirm("Tem certeza de que deseja excluir esta disciplina?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${API_URL_DISCIPLINAS}/${disciplinaId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Disciplina excluída com sucesso!");
            limparFormulario();
            await carregarDisciplinasPorTurma(); // Atualiza a tabela
        } else {
            console.error("Erro ao excluir disciplina:", response.statusText);
            alert("Erro ao excluir disciplina. Verifique se a disciplina ainda existe.");
        }
    } catch (error) {
        console.error("Erro inesperado ao excluir disciplina:", error);
        alert("Erro inesperado ao excluir disciplina. Por favor, tente novamente.");
    }
}

// Limpar formulário
function limparFormulario() {
    const turmaNome = document.getElementById("turma").value;
    const turmaId = document.getElementById("turma").dataset.id;

    document.getElementById("disciplinaForm").reset();

    document.getElementById("turma").value = turmaNome;
    document.getElementById("turma").dataset.id = turmaId;

    document.getElementById("disciplinaId").value = "";
}

// Carregar a turma selecionada
async function carregarTurmaSelecionada() {
    try {
        const response = await fetch(API_URL_TURMA);
        if (response.ok) {
            const turmaSelecionada = await response.json();
            if (turmaSelecionada && turmaSelecionada.nome) {
                const turmaInput = document.getElementById("turma");
                turmaInput.value = turmaSelecionada.nome;
                turmaInput.dataset.id = turmaSelecionada.id;

                await carregarDisciplinasPorTurma(); // Carregar disciplinas
            } else {
                alert("Nenhuma turma foi selecionada. Configure antes de continuar.");
            }
        } else {
            console.error("Erro ao carregar a turma selecionada:", response.statusText);
            alert("Erro ao carregar a turma selecionada.");
        }
    } catch (error) {
        console.error("Erro ao carregar a turma selecionada:", error);
        alert("Erro inesperado ao carregar a turma.");
    }
}

// Função para carregar disciplinas apenas da turma selecionada
async function carregarDisciplinasPorTurma() {
    const turmaId = document.getElementById("turma").dataset.id; // Obter o ID da turma

    if (!turmaId) {
        console.warn("Nenhuma turma selecionada.");
        return;
    }

    try {
        // Enviar o parâmetro turmaId na URL para buscar apenas disciplinas dessa turma
        const response = await fetch(`${API_URL_DISCIPLINAS}?turmaId=${turmaId}`);
        if (response.ok) {
            const disciplinas = await response.json();
            preencherTabelaDisciplinas(disciplinas); // Atualiza a tabela de disciplinas
        } else {
            console.error("Erro ao carregar disciplinas:", response.statusText);
            alert("Erro ao carregar disciplinas. Por favor, tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
        alert("Erro inesperado ao carregar disciplinas.");
    }
}

    // Permitir apenas números
    function permitirApenasNumeros(input) {
        input.value = input.value.replace(/\D/g, "");
    }

// Capitalizar palavras
function capitalizeWordsIgnoringAccents(input) {
    input.value = input.value
        .toLowerCase() // Converte o texto para minúsculas
        .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitaliza a primeira letra de cada palavra
    }

    
// Preencher a tabela de disciplinas
function preencherTabelaDisciplinas(disciplinas) {
    const turmaId = document.getElementById("turma").dataset.id; // Obter o ID da turma selecionada
    const tabelaBody = document.getElementById("disciplinasCadastradas");
    tabelaBody.innerHTML = ""; // Limpar a tabela antes de preenchê-la

    // Filtrar disciplinas que pertencem à turma selecionada
    const disciplinasFiltradas = disciplinas.filter(disciplina => disciplina.turma && disciplina.turma.id == turmaId);

    if (disciplinasFiltradas.length > 0) {
        disciplinasFiltradas.forEach(disciplina => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${disciplina.disciplinaId}</td>
                <td>${disciplina.nome}</td>
            `;

            tabelaBody.appendChild(row);
        });
    } else {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center">Nenhuma disciplina cadastrada nesta turma.</td>
            </tr>
        `;
    }


}

// Inicialização
document.getElementById("disciplinaForm").addEventListener("submit", salvarDisciplina);
document.getElementById("filtroNome").addEventListener("input", filtrarNomes);
carregarTurmaSelecionada(); // Garantir que a turma seja carregada ao iniciar
