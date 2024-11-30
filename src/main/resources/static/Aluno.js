const API_URL_ALUNOS = "http://localhost:8084/api/alunos";
const API_URL_TURMA = "http://localhost:8084/api/turma/selecionada"; // Endpoint para obter a turma selecionada


// Preencher o formulário com dados do aluno
function preencherFormulario(aluno) {
    document.getElementById("alunoId").value = aluno.alunoId || "";
    document.getElementById("nome").value = aluno.nome || "";
    document.getElementById("dataNascimento").value = aluno.dataNascimento || "";
    document.getElementById("email").value = aluno.email || "";
    document.getElementById("telefone").value = aluno.telefone || "";
    document.getElementById("nomeResponsavel").value = aluno.nomeResponsavel || "";
    document.getElementById("telefoneResponsavel").value = aluno.telefoneResponsavel || "";

    // Atualizar o campo turma com o nome da turma
    if (aluno.turma && aluno.turma.nome) {
        document.getElementById("turma").value = aluno.turma.nome; // Exibe apenas o nome da turma
        document.getElementById("turma").dataset.id = aluno.turma.id; // Salva o ID no dataset
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

// Função para salvar aluno
async function salvarAluno(event) {
    event.preventDefault();

    if (!validarCamposObrigatorios()) return;

    const aluno = {
        nome: document.getElementById("nome").value.trim(),
        dataNascimento: document.getElementById("dataNascimento").value || null,
        email: document.getElementById("email").value.trim().toLowerCase() || null,
        telefone: document.getElementById("telefone").value.trim() || null,
        nomeResponsavel: document.getElementById("nomeResponsavel").value.trim() || null,
        telefoneResponsavel: document.getElementById("telefoneResponsavel").value.trim() || null,
        turma: {
            id: document.getElementById("turma").dataset.id || null // Verifica se o ID da turma está definido
        }
    };

    console.log("Dados do aluno a serem enviados:", aluno);

    const isEdicao = document.getElementById("alunoId").value.trim() !== "";
    const method = isEdicao ? "PUT" : "POST";
    const url = isEdicao
        ? `${API_URL_ALUNOS}/${document.getElementById("alunoId").value.trim()}`
        : API_URL_ALUNOS;

    console.log("URL:", url);
    console.log("Método:", method);

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aluno),
        });

        if (response.ok) {
            alert(isEdicao ? "Aluno atualizado com sucesso!" : "Aluno salvo com sucesso!");
            limparFormulario();
            carregarAlunosPorTurma(); // Atualiza a lista de alunos da turma
        

            // Preserva o valor do campo turma
            const turmaNome = document.getElementById("turma").value;
            const turmaId = document.getElementById("turma").dataset.id;

            limparFormulario();

            // Restaura o valor do campo turma após limpar
            document.getElementById("turma").value = turmaNome;
            document.getElementById("turma").dataset.id = turmaId;
        } else {
            const errorDetails = await response.json().catch(() => ({ message: "Erro desconhecido" }));
            console.error("Erro ao salvar aluno:", errorDetails);
            alert(`Erro ao salvar aluno: ${errorDetails.message || "Verifique os dados e tente novamente."}`);
        }
    } catch (error) {
        console.error("Erro ao salvar aluno:", error.message || error);
        alert("Erro inesperado. Por favor, tente novamente.");
    }
}



