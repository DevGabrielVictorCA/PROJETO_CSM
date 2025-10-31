// scripts/script.js
import { db, doc, setDoc } from "./firebase.js";

(function () {
    "use strict";

    // Variáveis globais
    let recoveryCode = null;
    let recoveryEmail = null;

    // Enviar email de boas-vindas
    async function enviarEmailBoasVindas(nome, email) {
        try {
            console.log('Tentando enviar email para:', email);

            const templateParams = { name: nome, email, to_email: email };

            if (typeof emailjs === 'undefined') {
                console.error('EmailJS não está carregado');
                return null;
            }

            const response = await emailjs.send(
                'service_up82fcd',
                'template_jiu3n49',
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

    // Criar estrelas para fundo da galáxia
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

    // Modal
    function openModal(type) {
        const modal = document.getElementById('loginModal');
        modal.classList.remove('hidden');

        if (type === 'register') showRegisterForm();
        else if (type === 'recovery') showRecoveryForm();
        else showLoginForm();
    }

    function closeModal() {
        document.getElementById('loginModal').classList.add('hidden');
    }

    function showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('loginMessage').classList.add('hidden');

        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    function showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('registerMessage').classList.add('hidden');

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

        const messageElement = document.getElementById('recoveryMessage');
        messageElement.textContent = '';
        messageElement.classList.remove('text-error', 'text-highlight', 'text-warning');

        document.getElementById('recoveryEmail').value = '';
        document.getElementById('recoveryCode').value = '';
        document.getElementById('newPasswordRecovery').value = '';
    }

    // Fechar modal clicando fora
    document.getElementById('loginModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Funções de autenticação
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('loginMessage');

        messageElement.textContent = 'Conectando à Força...';
        messageElement.classList.remove('hidden', 'text-error', 'text-highlight');
        messageElement.classList.add('text-warning');

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                messageElement.textContent = 'Conexão com a Força estabelecida!';
                messageElement.classList.remove('text-warning');
                messageElement.classList.add('text-highlight');

                setTimeout(() => {
                    closeModal();
                    window.location.href = 'lista.html';
                }, 1000);
            })
            .catch((error) => {
                let errorMessage = 'Erro ao conectar com a Força!';
                switch (error.code) {
                    case 'auth/invalid-email': errorMessage = 'Email Jedi inválido!'; break;
                    case 'auth/user-disabled': errorMessage = 'Este usuário Jedi foi desativado!'; break;
                    case 'auth/user-not-found': errorMessage = 'Jedi não encontrado nos registros!'; break;
                    case 'auth/wrong-password': errorMessage = 'Senha secreta incorreta!'; break;
                    case 'auth/too-many-requests': errorMessage = 'Muitas tentativas. Tente novamente mais tarde!'; break;
                }
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-warning', 'text-highlight');
                messageElement.classList.add('text-error');
            });
    }

    function handleRegister(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const messageElement = document.getElementById('registerMessage');

        messageElement.textContent = 'Recrutando para a Rebelião...';
        messageElement.classList.remove('hidden', 'text-error', 'text-highlight');
        messageElement.classList.add('text-warning');

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => userCredential.user.updateProfile({ displayName: name }))
            .then(async () => {
                const user = firebase.auth().currentUser;
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    name: user.displayName,
                    role: "user",
                    dataCriacao: new Date().toISOString()
                }, { merge: true });

                return enviarEmailBoasVindas(name, email);
            })
            .then((emailResponse) => {
                if (emailResponse && emailResponse.status === 200) {
                    messageElement.textContent = 'Rebelde recrutado com sucesso! Email de boas-vindas enviado! 🚀';
                } else {
                    messageElement.textContent = 'Rebelde recrutado com sucesso! (Email não enviado)';
                }

                messageElement.classList.remove('text-warning');
                messageElement.classList.add('text-highlight');

                document.getElementById('name').value = '';
                document.getElementById('newEmail').value = '';
                document.getElementById('newPassword').value = '';

                setTimeout(() => showLoginForm(), 3000);
            })
            .catch((error) => {
                let errorMessage = 'Erro no recrutamento rebelde!';
                switch (error.code) {
                    case 'auth/email-already-in-use': errorMessage = 'Este email já está na Rebelião!'; break;
                    case 'auth/invalid-email': errorMessage = 'Email da Força inválido!'; break;
                    case 'auth/operation-not-allowed': errorMessage = 'Operação não permitida!'; break;
                    case 'auth/weak-password': errorMessage = 'Senha Jedi muito fraca! Use pelo menos 6 caracteres.'; break;
                }
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-warning', 'text-highlight');
                messageElement.classList.add('text-error');
            });
    }

    function startRecovery() {
        const email = document.getElementById('recoveryEmail').value;
        const messageElement = document.getElementById('recoveryMessage');

        if (!email) {
            messageElement.textContent = 'Por favor, informe seu email Jedi.';
            messageElement.classList.remove('text-highlight');
            messageElement.classList.add('text-error');
            return;
        }

        messageElement.textContent = 'Enviando mensagem holográfica...';
        messageElement.classList.remove('text-error', 'text-highlight');
        messageElement.classList.add('text-warning');

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                messageElement.textContent = 'Mensagem holográfica enviada! Verifique seu email.';
                messageElement.classList.remove('text-warning');
                messageElement.classList.add('text-highlight');

                setTimeout(() => showLoginForm(), 3000);
            })
            .catch((error) => {
                let errorMessage = 'Erro ao enviar mensagem holográfica!';
                switch (error.code) {
                    case 'auth/invalid-email': errorMessage = 'Email Jedi inválido!'; break;
                    case 'auth/user-not-found': errorMessage = 'Jedi não encontrado nos registros!'; break;
                }
                messageElement.textContent = errorMessage;
                messageElement.classList.remove('text-warning', 'text-highlight');
                messageElement.classList.add('text-error');
            });
    }

    function verifyRecoveryCode() {
        const messageElement = document.getElementById('recoveryMessage');
        messageElement.textContent = 'Funcionalidade de verificação de código em desenvolvimento.';
        messageElement.classList.remove('text-highlight');
        messageElement.classList.add('text-warning');
    }

    function checkAuthState() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('Usuário já logado, redirecionando...');
                window.location.href = 'lista.html';
            } else {
                console.log('Usuário não logado, permanecendo na página inicial.');
            }
        });
    }

    function hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) welcomeScreen.classList.add('hidden');
    }

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
                feedback.classList.remove('text-error');
                feedback.classList.add('text-highlight');
                this.reset();

                setTimeout(() => { feedback.textContent = ""; }, 10000);
            } else {
                feedback.textContent = "Preencha todos os campos.";
                feedback.classList.remove('text-highlight');
                feedback.classList.add('text-error');
            }
        });

        const openForm = document.querySelector(".open-form");
        const closeForm = document.querySelector(".close-form");
        const containerForm = document.querySelector(".contact-container");

        if (openForm && closeForm && containerForm) {
            openForm.addEventListener("click", () => {
                containerForm.classList.add("form-active");
                openForm.style.display = "none";
                document.body.style.overflow = "hidden";
            });

            closeForm.addEventListener("click", () => {
                containerForm.classList.remove("form-active");
                openForm.style.display = "flex";
                document.body.style.overflowY = "scroll";
            });

            document.addEventListener("click", (event) => {
                if (containerForm.classList.contains("form-active") &&
                    !contactForm.contains(event.target) &&
                    !openForm.contains(event.target)
                ) {
                    containerForm.classList.remove("form-active");
                    openForm.style.display = "flex";
                    document.body.style.overflowY = "scroll";
                }
            });
        }
    }

    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        createStars();
        checkAuthState();
        setupContactForm();

        document.querySelectorAll('.depth-effect').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        console.log('EmailJS disponível:', typeof emailjs !== 'undefined');
    });

    // Função de teste de email
    window.testarEmail = function() {
        const testEmail = prompt('Digite um email para teste:');
        if (testEmail) {
            enviarEmailBoasVindas('Usuário Teste', testEmail)
                .then(result => {
                    if (result && result.status === 200) alert('Email de teste enviado com sucesso!');
                    else alert('Email de teste não enviado. Verifique o console.');
                })
                .catch(error => { console.error('Erro no teste:', error); alert('Erro ao enviar email de teste.'); });
        }
    };

    // Exportar funções globalmente
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
