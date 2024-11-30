package com.edueasy.conf;

import com.edueasy.model.Turma;

public class SelectedTurma {

    private static Turma turmaSelecionada;

    public static Turma getTurmaSelecionada() {
        return turmaSelecionada;
    }

    public static void setTurmaSelecionada(Turma turma) {
        turmaSelecionada = turma;
    }
}