// Buscar alunos por nome e turma
async function filtrarNomes() {
    const nome = document.getElementById("filtroNome").value.trim();
    const turmaId = document.getElementById("turma").dataset.id; // Obter o ID da turma armazenado no dataset

    if (!turmaId) {
        alert("Turma não selecionada. Por favor, selecione uma turma primeiro.");
        return;
    }

    if (nome.length < 2) {
        document.getElementById("listaSugestoes").style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${API_URL_ALUNOS}/buscarPorNomeETurma?nome=${encodeURIComponent(nome)}&turmaId=${turmaId}`);
        if (response.ok) {
            const alunos = await response.json();
            mostrarSugestoes(alunos);
        } else {
            console.warn("Nenhum aluno encontrado para os critérios especificados.");
            document.getElementById("listaSugestoes").style.display = "none";
        }
    } catch (error) {
        console.error("Erro ao filtrar nomes:", error);
    }
}


// Mostrar sugestões de alunos por nome
function mostrarSugestoes(alunos) {
    const listaSugestoes = document.getElementById("listaSugestoes");
    listaSugestoes.innerHTML = "";

    if (alunos && alunos.length > 0) {
        alunos.forEach(aluno => {
            const item = document.createElement("div");
            item.textContent = aluno.nome;
            item.className = "list-group-item list-group-item-action";
            item.style.cursor = "pointer";
            item.onclick = () => {
                preencherFormulario(aluno);
                alert("Aluno carregado com sucesso!");
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

// Função para excluir aluno
async function excluirAluno() {
    const alunoId = document.getElementById("alunoId").value;

    if (!alunoId) {
        alert("Nenhum aluno selecionado para exclusão.");
        return;
    }

    const confirmacao = confirm("Tem certeza de que deseja excluir este aluno?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${API_URL_ALUNOS}/${alunoId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Aluno excluído com sucesso!");
            limparFormulario();
            carregarAlunosPorTurma();
        } else {
            alert("Erro ao excluir aluno. Verifique se o aluno ainda existe.");
        }
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        alert("Erro inesperado ao excluir aluno. Por favor, tente novamente.");
    }
}

// Limpar formulário
function limparFormulario() {
    // Preserva o nome da turma no campo
    const turmaNome = document.getElementById("turma").value;
    const turmaId = document.getElementById("turma").dataset.id;

    // Limpa os outros campos do formulário
    document.getElementById("alunoForm").reset();

    // Restaura o valor do campo turma
    document.getElementById("turma").value = turmaNome;
    document.getElementById("turma").dataset.id = turmaId;

    // Garante que o alunoId também seja limpo
    document.getElementById("alunoId").value = "";
}

// Forçar email para minúsculas
function forcarMinusculo(input) {
    input.value = input.value.toLowerCase().trim();
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

// Função para carregar a turma selecionada
async function carregarTurmaSelecionada() {
    try {
        const response = await fetch(API_URL_TURMA);
        if (response.ok) {
            const turmaSelecionada = await response.json();
            if (turmaSelecionada && turmaSelecionada.nome) {
                const turmaInput = document.getElementById("turma");
                turmaInput.value = turmaSelecionada.nome; // Exibe o nome da turma
                turmaInput.dataset.id = turmaSelecionada.id; // Define o ID da turma no dataset

                carregarAlunosPorTurma(); // Carregar alunos da turma selecionada
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




// Função para carregar alunos apenas da turma selecionada
async function carregarAlunosPorTurma() {
    const turmaId = document.getElementById("turma").dataset.id; // Obter o ID da turma

    if (!turmaId) {
        console.warn("Nenhuma turma selecionada.");
        return;
    }

    try {
        const response = await fetch(`${API_URL_ALUNOS}?turmaId=${turmaId}`); // Endpoint para buscar alunos pela turma
        if (response.ok) {
            const alunos = await response.json();
            preencherTabelaAlunos(alunos); // Atualiza a tabela de alunos
        } else {
            console.error("Erro ao carregar alunos:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

// Função para preencher a tabela de alunos
function preencherTabelaAlunos(alunos) {
    const turmaId = document.getElementById("turma").dataset.id; // Obter o ID da turma
    const tabelaBody = document.getElementById("alunosCadastrados");
    tabelaBody.innerHTML = ""; // Limpar a tabela antes de preencher

    // Filtrar apenas os alunos da turma selecionada
    const alunosFiltrados = alunos.filter(aluno => aluno.turma && aluno.turma.id == turmaId);

    if (alunosFiltrados.length > 0) {
        alunosFiltrados.forEach((aluno) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${aluno.alunoId}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.telefone || "Não informado"}</td>
            `;

            tabelaBody.appendChild(row);
        });
    } else {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">Nenhum aluno cadastrado nesta turma.</td>
            </tr>
        `;
    }
}


// Inicialização
document.getElementById("alunoForm").addEventListener("submit", salvarAluno);
document.getElementById("filtroNome").addEventListener("input", filtrarNomes);
carregarTurmaSelecionada();