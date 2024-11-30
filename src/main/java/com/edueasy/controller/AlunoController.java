package com.edueasy.controller;

import com.edueasy.model.Aluno;
import com.edueasy.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @PostMapping
    public ResponseEntity<?> criarAluno(@Valid @RequestBody Aluno aluno) {
        try {
            Aluno novoAluno = alunoService.salvarAluno(aluno);
            return ResponseEntity.ok(novoAluno);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar aluno: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarAlunos() {
        try {
            List<Aluno> alunos = alunoService.listarAlunos();
            return ResponseEntity.ok(alunos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao listar alunos: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarAlunoPorId(@PathVariable Long id) {
        try {
            return alunoService.buscarAlunoPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar aluno: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAluno(@PathVariable Long id, @Valid @RequestBody Aluno aluno) {
        try {
            Aluno alunoAtualizado = alunoService.atualizarAluno(id, aluno);
            return ResponseEntity.ok(alunoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar aluno: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAluno(@PathVariable Long id) {
        try {
            alunoService.deletarAluno(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao excluir aluno: " + e.getMessage());
        }
    }

    @GetMapping("/buscarPorNomeETurma")
    public ResponseEntity<?> buscarAlunosPorNomeETurma(@RequestParam String nome, @RequestParam Long turmaId) {
        try {
            List<Aluno> alunos = alunoService.buscarAlunosPorNomeETurma(nome, turmaId);
            if (alunos.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(alunos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar alunos por nome e turma: " + e.getMessage());
        }
    }
    
}