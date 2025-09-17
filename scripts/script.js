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

            // Tamanho aleatório para as estrelas
            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            // Posição aleatória
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;

            // Duração da animação aleatória
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

    // Funções de autenticação
    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('loginMessage');
        
        // Simulação de verificação no banco de dados
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login bem-sucedido
            closeModal();
            showWelcomeScreen(user.name);
        } else {
            // Login falhou
            messageElement.textContent = 'Email ou senha incorretos!';
            messageElement.classList.remove('hidden');
            messageElement.classList.add('text-red-500');
        }
    }

    function handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const messageElement = document.getElementById('registerMessage');
        
        // Verificar se o usuário já existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            messageElement.textContent = 'Este email já está cadastrado!';
            messageElement.classList.remove('hidden');
            messageElement.classList.add('text-red-500');
            return;
        }
        
        // Adicionar novo usuário
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        messageElement.textContent = 'Cadastro realizado com sucesso!';
        messageElement.classList.remove('hidden', 'text-red-500');
        messageElement.classList.add('text-green-500');
        
        // Limpar formulário
        document.getElementById('name').value = '';
        document.getElementById('newEmail').value = '';
        document.getElementById('newPassword').value = '';
        
        // Voltar para o login após 2 segundos
        setTimeout(() => {
            showLoginForm();
        }, 2000);
    }

    // Funções de recuperação de senha
    function startRecovery() {
        const email = document.getElementById('recoveryEmail').value;
        const messageElement = document.getElementById('recoveryMessage');
        
        // Verificar se o email existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.some(u => u.email === email)) {
            messageElement.textContent = 'Email não encontrado!';
            messageElement.classList.add('text-red-500');
            return;
        }
        
        // Gerar código de recuperação (simulação)
        recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
        recoveryEmail = email;
        
        // Simular envio de email
        console.log(`Código de recuperação para ${email}: ${recoveryCode}`);
        
        // Mostrar segunda etapa
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        
        messageElement.textContent = 'Código enviado para seu email!';
        messageElement.classList.remove('text-red-500');
        messageElement.classList.add('text-green-500');
    }

    function verifyRecoveryCode() {
        const code = document.getElementById('recoveryCode').value;
        const newPassword = document.getElementById('newPasswordRecovery').value;
        const messageElement = document.getElementById('recoveryMessage');
        
        if (code !== recoveryCode) {
            messageElement.textContent = 'Código inválido!';
            messageElement.classList.remove('text-green-500');
            messageElement.classList.add('text-red-500');
            return;
        }
        
        // Atualizar senha no "banco de dados"
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === recoveryEmail);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            messageElement.textContent = 'Senha redefinida com sucesso!';
            messageElement.classList.remove('text-red-500');
            messageElement.classList.add('text-green-500');
            
            // Voltar para o login após 2 segundos
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        }
    }

    // Funções da tela de boas-vindas
    function showWelcomeScreen(userName) {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const welcomeTitle = welcomeScreen.querySelector('h1');
        
        welcomeTitle.textContent = `BEM-VINDO, ${userName.toUpperCase()}!`;
        welcomeScreen.classList.remove('hidden');
    }

    function hideWelcomeScreen() {
        document.getElementById('welcomeScreen').classList.add('hidden');
        // Aqui você pode redirecionar para a página principal do app
        alert('Redirecionando para a aplicação principal...');
    }

    // Inicializar as estrelas quando a página carregar
    document.addEventListener('DOMContentLoaded', function() {
        createStars();

        // Adicionar efeito de profundidade a todos os elementos com a classe
        document.querySelectorAll('.depth-effect').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // Inicializar "banco de dados" se não existir
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
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
    window.verifyRecoveryCode = verifyRecoveryCode;
    window.hideWelcomeScreen = hideWelcomeScreen;
})();
