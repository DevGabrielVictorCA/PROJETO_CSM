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

    getTarefasCollection() {
        if (!this.userId) throw new Error('Usuário não autenticado');
        return collection(db, 'users', this.userId, 'tarefas');
    }

    observarTarefas(callback) {
        if (!this.userId) return;

        if (this.unsubscribe) this.unsubscribe();

        const q = query(this.getTarefasCollection(), orderBy('dataCriacao', 'desc'));

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            const tarefas = [];
            snapshot.forEach((doc) => {
                tarefas.push({ id: doc.id, ...doc.data() });
            });
            callback(tarefas);
        }, (error) => {
            console.error('Erro ao observar tarefas:', error);
        });
    }

    async adicionarTarefa(tarefa) {
        const docRef = await addDoc(this.getTarefasCollection(), {
            ...tarefa,
            dataCriacao: Date.now()
        });
        return docRef.id;
    }

    async atualizarTarefa(tarefaId, dadosAtualizados) {
        const tarefaRef = doc(this.getTarefasCollection(), tarefaId);
        await updateDoc(tarefaRef, dadosAtualizados);
    }

    async excluirTarefa(tarefaId) {
        const tarefaRef = doc(this.getTarefasCollection(), tarefaId);
        await deleteDoc(tarefaRef);
    }

    pararObservacao() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}

export default new TarefasService();
