// scripts/lista.js
import tarefasService from './tarefas-service.js';
import { auth, onAuthStateChanged } from './firebase.js';

(function () {
    "use strict";

    // Seletores
    const addItem = document.querySelector('.add-item');
    const cancelarBtn = document.querySelector('.cancelar-btn');
    const salvarBtn = document.querySelector('.salvar-btn');
    const inputTitulo = document.getElementById('editarTitulo');
    const areaDescricao = document.getElementById('descricaoTarefa');
    const formItem = document.getElementById('form-item');
    const listaTarefas = document.querySelector('.listaDeTarefas');
    const editarOuSalvar = document.getElementById('editar-salvar');
    const temaBtnContainer = document.querySelector('.toggle-tema-container');
    const temaBtn = document.getElementById('tema-btn');
    const imgIndicador = document.getElementById('img-indicador');
    const imgTema = document.getElementById('img-tema');
    const temaSalvo = localStorage.getItem('tema');

    let tarefaEditandoId = null;
    let arrTarefas = [];

    // Tarefa Exemplo
    async function adicionarTarefaExemplo() {
        const tarefaExemplo = {
            titulo: "Exemplo",
            descricao: "Esta é uma tarefa de exemplo. Você pode marcar como concluída, editar seu título ou descrição e também excluí-la. Experimente interagir com os botões para ver como funciona a lista de tarefas.",
            dataCriacao: Date.now(),
            completo: false
        };

        try {
            await tarefasService.adicionarTarefa(tarefaExemplo);
        } catch (error) {
            console.error("Erro ao adicionar tarefa de exemplo:", error);
        }
    }

    // Inicializar observação de tarefas
    function inicializarTarefas() {
        tarefasService.observarTarefas(async (tarefas) => {
            arrTarefas = tarefas;

            // Se não tiver nenhuma tarefa, adiciona a tarefa de exemplo
            if (arrTarefas.length === 0) {
                await adicionarTarefaExemplo();
                // Recarrega as tarefas depois de adicionar
                tarefasService.observarTarefas((novasTarefas) => {
                    arrTarefas = novasTarefas;
                    mostrarTarefasNaTela();
                });
            } else {
                mostrarTarefasNaTela();
            }
        });
    }


    // Eventos
    addItem.addEventListener('click', () => { abrirFormulario(); });

    salvarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if(!inputTitulo.value.trim()){ 
            inputTitulo.classList.remove('alerta');
            void inputTitulo.offsetWidth;
            inputTitulo.classList.add('alerta'); 

            inputTitulo.placeholder = "Por favor, preencha o Título!";
            inputTitulo.focus()
            return;
        } else if (tarefaEditandoId !== null) { 
            salvarItemEditado();
        } else {  
            addNovaTarefa(inputTitulo.value, areaDescricao.value); 
        }

        fecharFormulario();
    });

    inputTitulo.addEventListener('input', () => { limparAlerta() })
    areaDescricao.addEventListener('focus', () => { limparAlerta() })

    cancelarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputTitulo.classList.remove('alerta');
        inputTitulo.placeholder = "Título...";
        fecharFormulario();
    });

    temaBtnContainer.addEventListener('click', () => {
        const temaAtual = document.documentElement.getAttribute('data-tema');
        const novoTema = temaAtual === 'light' ? 'dark' : 'light';
        aplicarTema(novoTema);
        temaBtn.classList.toggle('tema-ativado');
    });

    listaTarefas.addEventListener('click', (e) => {
        const itemAtual = e.target.closest('li');
        if (!itemAtual) return;

        const tarefaId = itemAtual.dataset.id;
        const funcao = e.target.getAttribute('data-function');

        switch (funcao) {
            case 'check-btn':
                alternarCheck(tarefaId, itemAtual);
                break;
            case 'excluir-btn':
                removerItem(tarefaId);
                break;
            case 'edit-btn':
                editarItem(tarefaId);
                break;
        }
    });

    // Funções para a Renderização das Tarefas
    function gerarTarefaLi(obj) {
        console.log('Criando li para tarefa:', obj);


        const item = document.createElement('li');
        item.classList.add('item-lista');
        item.dataset.id = obj.id;

        item.innerHTML = `
            <button class="check-btn ${obj.completo ? 'tarefa-concluida' : ''}" data-function="check-btn">
                <i class="check-btn-i fa-solid fa-check ${obj.completo ? '' : 'displayNone'}" data-function="check-btn"></i>
            </button>
            <p class="item-p ${obj.completo ? 'tarefa-concluida' : ''}" data-function="edit-btn">
                ${obj.titulo}
            </p>
            <i class="fa-regular fa-trash-can excluir-btn" data-function="excluir-btn"></i>
        `;

        return item;
    }

    function mostrarTarefasNaTela() {
        console.log('Mostrar tarefas:', arrTarefas);

        listaTarefas.innerHTML = '';
        
        // if (arrTarefas.length === 0) {
        //     listaTarefas.innerHTML = `
        //         <li class="item-lista vazio">
        //             <p class="item-p">Nenhuma tarefa encontrada. Que a Força esteja com suas novas tarefas!</p>
        //         </li>
        //     `;
        //     return;
        // }

        arrTarefas.forEach((task) => {
            listaTarefas.appendChild(gerarTarefaLi(task));
        });
    }

    // Funções para a Manipulação das Tarefas
    async function addNovaTarefa(titulo, descricao) {
        try {
            await tarefasService.adicionarTarefa({
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                completo: false
            });
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert('Erro ao adicionar tarefa. Tente novamente.');
        }
    }

    async function removerItem(tarefaId) {
        // if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await tarefasService.excluirTarefa(tarefaId);
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
                alert('Erro ao excluir tarefa. Tente novamente.');
            }
        // }
    }

    function editarItem(tarefaId) {
        const tarefa = arrTarefas.find(t => t.id === tarefaId);
        if (tarefa) {
            tarefaEditandoId = tarefaId;
            inputTitulo.value = tarefa.titulo;
            areaDescricao.value = tarefa.descricao || '';
            abrirFormulario();
        }
    }

    async function salvarItemEditado() {
        try {
            await tarefasService.atualizarTarefa(tarefaEditandoId, {
                titulo: inputTitulo.value.trim(),
                descricao: areaDescricao.value.trim()
            });
            tarefaEditandoId = null;
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
            alert('Erro ao editar tarefa. Tente novamente.');
        }
    }

    async function alternarCheck(tarefaId, itemAtual) {
        const tarefa = arrTarefas.find(t => t.id === tarefaId);
        if (!tarefa) return;

        const novoEstado = !tarefa.completo;
        
        try {
            await tarefasService.atualizarTarefa(tarefaId, {
                completo: novoEstado
            });
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Erro ao atualizar tarefa. Tente novamente.');
        }
    }

    // Funções para manipulação dos formulários
    function abrirFormulario() {
        formItem.style.display = 'flex';
        inputTitulo.focus();
        
        if (tarefaEditandoId !== null) { 
            editarOuSalvar.textContent = "Editar Tarefa"; 
        } else { 
            editarOuSalvar.textContent = "Salvar Tarefa"; 
        }
    }

    function fecharFormulario() {
        formItem.style.display = 'none';
        inputTitulo.value = '';
        areaDescricao.value = '';
        tarefaEditandoId = null;
        limparAlerta();
    }

    function limparAlerta(){
        inputTitulo.classList.remove('alerta'); 
        inputTitulo.placeholder = "Título...";
    }

    // Função para aplicar tema e trocar ícone
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-tema', tema);
        imgIndicador.classList.add('fade-out');
        imgTema.classList.add('fade-out')

        setTimeout(() => {
            imgIndicador.src = tema === 'dark' ? 'images/imperio-icon.png' : 'images/jedi-icon.png';
            imgIndicador.classList.remove('fade-out');
            imgIndicador.classList.add('fade-in');

            imgTema.src = tema === 'dark' ? 'images/vader-icon.png' : 'images/yoda-icon.png';
            imgTema.classList.remove('fade-out');
            imgTema.classList.add('fade-in');

            setTimeout(() => { 
                imgIndicador.classList.remove('fade-in'),
                imgTema.classList.remove('fade-in')
            }, 500);
        }, 150);

        localStorage.setItem('tema', tema);
    }

    // Define tema inicial
    if (temaSalvo) { 
        aplicarTema(temaSalvo); 
    } else { 
        aplicarTema(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); 
    }

    // Inicialização
    // document.addEventListener('DOMContentLoaded', () => {
    //     inicializarTarefas();
    // });

    document.addEventListener('DOMContentLoaded', () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                inicializarTarefas();
            } else {
                // redirecionar para login ou mostrar mensagem
                window.location.href = 'login.html';
            }
        });
    });

})();