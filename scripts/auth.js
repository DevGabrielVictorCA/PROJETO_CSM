// scripts/auth.js
import { auth, onAuthStateChanged, signOut } from "./firebase.js";

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
});

// Verifica se o usuário está logado
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        const currentPage = window.location.pathname;

        if (!user) {
            // Evita redirecionamento infinito se já estiver na página de login
            if (!currentPage.endsWith('index.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // loadUserData(user);
        }
    });
}

// Carrega dados do usuário no DOM
// function loadUserData(user) {
//     const perfilUsuario = document.querySelector('.perfil-usuario');
//     if (perfilUsuario) {
//         const displayName = user.displayName || user.email.split('@')[0];
//         perfilUsuario.textContent = displayName;
//         perfilUsuario.title = user.email;
//     }
// }

// Logout do usuário
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Erro ao sair:', error);
            alert('Erro ao sair. Tente novamente.');
        });
}

// Torna a função logout acessível globalmente
window.logout = logout;
