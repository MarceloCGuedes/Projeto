package com.edueasy.repository;

import com.edueasy.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByNomeContainingIgnoreCaseAndTurmaId(String nome, Long turmaId);
    List<Avaliacao> findByTurmaId(Long turmaId);
}


