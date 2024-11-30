package com.edueasy.service;

import com.edueasy.model.Avaliacao;
import com.edueasy.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    /**
     * Salva uma nova avaliação após validação.
     */
    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        if (avaliacao.getNota() > 10) {
            throw new IllegalArgumentException("A nota de uma avaliação não pode ser maior que 10.");
        }

        double somaNotas = avaliacaoRepository.findByTurmaId(avaliacao.getTurma().getId()).stream()
                .mapToDouble(Avaliacao::getNota)
                .sum();

        if (somaNotas + avaliacao.getNota() > 10) {
            throw new IllegalArgumentException(
                "A soma das notas de todas as avaliações desta turma não pode ser maior que 10."
            );
        }

        return avaliacaoRepository.save(avaliacao);
    }

    /**
     * Lista todas as avaliações.
     */
    public List<Avaliacao> listarAvaliacaos() {
        return avaliacaoRepository.findAll();
    }

    /**
     * Busca uma avaliação por ID.
     */
    public Optional<Avaliacao> buscarAvaliacaoPorId(Long id) {
        return avaliacaoRepository.findById(id);
    }

    /**
     * Atualiza uma avaliação existente.
     */
    public Avaliacao atualizarAvaliacao(Long id, Avaliacao avaliacaoAtualizado) {
        return avaliacaoRepository.findById(id).map(avaliacao -> {
            avaliacaoAtualizado.setAvaliacaoId(avaliacao.getAvaliacaoId());
            return avaliacaoRepository.save(avaliacaoAtualizado);
        }).orElseThrow(() -> new RuntimeException("Avaliação não encontrada!"));
    }

    /**
     * Deleta uma avaliação por ID.
     */
    public void deletarAvaliacao(Long id) {
        if (avaliacaoRepository.existsById(id)) {
            avaliacaoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Avaliação não encontrada!");
        }
    }

    /**
     * Busca avaliações por nome e turma.
     */
    public List<Avaliacao> buscarAvaliacaosPorNomeETurma(String nome, Long turmaId) {
        return avaliacaoRepository.findByNomeContainingIgnoreCaseAndTurmaId(nome, turmaId);
    }

    /**
     * Lista as avaliações filtradas por turma.
     */
    public List<Avaliacao> listarAvaliacoesPorTurma(Long turmaId) {
        return avaliacaoRepository.findByTurmaId(turmaId);
    }
}
