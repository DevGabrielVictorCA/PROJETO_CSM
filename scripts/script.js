(function () {
    "use strict";

    // Variáveis globais
    let recoveryCode = null;
    let recoveryEmail = null;

    // Criar estrelas para o fundo da galáxia
    function createStars() {
        const heroSection = document.getElementById('hero');
        const starsCount = 200;

        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${2 + Math.random() * 5}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;

            heroSection.appendChild(star);
        }
    }

    // Funções para o modal de login/registro
    function openModal(type) {
        const modal = document.getElementById('loginModal');
        modal.classList.remove('hidden');

        if (type === 'register') {
            showRegisterForm();
        } else if (type === 'recovery') {
            showRecoveryForm();
        } else {
            showLoginForm();
        }
    }

    function closeModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.add('hidden');
    }

    function showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('loginMessage').classList.add('hidden');
    }

    function showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('registerMessage').classList.add('hidden');
    }

    function showRecoveryForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.remove('hidden');
        document.getElementById('step1').classList.remove('hidden');
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('recoveryMessage').textContent = '';
        document.getElementById('recoveryMessage').classList.remove('text-red-500', 'text-green-500');
    }

    // Fechar modal ao clicar fora dele
    document.getElementById('loginModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Funções de autenticação com Firebase (versão simplificada)
    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('loginMessage');
        
        messageElement.textContent = 'Conectando à Força...';
        messageElement.classList.remove('hidden', 'text-red-500');
        messageElement.classList.add('text-yellow-500');
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem-sucedido
                messageElement.textContent = 'Conexão com a Força estabelecida!';
                messageElement.classList.remove('text-yellow-500');
                messageElement.classList.add('text-green-500');
                
                setTimeout(() => {
                    closeModal();
                    window.location.href = 'lista.html';
                }, 1000);
            })
            .catch((error) => {
                // Tratar erros
                let errorMessage = 'Erro ao conectar com a Força!';
                
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Email Jedi inválido!';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Este usuário Jedi foi desativado!';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'Jedi não encontrado nos registros!';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Senha secreta incorreta!';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Muitas tentativas. Tente novamente mais tarde!';
                        break;
                    default:
                        errorMessage = 'Falha na conexão com a Força!';
                }
                
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-yellow-500', 'text-green-500');
                messageElement.classList.add('text-red-500');
            });
    }

    function handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const messageElement = document.getElementById('registerMessage');
        
        messageElement.textContent = 'Recrutando para a Rebelião...';
        messageElement.classList.remove('hidden', 'text-red-500');
        messageElement.classList.add('text-yellow-500');
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Cadastro bem-sucedido - atualizar nome do usuário
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                messageElement.textContent = 'Rebelde recrutado com sucesso!';
                messageElement.classList.remove('text-yellow-500');
                messageElement.classList.add('text-green-500');
                
                // Limpar formulário
                document.getElementById('name').value = '';
                document.getElementById('newEmail').value = '';
                document.getElementById('newPassword').value = '';
                
                setTimeout(() => {
                    showLoginForm();
                }, 2000);
            })
            .catch((error) => {
                let errorMessage = 'Erro no recrutamento rebelde!';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Este email já está na Rebelião!';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email da Força inválido!';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Operação não permitida!';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Senha Jedi muito fraca! Use pelo menos 6 caracteres.';
                        break;
                    default:
                        errorMessage = 'Falha no recrutamento rebelde!';
                }
                
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-yellow-500', 'text-green-500');
                messageElement.classList.add('text-red-500');
            });
    }

    // Função de recuperação de senha
    function startRecovery() {
        const email = document.getElementById('recoveryEmail').value;
        const messageElement = document.getElementById('recoveryMessage');
        
        messageElement.textContent = 'Enviando mensagem holográfica...';
        messageElement.classList.remove('text-red-500', 'text-green-500');
        messageElement.classList.add('text-yellow-500');
        
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                messageElement.textContent = 'Mensagem holográfica enviada! Verifique seu email.';
                messageElement.classList.remove('text-yellow-500');
                messageElement.classList.add('text-green-500');
                
                setTimeout(() => {
                    showLoginForm();
                }, 3000);
            })
            .catch((error) => {
                let errorMessage = 'Erro ao enviar mensagem holográfica!';
                
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Email Jedi inválido!';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'Jedi não encontrado nos registros!';
                        break;
                    default:
                        errorMessage = 'Falha no sistema de comunicação!';
                }
                
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-yellow-500', 'text-green-500');
                messageElement.classList.add('text-red-500');
            });
    }

    // Verificar se usuário já está logado ao carregar a página
    function checkAuthState() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Usuário já está logado, redirecionar diretamente
                window.location.href = 'lista.html';
            }
        });
    }

    // Inicializar quando a página carregar
    document.addEventListener('DOMContentLoaded', function() {
        createStars();
        checkAuthState();

        // Adicionar efeito de profundidade
        document.querySelectorAll('.depth-effect').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    });

    // Expor funções para o escopo global
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.showLoginForm = showLoginForm;
    window.showRegisterForm = showRegisterForm;
    window.showRecoveryForm = showRecoveryForm;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.startRecovery = startRecovery;
})();