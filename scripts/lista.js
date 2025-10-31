import tarefasService from './tarefas-service.js';
import { auth, onAuthStateChanged, db, collection, getDocs, doc, getDoc } from './firebase.js';

(function () {
    "use strict";

    const addItem = document.querySelector('.add-item');
    const cancelarBtn = document.querySelector('.cancelar-btn');
    const salvarBtn = document.querySelector('.salvar-btn');
    const inputTitulo = document.getElementById('editarTitulo');
    const areaDescricao = document.getElementById('descricaoTarefa');
    const formItem = document.getElementById('form-item');
    const listaTarefas = document.querySelector('.listaDeTarefas');
    const editarOuSalvar = document.getElementById('editar-salvar');
    const categoriaSelect = document.getElementById('categoriaSelect');

    let tarefaEditandoId = null;
    let arrTarefas = [];

    // -------------------------
    // Funções auxiliares
    // -------------------------

    async function adicionarTarefaExemplo() {
        const tarefaExemplo = {
            titulo: "Tarefa Exemplo",
            descricao: "Esta é uma tarefa de exemplo. Você pode editar o título e a descrição, marcar como concluída ou excluí-la se quiser. Use-a para testar como gerenciar suas tarefas no Star Wars To-do List.\n\nQue a Força esteja com você!",
            dataCriacao: Date.now(),
            completo: false
        };
        try { await tarefasService.adicionarTarefa(tarefaExemplo); } 
        catch (error) { console.error(error); }
    }

    async function carregarCategorias() {
        categoriaSelect.innerHTML = `<option value="">Selecione uma categoria</option>`;
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        categoriasSnapshot.forEach(categoriaDoc => {
            const data = categoriaDoc.data();
            const option = document.createElement('option');
            option.value = categoriaDoc.id;
            option.textContent = data.nome;
            categoriaSelect.appendChild(option);
        });

        categoriaSelect.addEventListener('change', () => categoriaSelect.blur());
    }

    async function gerarTarefaLi(obj) {
        let nomeCategoria = '';
        if (obj.categoriaRef) {
            const categoriaDoc = await getDoc(obj.categoriaRef);
            if (categoriaDoc.exists()) nomeCategoria = categoriaDoc.data().Campo;
        }

        const item = document.createElement('li');
        item.classList.add('item-lista');
        item.dataset.id = obj.id;

        item.innerHTML = `
            <button class="check-btn ${obj.completo ? 'tarefa-concluida' : ''}" data-function="check-btn">
                <i class="check-btn-i fa-solid fa-check ${obj.completo ? '' : 'displayNone'}" data-function="check-btn"></i>
            </button>
            <p class="item-p ${obj.completo ? 'tarefa-concluida' : ''}" data-function="edit-btn">
                ${obj.titulo} ${nomeCategoria ? `<span class="categoria">[${nomeCategoria}]</span>` : ''}
            </p>
            <i class="fa-regular fa-trash-can excluir-btn" data-function="excluir-btn"></i>
        `;
        return item;
    }

    async function mostrarTarefasNaTela() {
        listaTarefas.innerHTML = '';
        const itens = await Promise.all(arrTarefas.map(gerarTarefaLi));
        itens.forEach(item => listaTarefas.appendChild(item));
    }

    function limparAlerta() {
        inputTitulo.classList.remove('alerta');
        inputTitulo.placeholder = "Título...";
    }

    function abrirFormulario() {
        formItem.style.display = 'flex';
        inputTitulo.focus();
        editarOuSalvar.textContent = tarefaEditandoId ? "Editar Tarefa" : "Salvar Tarefa";
    }

    function fecharFormulario() {
        formItem.style.display = 'none';
        inputTitulo.value = '';
        areaDescricao.value = '';
        tarefaEditandoId = null;
        categoriaSelect.value = '';
        limparAlerta();
    }

    // -------------------------
    // Eventos
    // -------------------------

    addItem.addEventListener('click', abrirFormulario);

    salvarBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!inputTitulo.value.trim()) {
            inputTitulo.classList.add('alerta');
            inputTitulo.placeholder = "Por favor, preencha o Título!";
            return;
        }

        const novaTarefa = {
            titulo: inputTitulo.value.trim(),
            descricao: areaDescricao.value.trim(),
            completo: false,
            categoriaRef: categoriaSelect.value ? doc(db, 'categorias', categoriaSelect.value) : null
        };

        try {
            if (tarefaEditandoId) {
                await tarefasService.atualizarTarefa(tarefaEditandoId, novaTarefa);
                tarefaEditandoId = null;
            } else {
                await tarefasService.adicionarTarefa(novaTarefa);
            }
            fecharFormulario();
        } catch (error) {
            console.error(error);
        }
    });

    cancelarBtn.addEventListener('click', (e) => { e.preventDefault(); fecharFormulario(); });

    listaTarefas.addEventListener('click', async (e) => {
        const itemAtual = e.target.closest('li');
        if (!itemAtual) return;

        const tarefaId = itemAtual.dataset.id;
        const funcao = e.target.getAttribute('data-function');

        switch (funcao) {
            case 'check-btn': alternarCheck(tarefaId); break;
            case 'excluir-btn': removerItem(tarefaId); break;
            case 'edit-btn': editarItem(tarefaId); break;
        }
    });

    function editarItem(tarefaId) {
        const tarefa = arrTarefas.find(t => t.id === tarefaId);
        if (!tarefa) return;

        tarefaEditandoId = tarefaId;
        inputTitulo.value = tarefa.titulo;
        areaDescricao.value = tarefa.descricao || '';
        categoriaSelect.value = tarefa.categoriaRef ? tarefa.categoriaRef.id : '';
        abrirFormulario();
    }

    async function alternarCheck(tarefaId) {
        const tarefa = arrTarefas.find(t => t.id === tarefaId);
        if (!tarefa) return;
        await tarefasService.atualizarTarefa(tarefaId, { completo: !tarefa.completo });
    }

    async function removerItem(tarefaId) {
        await tarefasService.excluirTarefa(tarefaId);
    }

    function inicializarTarefas() {
        tarefasService.observarTarefas(async (tarefas) => {
            arrTarefas = tarefas;
            if (!arrTarefas.length) await adicionarTarefaExemplo();
            mostrarTarefasNaTela();
        });
    }

    // -------------------------
    // Inicialização com autenticação
    // -------------------------

    document.addEventListener('DOMContentLoaded', async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await carregarCategorias();
                inicializarTarefas();
            } else {
                window.location.href = 'login.html';
            }
        });
    });

    // localStorage.clear()
})();
