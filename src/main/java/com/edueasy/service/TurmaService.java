package com.edueasy.service;

import com.edueasy.model.Turma;
import com.edueasy.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    // Listar todas as turmas
    public List<Turma> listarTurmas() {
        return turmaRepository.findAll();
    }

    // Buscar uma turma pelo ID
    public Turma buscarTurmaPorId(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com o ID: " + id));
    }

    // Salvar uma nova turma
    public Turma salvarTurma(Turma turma) {
        return turmaRepository.save(turma);
    }

    // Atualizar uma turma existente
    public Turma atualizarTurma(Long id, Turma turmaAtualizada) {
        Turma turma = buscarTurmaPorId(id);
        turma.setNome(turmaAtualizada.getNome());
        return turmaRepository.save(turma);
    }

    // Deletar uma turma pelo ID
    public void deletarTurma(Long id) {
        if (!turmaRepository.existsById(id)) {
            throw new RuntimeException("Turma não encontrada para exclusão.");
        }
        turmaRepository.deleteById(id);
    }
}
