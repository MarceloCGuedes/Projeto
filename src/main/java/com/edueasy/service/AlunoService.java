package com.edueasy.service;

import com.edueasy.model.Aluno;
import com.edueasy.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    public Aluno salvarAluno(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }

    public Optional<Aluno> buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id);
    }

    public Aluno atualizarAluno(Long id, Aluno alunoAtualizado) {
        return alunoRepository.findById(id).map(aluno -> {
            alunoAtualizado.setAlunoId(aluno.getAlunoId());
            return alunoRepository.save(alunoAtualizado);
        }).orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
    }

    public void deletarAluno(Long id) {
        if (alunoRepository.existsById(id)) {
            alunoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Aluno não encontrado!");
        }
    }

    public List<Aluno> buscarAlunosPorNomeETurma(String nome, Long turmaId) {
        return alunoRepository.findByNomeContainingIgnoreCaseAndTurmaId(nome, turmaId);
    }
    

}
