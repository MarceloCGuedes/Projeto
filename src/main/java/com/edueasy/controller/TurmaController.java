package com.edueasy.controller;

import com.edueasy.model.Turma;
import com.edueasy.service.TurmaService;
import com.edueasy.conf.SelectedTurma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turma")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @GetMapping
    public List<Turma> listarTurmas() {
        return turmaService.listarTurmas();
    }

    @PostMapping("/selecionar")
    public String selecionarTurma(@RequestBody Long turmaId) {
        Turma turma = turmaService.buscarTurmaPorId(turmaId);
        SelectedTurma.setTurmaSelecionada(turma);
        return "Turma selecionada: " + turma.getNome();
    }

    @GetMapping("/selecionada")
    public Turma obterTurmaSelecionada() {
        Turma turma = SelectedTurma.getTurmaSelecionada();
        if (turma == null) {
            throw new RuntimeException("Nenhuma turma foi selecionada.");
        }
        return turma;
    }
}
