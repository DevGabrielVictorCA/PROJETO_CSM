// scripts/tarefas-service.js
import { 
    db, 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    deleteDoc, 
    doc, 
    updateDoc,
    orderBy 
} from "./firebase.js";

import { auth, onAuthStateChanged } from "./firebase.js";

class TarefasService {
    constructor() {
        this.userId = null;
        this.unsubscribe = null;
        this.initAuthListener();
    }

    // Inicializar listener de autenticação
    initAuthListener() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid;
            } else {
                this.userId = null;
                this.pararObservacao();
            }
        });
    }

    // Obter referência da coleção de tarefas do usuário
    getTarefasCollection() {
        if (!this.userId) {
            throw new Error('Usuário não autenticado');
        }
        return collection(db, 'users', this.userId, 'tarefas');
    }

    // Ouvir mudanças nas tarefas em tempo real
    observarTarefas(callback) {
        if (!this.userId) {
            console.log('Aguardando autenticação...');
            return;
        }

        // Cancelar observação anterior se existir
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        const q = query(
            this.getTarefasCollection(), 
            orderBy('dataCriacao', 'desc')
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            const tarefas = [];
            snapshot.forEach((doc) => {
                tarefas.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(tarefas);
        }, (error) => {
            console.error('Erro ao observar tarefas:', error);
        });
    }

    // Adicionar nova tarefa
    async adicionarTarefa(tarefa) {
        try {
            const docRef = await addDoc(this.getTarefasCollection(), {
                ...tarefa,
                dataCriacao: Date.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            throw error;
        }
    }

    // Atualizar tarefa existente
    async atualizarTarefa(tarefaId, dadosAtualizados) {
        try {
            const tarefaRef = doc(this.getTarefasCollection(), tarefaId);
            await updateDoc(tarefaRef, dadosAtualizados);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            throw error;
        }
    }

    // Excluir tarefa
    async excluirTarefa(tarefaId) {
        try {
            const tarefaRef = doc(this.getTarefasCollection(), tarefaId);
            await deleteDoc(tarefaRef);
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            throw error;
        }
    }

    // Parar de observar tarefas
    pararObservacao() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}

export default new TarefasService();