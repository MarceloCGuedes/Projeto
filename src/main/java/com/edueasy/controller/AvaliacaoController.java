package com.edueasy.controller;

import com.edueasy.model.Avaliacao;
import com.edueasy.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacao")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    // Criar nova avaliação
    @PostMapping
    public ResponseEntity<?> criarAvaliacao(@Valid @RequestBody Avaliacao avaliacao) {
        try {
            if (avaliacao.getNota() == null) {
                return ResponseEntity.badRequest().body("Nota é obrigatória.");
            }
            Avaliacao novaAvaliacao = avaliacaoService.salvarAvaliacao(avaliacao);
            return ResponseEntity.ok(novaAvaliacao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao criar avaliação: " + e.getMessage());
        }
    }

    // Buscar avaliação por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarAvaliacaoPorId(@PathVariable Long id) {
        try {
            return avaliacaoService.buscarAvaliacaoPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar avaliação: " + e.getMessage());
        }
    }

    // Atualizar avaliação
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAvaliacao(@PathVariable Long id, @Valid @RequestBody Avaliacao avaliacao) {
        try {
            Avaliacao avaliacaoAtualizada = avaliacaoService.atualizarAvaliacao(id, avaliacao);
            return ResponseEntity.ok(avaliacaoAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar avaliação: " + e.getMessage());
        }
    }

    // Excluir avaliação
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAvaliacao(@PathVariable Long id) {
        try {
            avaliacaoService.deletarAvaliacao(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao excluir avaliação: " + e.getMessage());
        }
    }

    // Buscar avaliações por nome e turma
    @GetMapping("/buscarPorNomeETurma")
    public ResponseEntity<?> buscarAvaliacaosPorNomeETurma(@RequestParam String nome, @RequestParam Long turmaId) {
        try {
            List<Avaliacao> avaliacaos = avaliacaoService.buscarAvaliacaosPorNomeETurma(nome, turmaId);
            if (avaliacaos.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(avaliacaos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar avaliações por nome e turma: " + e.getMessage());
        }
    }

    // Listar avaliações por turma
    @GetMapping
    public ResponseEntity<List<Avaliacao>> listarAvaliacoesPorTurma(@RequestParam Long turmaId) {
        try {
            List<Avaliacao> avaliacoes = avaliacaoService.listarAvaliacoesPorTurma(turmaId);
            return ResponseEntity.ok(avaliacoes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
