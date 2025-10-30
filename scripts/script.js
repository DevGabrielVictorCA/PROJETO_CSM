// scripts/script.js
import { db, doc, setDoc } from "./firebase.js";

(function () {
    "use strict";

    // Variáveis globais
    let recoveryCode = null;
    let recoveryEmail = null;

    // Função para enviar email de boas-vindas
    async function enviarEmailBoasVindas(nome, email) {
        try {
            console.log('Tentando enviar email para:', email);
            
            const templateParams = {
                name: nome,
                email: email,
                to_email: email
            };

            // Verifica se EmailJS está carregado
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS não está carregado');
                return null;
            }

            // Envia o email usando EmailJS
            const response = await emailjs.send(
                'service_up82fcd', // Service ID
                'template_ihu3n49', // Template ID
                templateParams
            );

            console.log('Email de boas-vindas enviado com sucesso!', response);
            return response;
            
        } catch (error) {
            console.error('Erro detalhado ao enviar email:', error);
            console.log('Código do erro:', error.code);
            console.log('Mensagem:', error.text);
            return null;
        }
    }

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
        
        // Limpar campos
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    function showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('registerMessage').classList.add('hidden');
        
        // Limpar campos
        document.getElementById('name').value = '';
        document.getElementById('newEmail').value = '';
        document.getElementById('newPassword').value = '';
    }

    function showRecoveryForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.remove('hidden');
        document.getElementById('step1').classList.remove('hidden');
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('recoveryMessage').textContent = '';
        document.getElementById('recoveryMessage').classList.remove('text-red-500', 'text-green-500');
        
        // Limpar campos
        document.getElementById('recoveryEmail').value = '';
        document.getElementById('recoveryCode').value = '';
        document.getElementById('newPasswordRecovery').value = '';
    }

    // Fechar modal ao clicar fora dele
    document.getElementById('loginModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Funções de autenticação com Firebase
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
            .then(async () => {
                const user = firebase.auth().currentUser;
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    name: user.displayName,
                    role: "user",
                    dataCriacao: new Date().toISOString()
                }, { merge: true });
                
                // ✅ ENVIAR EMAIL DE BOAS-VINDAS
                return enviarEmailBoasVindas(name, email);
            })
            .then((emailResponse) => {
                if (emailResponse && emailResponse.status === 200) {
                    messageElement.textContent = 'Rebelde recrutado com sucesso! Email de boas-vindas enviado! 🚀';
                } else {
                    messageElement.textContent = 'Rebelde recrutado com sucesso! (Email não enviado)';
                }
                
                messageElement.classList.remove('text-yellow-500');
                messageElement.classList.add('text-green-500');

                // Limpar formulário
                document.getElementById('name').value = '';
                document.getElementById('newEmail').value = '';
                document.getElementById('newPassword').value = '';

                setTimeout(() => {
                    showLoginForm();
                }, 3000);
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
        
        if (!email) {
            messageElement.textContent = 'Por favor, informe seu email Jedi.';
            messageElement.classList.remove('text-green-500');
            messageElement.classList.add('text-red-500');
            return;
        }
        
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

    // Função para verificar código de recuperação (placeholder)
    function verifyRecoveryCode() {
        const messageElement = document.getElementById('recoveryMessage');
        messageElement.textContent = 'Funcionalidade de verificação de código em desenvolvimento.';
        messageElement.classList.remove('text-green-500');
        messageElement.classList.add('text-yellow-500');
    }

    // Verificar se usuário já está logado ao carregar a página
    function checkAuthState() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Usuário já está logado, redirecionar diretamente
                console.log('Usuário já logado, redirecionando...');
                window.location.href = 'lista.html';
            } else {
                console.log('Usuário não logado, permanecendo na página inicial.');
            }
        });
    }

    // Função para esconder tela de boas-vindas
    function hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
    }

    // Configuração do formulário de contato
    function setupContactForm() {
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;

        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
        
            const nome = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const mensagem = document.getElementById("message").value;
            const feedback = document.getElementById("feedback");
        
            if (nome && email && mensagem) {
                feedback.textContent = "Mensagem enviada com sucesso!";
                feedback.style.color = "#7cfc00";
                this.reset();

                setTimeout(() => {
                    feedback.textContent = " ";
                }, 10000);
            } else {
                feedback.textContent = "Preencha todos os campos.";
                feedback.style.color = "red";
            }
        });

        // Toggle button para o formulário
        let openForm = document.querySelector(".open-form");
        let closeForm = document.querySelector(".close-form");
        let containerForm = document.querySelector(".container");

        if (openForm && closeForm && containerForm) {
            openForm.addEventListener('click', ()=>{
                containerForm.classList.add('form-active');
                openForm.style.display = 'none';
                document.body.style.overflow = 'hidden';
            });

            closeForm.addEventListener('click', ()=>{
                containerForm.classList.remove('form-active');
                openForm.style.display = 'flex';
                document.body.style.overflowY = 'scroll';
            });
        }
    }

    // Inicializar quando a página carregar
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM carregado, inicializando aplicação...');
        
        createStars();
        checkAuthState();
        setupContactForm();

        // Adicionar efeito de profundidade
        document.querySelectorAll('.depth-effect').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // Debug: testar EmailJS
        console.log('EmailJS disponível:', typeof emailjs !== 'undefined');
        if (typeof emailjs !== 'undefined') {
            console.log('EmailJS inicializado com sucesso');
        } else {
            console.error('EmailJS não carregado');
        }
    });

    // Teste manual da função (para debug)
    window.testarEmail = function() {
        const testEmail = prompt('Digite um email para teste:');
        if (testEmail) {
            enviarEmailBoasVindas('Usuário Teste', testEmail)
                .then(result => {
                    if (result && result.status === 200) {
                        alert('Email de teste enviado com sucesso!');
                    } else {
                        alert('Email de teste não enviado. Verifique o console.');
                    }
                })
                .catch(error => {
                    console.error('Erro no teste:', error);
                    alert('Erro ao enviar email de teste. Verifique o console.');
                });
        }
    };

    // Expor funções para o escopo global
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.showLoginForm = showLoginForm;
    window.showRegisterForm = showRegisterForm;
    window.showRecoveryForm = showRecoveryForm;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.startRecovery = startRecovery;
    window.verifyRecoveryCode = verifyRecoveryCode;
    window.hideWelcomeScreen = hideWelcomeScreen;
})();