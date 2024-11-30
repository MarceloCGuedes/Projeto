package com.edueasy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.edueasy.conf.SelectedTurma;

@Entity
@Table(name = "avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long avaliacaoId;

    @NotBlank(message = "Nome da avaliacao é obrigatório")
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

    
    @Column(nullable = false) // A nota é obrigatória
    @Min(0) @Max(10) // Ajuste o intervalo conforme a necessidade
    private Double nota;
     

    // Getters e Setters
    public Long getAvaliacaoId() {
        return avaliacaoId;
    }

    public void setAvaliacaoId(Long avaliacaoId) {
        this.avaliacaoId = avaliacaoId;
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


    public Double getNota() {
        return nota;
    }
    
    public void setNota(Double nota) {
        this.nota = nota;
    }

}

