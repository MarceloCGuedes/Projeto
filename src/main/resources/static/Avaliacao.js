const API_URL_AVALIACAOS = "http://localhost:8084/api/avaliacao";
const API_URL_TURMA = "http://localhost:8084/api/turma/selecionada";

// Preencher o formulário com dados da avaliação
function preencherFormulario(avaliacao) {
    document.getElementById("avaliacaoId").value = avaliacao.avaliacaoId || "";
    document.getElementById("nome").value = avaliacao.nome || "";
    document.getElementById("nota").value = avaliacao.nota || "";

    if (avaliacao.turma && avaliacao.turma.nome) {
        document.getElementById("turma").value = avaliacao.turma.nome; 
        document.getElementById("turma").dataset.id = avaliacao.turma.id;
    } else {
        document.getElementById("turma").value = "";
        document.getElementById("turma").dataset.id = "";
    }
}

// Validar campos obrigatórios
function validarCamposObrigatorios() {
    const camposObrigatorios = ["nome", "turma", "nota"];
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

// Função para salvar avaliação
async function salvarAvaliacao(event) {
    event.preventDefault();

    if (!validarCamposObrigatorios()) return;

    const nota = parseFloat(document.getElementById("nota").value.trim());
    if (nota > 10) {
        alert("A nota de uma avaliação não pode ser maior que 10.");
        return;
    }

    const turmaId = document.getElementById("turma").dataset.id;
    if (!turmaId) {
        alert("Erro: Turma não selecionada.");
        return;
    }

    // Validar soma das notas
    const listaAvaliacoes = await carregarAvaliacoesFrontend();
    const somaNotas = listaAvaliacoes.reduce((soma, avaliacao) => soma + (avaliacao.nota || 0), 0);

    if (somaNotas + nota > 10) {
        alert("A soma das notas de todas as avaliações desta turma não pode ser maior que 10.");
        return;
    }

    const avaliacao = {
        nome: document.getElementById("nome").value.trim(),
        nota: nota,
        turma: {
            id: parseInt(turmaId, 10)
        }
    };

    const isEdicao = document.getElementById("avaliacaoId").value.trim() !== "";
    const method = isEdicao ? "PUT" : "POST";
    const url = isEdicao
        ? `${API_URL_AVALIACAOS}/${document.getElementById("avaliacaoId").value.trim()}`
        : API_URL_AVALIACAOS;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(avaliacao),
        });

        if (response.ok) {
            alert(isEdicao ? "Avaliação atualizada com sucesso!" : "Avaliação salva com sucesso!");
            limparFormulario();
            carregarTabelaAvaliacoes();
        } else {
            const errorData = await response.json();
            alert(`Erro ao salvar a avaliação: ${errorData.error || "Tente novamente."}`);
        }
    } catch (error) {
        console.error("Erro ao salvar a avaliação:", error);
        alert("Erro inesperado ao salvar a avaliação.");
    }
}

// Função para carregar avaliações do backend
async function carregarAvaliacoesFrontend() {
    const turmaId = document.getElementById("turma").dataset.id;

    if (!turmaId) {
        alert("Nenhuma turma selecionada. Por favor, selecione uma turma antes de carregar as avaliações.");
        return [];
    }

    try {
        const response = await fetch(`${API_URL_AVALIACAOS}?turmaId=${turmaId}`); // Inclui o turmaId
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erro ao carregar as avaliações:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro ao carregar as avaliações:", error);
        return [];
    }
}



// Limpar formulário
function limparFormulario() {
    const turmaNome = document.getElementById("turma").value;
    const turmaId = document.getElementById("turma").dataset.id;

    document.getElementById("avaliacaoForm").reset();
    document.getElementById("turma").value = turmaNome;
    document.getElementById("turma").dataset.id = turmaId;
    document.getElementById("avaliacaoId").value = "";
}

// Função para carregar a turma selecionada
async function carregarTurmaSelecionada() {
    try {
        const response = await fetch(API_URL_TURMA);
        if (response.ok) {
            const turmaSelecionada = await response.json();

            if (turmaSelecionada && turmaSelecionada.id && turmaSelecionada.nome) {
                const turmaInput = document.getElementById("turma");
                turmaInput.value = turmaSelecionada.nome;
                turmaInput.dataset.id = turmaSelecionada.id;
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

// Inicialização da página
async function inicializarPagina() {
    await carregarTurmaSelecionada();
    await carregarTabelaAvaliacoes();
}

async function carregarTabelaAvaliacoes() {
    const avaliacoes = await carregarAvaliacoesFrontend();
    const tabela = document.getElementById("listaAvaliacoes");
    tabela.innerHTML = "";

    if (avaliacoes.length === 0) {
        tabela.innerHTML = `<tr><td colspan="2" class="text-center">Nenhuma avaliação cadastrada para esta turma.</td></tr>`;
        return;
    }

    avaliacoes.forEach((avaliacao) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${avaliacao.nome}</td>
            <td>${avaliacao.nota}</td>
        `;
        tabela.appendChild(linha);
    });
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

// Mostrar sugestões de avaliacaos por nome
function mostrarSugestoes(avaliacaos) {
    const listaSugestoes = document.getElementById("listaSugestoes");
    listaSugestoes.innerHTML = "";

    if (avaliacaos && avaliacaos.length > 0) {
        avaliacaos.forEach(avaliacao => {
            const item = document.createElement("div");
            item.textContent = avaliacao.nome;
            item.className = "list-group-item list-group-item-action";
            item.style.cursor = "pointer";
            item.onclick = () => {
                preencherFormulario(avaliacao);
                alert("Avaliacao carregado com sucesso!");
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

// Buscar avaliacaos por nome e turma
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
        const response = await fetch(`${API_URL_AVALIACAOS}/buscarPorNomeETurma?nome=${encodeURIComponent(nome)}&turmaId=${turmaId}`);
        if (response.ok) {
            const avaliacaos = await response.json();
            mostrarSugestoes(avaliacaos);
        } else {
            console.warn("Nenhum avaliacao encontrado para os critérios especificados.");
            document.getElementById("listaSugestoes").style.display = "none";
        }
    } catch (error) {
        console.error("Erro ao filtrar nomes:", error);
    }
}


// Função para excluir avaliacao
async function excluirAvaliacao() {
    const avaliacaoId = document.getElementById("avaliacaoId").value;

    if (!avaliacaoId) {
        alert("Nenhum avaliacao selecionado para exclusão.");
        return;
    }

    const confirmacao = confirm("Tem certeza de que deseja excluir este avaliacao?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${API_URL_AVALIACAOS}/${avaliacaoId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Avaliacao excluído com sucesso!");
            limparFormulario();
        } else {
            alert("Erro ao excluir avaliacao. Verifique se o avaliacao ainda existe.");
        }
    } catch (error) {
        console.error("Erro ao excluir avaliacao:", error);
        alert("Erro inesperado ao excluir avaliacao. Por favor, tente novamente.");
    }
}



document.addEventListener("DOMContentLoaded", inicializarPagina);
document.getElementById("avaliacaoForm").addEventListener("submit", salvarAvaliacao);
