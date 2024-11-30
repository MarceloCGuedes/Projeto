const turmaSelect = document.getElementById("turmaSelect");
const executarBtn = document.getElementById("executarBtn");

// Carregar turmas do backend
function carregarTurmas() {
    fetch("http://localhost:8084/api/turma")
        .then(response => response.json())
        .then(turmas => {
            turmaSelect.innerHTML = '<option value="" disabled selected>Selecione uma turma</option>';
            turmas.forEach(turma => {
                const option = document.createElement("option");
                option.value = turma.id; // ID da turma
                option.textContent = turma.nome; // Nome da turma
                turmaSelect.appendChild(option);
            });
            executarBtn.disabled = false;
        })
        .catch(error => {
            console.error("Erro ao carregar turmas:", error);
            alert("Não foi possível carregar as turmas. Tente novamente mais tarde.");
        });
}

// Enviar turma selecionada para o backend
executarBtn.addEventListener("click", () => {
    const turmaId = turmaSelect.value;

    if (!turmaId) {
        alert("Por favor, selecione uma turma antes de continuar.");
        return;
    }

    fetch("http://localhost:8084/api/turma/selecionar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Number(turmaId))
    })
        .then(() => {
            window.location.href = "EduEasy.html"; // Redireciona para a página principal
        })
        .catch(error => {
            console.error("Erro ao selecionar a turma:", error);
            alert("Não foi possível selecionar a turma. Tente novamente.");
        });
});

// Carregar turmas ao iniciar a página
carregarTurmas();
