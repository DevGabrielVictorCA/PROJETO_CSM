;(function(){
    "use strict"

    const inputTitulo = document.getElementById('input-titulo');
    const formAdd = document.getElementById('form-add');
    const listaTarefas = document.querySelector('.listaDeTarefas');
    const itensLista = listaTarefas.getElementsByTagName('li');

    // Eventos:

    // Adicionar itens na lista
    formAdd.addEventListener('submit', function(e){
        e.preventDefault()
        if(!inputTitulo.value){console.log('preencha');}
        else{
            novoItem(inputTitulo.value)
            inputTitulo.value = '';
            inputTitulo.focus()
        }
    });


    // Eventos em cada item da lista
    [...itensLista].forEach(item => {
        item.addEventListener('click', function(e){
            // console.log(this);
        })
    });

    //Remover itens da lista
    listaTarefas.addEventListener('click', function(e){
        if(e.target && e.target.classList.contains('excluir-btn')){
            const item = e.target.closest('li');
            item.remove();
        }
    });

    // Funções:
    
    function novoItem(task){
        let item = document.createElement('li');
        item.innerHTML =  
        `<li class="item-lista">
            <p class="item-p">${task}</p>
            <button class="excluir-btn">x</button>
        </li>`;
        listaTarefas.appendChild(item);
    }
})()