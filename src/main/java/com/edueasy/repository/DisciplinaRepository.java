package com.edueasy.repository;

import com.edueasy.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    List<Disciplina> findByNomeContainingIgnoreCaseAndTurmaId(String nome, Long turmaId);
}

