;(function () {
    "use strict";

    // Seletores
    const addItem = document.querySelector('.add-item');
    const cancelarBtn = document.querySelector('.cancelar-btn');
    const salvarBtn = document.querySelector('.salvar-btn');
    const inputTitulo = document.getElementById('editarTitulo');
    const areaDescricao = document.getElementById('descricaoTarefa');
    const formItem = document.getElementById('form-item');
    const listaTarefas = document.querySelector('.listaDeTarefas');

    let indexEditando = null;
    let arrTarefas = [];

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
        } else if (indexEditando !== null) { salvarItemEditado();
        } else { addNovaTarefa(inputTitulo.value, areaDescricao.value); }

        fecharFormulario();
    });

    inputTitulo.addEventListener('input', () => { 
        inputTitulo.classList.remove('alerta'); 
        inputTitulo.placeholder = "Título...";
    })

    cancelarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        inputTitulo.classList.remove('alerta');
        inputTitulo.placeholder = "Título...";

        fecharFormulario();
    });

    listaTarefas.addEventListener('click', (e) => {
        const itemAtual = e.target.closest('li');
        if (!itemAtual) return;

        const index = parseInt(itemAtual.dataset.index, 10);
        const funcao = e.target.getAttribute('data-function');

        switch (funcao) {
            case 'check-btn':
                alternarCheck(index, itemAtual);
                break;
            case 'excluir-btn':
                removerItem(index);
                break;
            case 'edit-btn':
                editarItem(index);
                break;
        }
    });

    // Funções para a Renderização das Tarefas
    function gerarTarefaLi(obj, index) {
        const item = document.createElement('li');
        item.classList.add('item-lista');
        item.dataset.index = index;

        item.innerHTML = `
            <button class="check-btn" data-function="check-btn">
                <i class="check-btn-i fa-solid fa-check ${obj.completo ? '' : 'displayNone'}" data-function="check-btn"></i>
            </button>
            <p class="item-p" data-function="edit-btn">${obj.titulo}</p>
            <i class="fa-regular fa-trash-can excluir-btn" data-function="excluir-btn"></i>
        `;

        return item;
    }

    function mostrarTarefasNaTela() {
        listaTarefas.innerHTML = '';
        arrTarefas.forEach((task, index) => {
            listaTarefas.appendChild(gerarTarefaLi(task, index));
        });
    }

    // Funções para a Manipulação das Tarefas
    function addNovaTarefa(titulo, descricao) {
        arrTarefas.push({
            titulo,
            descricao,
            dataCriacao: Date.now(),
            completo: false
        });
        salvarNoLocalStorage();
        mostrarTarefasNaTela();
    }

    function removerItem(index) {
        arrTarefas.splice(index, 1);
        salvarNoLocalStorage();
        mostrarTarefasNaTela();
    }

    function editarItem(index) {
        indexEditando = index;
        inputTitulo.value = arrTarefas[index].titulo;
        areaDescricao.value = arrTarefas[index].descricao;
        abrirFormulario();
    }

    function salvarItemEditado() {
        arrTarefas[indexEditando].titulo = inputTitulo.value;
        arrTarefas[indexEditando].descricao = areaDescricao.value;
        indexEditando = null;
        salvarNoLocalStorage();
        mostrarTarefasNaTela();
    }

    function alternarCheck(index, itemAtual) {
        arrTarefas[index].completo = !arrTarefas[index].completo;
        const checkIcon = itemAtual.querySelector('.check-btn-i');
        const texto = itemAtual.querySelector('.item-p');
        checkIcon.classList.toggle('displayNone', !arrTarefas[index].completo);
        texto.classList.toggle('tarefa-concluida', arrTarefas[index].completo);
        salvarNoLocalStorage();
    }

    // Funções dos Formulário 
    function abrirFormulario() {
        formItem.style.display = 'flex';
        inputTitulo.focus();
    }

    function fecharFormulario() {
        formItem.style.display = 'none';
        inputTitulo.value = '';
        areaDescricao.value = '';
        indexEditando = null;
    }

    // Funções de localStorage
    function salvarNoLocalStorage() { localStorage.setItem('tarefas', JSON.stringify(arrTarefas)); }

    function carregarDoLocalStorage() {
        const dados = localStorage.getItem('tarefas');

        if (dados) {
            arrTarefas = JSON.parse(dados);
        } else {
            arrTarefas = [
                {
                    titulo: "Exemplo",
                    descricao: "Esta é uma tarefa de exemplo. Você pode marcar como concluída, editar seu título ou descrição e também excluí-la. Experimente interagir com os botões para ver como funciona a lista de tarefas.",
                    dataCriacao: Date.now(),
                    completo: false
                }
            ];
            salvarNoLocalStorage();
        }
    }

    // Inicialização do Sistema
    carregarDoLocalStorage();
    mostrarTarefasNaTela();
})();