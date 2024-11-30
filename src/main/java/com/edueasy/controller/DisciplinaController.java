package com.edueasy.controller;

import com.edueasy.model.Disciplina;
import com.edueasy.service.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplina")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @PostMapping
    public ResponseEntity<?> criarDisciplina(@Valid @RequestBody Disciplina disciplina) {
        try {
            Disciplina novoDisciplina = disciplinaService.salvarDisciplina(disciplina);
            return ResponseEntity.ok(novoDisciplina);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar disciplina: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarDisciplinas() {
        try {
            List<Disciplina> disciplinas = disciplinaService.listarDisciplinas();
            return ResponseEntity.ok(disciplinas);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao listar disciplinas: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarDisciplinaPorId(@PathVariable Long id) {
        try {
            return disciplinaService.buscarDisciplinaPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar disciplina: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarDisciplina(@PathVariable Long id, @Valid @RequestBody Disciplina disciplina) {
        try {
            Disciplina disciplinaAtualizado = disciplinaService.atualizarDisciplina(id, disciplina);
            return ResponseEntity.ok(disciplinaAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar disciplina: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarDisciplina(@PathVariable Long id) {
        try {
            disciplinaService.deletarDisciplina(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao excluir disciplina: " + e.getMessage());
        }
    }

    @GetMapping("/buscarPorNomeETurma")
    public ResponseEntity<?> buscarDisciplinasPorNomeETurma(@RequestParam String nome, @RequestParam Long turmaId) {
        try {
            List<Disciplina> disciplinas = disciplinaService.buscarDisciplinasPorNomeETurma(nome, turmaId);
            if (disciplinas.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(disciplinas);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar disciplinas por nome e turma: " + e.getMessage());
        }
    }
    
}