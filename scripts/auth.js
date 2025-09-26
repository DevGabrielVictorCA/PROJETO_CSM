// scripts/auth.js
import { auth, onAuthStateChanged, signOut } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
});

// Verifica se o usuário está logado
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            loadUserData(user);
        }
    });
}

// Carrega dados do usuário
function loadUserData(user) {
    const perfilUsuario = document.querySelector('.perfil-usuario');
    if (perfilUsuario) {
        // const displayName = user.displayName || user.email.split('@')[0];
        perfilUsuario.textContent = displayName;
        perfilUsuario.title = user.email;
    }
}

// Logout
function logout() {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Erro ao sair:', error);
        alert('Erro ao sair. Tente novamente.');
    });
}

// Exportar para escopo global
window.logout = logout;