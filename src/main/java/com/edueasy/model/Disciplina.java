package com.edueasy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.edueasy.conf.SelectedTurma;

@Entity
@Table(name = "disciplina")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long disciplinaId;

    @NotBlank(message = "Nome da disciplina é obrigatório")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
    private String nome;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false) // Define o relacionamento com a tabela "turma"
    private Turma turma;

    // Método de callback para preencher automaticamente a turma antes de salvar
    @PrePersist
    @PreUpdate
    private void definirTurmaAutomatica() {
        if (SelectedTurma.getTurmaSelecionada() != null) {
            this.turma = SelectedTurma.getTurmaSelecionada();
        }
    }

    // Getters e Setters
    public Long getDisciplinaId() {
        return disciplinaId;
    }

    public void setDisciplinaId(Long disciplinaId) {
        this.disciplinaId = disciplinaId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}

