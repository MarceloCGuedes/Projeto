package com.edueasy.service;

import com.edueasy.model.Disciplina;
import com.edueasy.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Disciplina salvarDisciplina(Disciplina disciplina) {
        return disciplinaRepository.save(disciplina);
    }

    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    public Optional<Disciplina> buscarDisciplinaPorId(Long id) {
        return disciplinaRepository.findById(id);
    }

    public Disciplina atualizarDisciplina(Long id, Disciplina disciplinaAtualizado) {
        return disciplinaRepository.findById(id).map(disciplina -> {
            disciplinaAtualizado.setDisciplinaId(disciplina.getDisciplinaId());
            return disciplinaRepository.save(disciplinaAtualizado);
        }).orElseThrow(() -> new RuntimeException("Disciplina não encontrado!"));
    }

    public void deletarDisciplina(Long id) {
        if (disciplinaRepository.existsById(id)) {
            disciplinaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Disciplina não encontrado!");
        }
    }

    public List<Disciplina> buscarDisciplinasPorNomeETurma(String nome, Long turmaId) {
        return disciplinaRepository.findByNomeContainingIgnoreCaseAndTurmaId(nome, turmaId);
    }
    

}
