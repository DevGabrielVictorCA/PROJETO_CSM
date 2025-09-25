// scripts/auth.js - Verificação de autenticação para lista.html

// Configuração do Firebase para auth.js
const firebaseConfig = {
    apiKey: "AIzaSyAAse8fcxMntSDgI4ssrKVcuS14TIcxqYo",
    authDomain: "star-wars-list-b450b.firebaseapp.com",
    projectId: "star-wars-list-b450b",
    storageBucket: "star-wars-list-b450b.firebasestorage.app",
    messagingSenderId: "1078874247193",
    appId: "1:1078874247193:web:5ab3e99fcf561140dcda88"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Verificar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
});

// Função para verificar o estado de autenticação
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // Usuário não está logado, redirecionar para index.html
            console.log('Usuário não autenticado, redirecionando...');
            window.location.href = 'index.html';
        } else {
            // Usuário logado, carregar dados do usuário
            console.log('Usuário autenticado:', user.email);
            loadUserData(user);
        }
    });
}

// Função para carregar dados do usuário
function loadUserData(user) {
    // Atualizar perfil do usuário na interface
    const perfilUsuario = document.querySelector('.perfil-usuario');
    if (perfilUsuario) {
        // Usar o email ou tentar obter o nome de exibição
        //const displayName = user.displayName || user.email.split('@')[0];
        perfilUsuario.textContent = displayName;
        perfilUsuario.title = user.email;
    }
}

// Função de logout
function logout() {
    auth.signOut().then(() => {
        console.log('Logout realizado com sucesso');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao sair. Tente novamente.');
    });
}

// Expor a função logout globalmente
window.logout = logout;