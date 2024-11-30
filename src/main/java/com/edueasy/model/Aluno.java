package com.edueasy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import com.edueasy.conf.SelectedTurma;

@Entity
@Table(name = "aluno")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alunoId;

    @NotBlank(message = "Nome do aluno é obrigatório")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
    private String nome;

    private LocalDate dataNascimento;

    @Email(message = "Email inválido")
    @Size(max = 150, message = "O email deve ter no máximo 150 caracteres")
    private String email;

    @Size(max = 15, message = "O telefone deve ter no máximo 15 caracteres")
    private String telefone;

    @Size(max = 150, message = "O nome do responsável deve ter no máximo 150 caracteres")
    private String nomeResponsavel;

    @Size(max = 15, message = "O telefone do responsável deve ter no máximo 15 caracteres")
    private String telefoneResponsavel;

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
    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getTelefoneResponsavel() {
        return telefoneResponsavel;
    }

    public void setTelefoneResponsavel(String telefoneResponsavel) {
        this.telefoneResponsavel = telefoneResponsavel;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}

