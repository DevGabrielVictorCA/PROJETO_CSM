// scripts/migrar-tarefas.js
import { db, collection, getDocs, doc, setDoc } from './firebase.js';

export default async function migrarTarefas(user) {
    if (!user) throw new Error("Usuário não autenticado. Faça login antes de migrar.");

    const tarefasSnapshot = await getDocs(collection(db, 'tarefas'));
    for (const tarefaDoc of tarefasSnapshot.docs) {
        const dados = tarefaDoc.data();
        const novaRef = doc(db, 'users', user.uid, 'tarefas', tarefaDoc.id);
        await setDoc(novaRef, dados);
    }
    console.log('Migração concluída!');
}
