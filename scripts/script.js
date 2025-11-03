// Import do serviço de email
import resendService from './email-resend.js';

// Variáveis globais
let recoveryCode = null;
let recoveryEmail = null;

// Função segura para verificar elementos
function getElementSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Elemento não encontrado: ${id}`);
    }
    return element;
}

// Modal - Funções otimizadas
function openModal(type) {
    try {
        console.log('Abrindo modal:', type);
        const modal = document.getElementById('loginModal');
        if (!modal) {
            console.error('Modal não encontrado!');
            return;
        }
        
        modal.classList.remove('hidden');
        modal.style.display = 'flex';

        // Esconder todos os formulários primeiro
        const forms = ['loginForm', 'registerForm', 'recoveryForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'none';
                form.classList.add('hidden');
            }
        });

        // Mostrar o formulário correto
        if (type === 'register') {
            const registerForm = document.getElementById('registerForm');
            if (registerForm) {
                registerForm.style.display = 'block';
                registerForm.classList.remove('hidden');
            }
        } else if (type === 'recovery') {
            const recoveryForm = document.getElementById('recoveryForm');
            if (recoveryForm) {
                recoveryForm.style.display = 'block';
                recoveryForm.classList.remove('hidden');
            }
        } else {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.style.display = 'block';
                loginForm.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

function closeModal() {
    try {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
}

function showLoginForm() {
    try {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');

        if (loginForm) {
            loginForm.style.display = 'block';
            loginForm.classList.remove('hidden');
        }
        if (registerForm) {
            registerForm.style.display = 'none';
            registerForm.classList.add('hidden');
        }
        if (recoveryForm) {
            recoveryForm.style.display = 'none';
            recoveryForm.classList.add('hidden');
        }
    } catch (error) {
        console.error('Erro ao mostrar formulário de login:', error);
    }
}

function showRegisterForm() {
    try {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');

        if (loginForm) {
            loginForm.style.display = 'none';
            loginForm.classList.add('hidden');
        }
        if (registerForm) {
            registerForm.style.display = 'block';
            registerForm.classList.remove('hidden');
        }
        if (recoveryForm) {
            recoveryForm.style.display = 'none';
            recoveryForm.classList.add('hidden');
        }
    } catch (error) {
        console.error('Erro ao mostrar formulário de registro:', error);
    }
}

function showRecoveryForm() {
    try {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');

        if (loginForm) {
            loginForm.style.display = 'none';
            loginForm.classList.add('hidden');
        }
        if (registerForm) {
            registerForm.style.display = 'none';
            registerForm.classList.add('hidden');
        }
        if (recoveryForm) {
            recoveryForm.style.display = 'block';
            recoveryForm.classList.remove('hidden');
        }
        if (step1) {
            step1.style.display = 'block';
            step1.classList.remove('hidden');
        }
        if (step2) {
            step2.style.display = 'none';
            step2.classList.add('hidden');
        }
    } catch (error) {
        console.error('Erro ao mostrar formulário de recuperação:', error);
    }
}

// Funções de autenticação
function handleLogin(event) {
    try {
        event.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const messageElement = document.getElementById('loginMessage');

        if (!email || !password) {
            if (messageElement) {
                messageElement.textContent = 'Por favor, preencha todos os campos.';
                messageElement.classList.remove('hidden', 'text-highlight');
                messageElement.classList.add('text-error');
            }
            return;
        }

        if (messageElement) {
            messageElement.textContent = 'Conectando à Força...';
            messageElement.classList.remove('hidden', 'text-error', 'text-highlight');
            messageElement.classList.add('text-warning');
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                if (messageElement) {
                    messageElement.textContent = 'Conexão com a Força estabelecida!';
                    messageElement.classList.remove('text-warning');
                    messageElement.classList.add('text-highlight');
                }

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
                if (messageElement) {
                    messageElement.textContent = errorMessage;
                    messageElement.classList.remove('text-warning', 'text-highlight');
                    messageElement.classList.add('text-error');
                }
            });
    } catch (error) {
        console.error('Erro no handleLogin:', error);
    }
}

// Enviar email de boas-vindas
async function enviarEmailBoasVindas(nome, email) {
    try {
        console.log('Enviando email de boas-vindas para:', email);
        const result = await resendService.sendWelcomeEmail(nome, email);
        
        if (result.success) {
            console.log('Email de boas-vindas enviado com sucesso!');
            return result.data;
        } else {
            console.log('Email de boas-vindas não enviado, mas registro continuou');
            return null;
        }
    } catch (error) {
        console.log('Erro no envio de email, mas registro continuou:', error);
        return null;
    }
}

// Enviar notificação de novo usuário
async function enviarNotificacaoNovoUsuario(userData) {
    try {
        console.log('Enviando notificação de novo usuário...');
        const result = await resendService.sendNewUserNotification(userData);
        
        if (result.success) {
            console.log('Notificação de novo usuário enviada!');
        } else {
            console.log('Notificação não enviada');
        }
    } catch (error) {
        console.log('Erro na notificação:', error);
    }
}

function handleRegister(event) {
    try {
        event.preventDefault();
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('newEmail')?.value;
        const password = document.getElementById('newPassword')?.value;
        const messageElement = document.getElementById('registerMessage');

        if (!name || !email || !password) {
            if (messageElement) {
                messageElement.textContent = 'Por favor, preencha todos os campos.';
                messageElement.classList.remove('hidden', 'text-highlight');
                messageElement.classList.add('text-error');
            }
            return;
        }

        if (messageElement) {
            messageElement.textContent = 'Recrutando para a Rebelião...';
            messageElement.classList.remove('hidden', 'text-error', 'text-highlight');
            messageElement.classList.add('text-warning');
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(async () => {
                const user = firebase.auth().currentUser;
                
                // Enviar emails (não bloqueantes)
                try {
                    await Promise.allSettled([
                        enviarEmailBoasVindas(name, email),
                        enviarNotificacaoNovoUsuario({ name, email })
                    ]);
                } catch (emailError) {
                    console.log('Erro no envio de emails:', emailError);
                }

                if (messageElement) {
                    messageElement.textContent = 'Rebelde recrutado com sucesso! 🚀';
                    messageElement.classList.remove('text-warning');
                    messageElement.classList.add('text-highlight');
                }

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
                if (messageElement) {
                    messageElement.textContent = errorMessage;
                    messageElement.classList.remove('text-warning', 'text-highlight');
                    messageElement.classList.add('text-error');
                }
            });
    } catch (error) {
        console.error('Erro no handleRegister:', error);
    }
}

function startRecovery() {
    try {
        const email = document.getElementById('recoveryEmail')?.value;
        const messageElement = document.getElementById('recoveryMessage');

        if (!email) {
            if (messageElement) {
                messageElement.textContent = 'Por favor, informe seu email Jedi.';
                messageElement.classList.remove('text-highlight');
                messageElement.classList.add('text-error');
            }
            return;
        }

        if (messageElement) {
            messageElement.textContent = 'Enviando mensagem holográfica...';
            messageElement.classList.remove('text-error', 'text-highlight');
            messageElement.classList.add('text-warning');
        }

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                if (messageElement) {
                    messageElement.textContent = 'Mensagem holográfica enviada! Verifique seu email.';
                    messageElement.classList.remove('text-warning');
                    messageElement.classList.add('text-highlight');
                }
                setTimeout(() => showLoginForm(), 3000);
            })
            .catch((error) => {
                let errorMessage = 'Erro ao enviar mensagem holográfica!';
                switch (error.code) {
                    case 'auth/invalid-email': errorMessage = 'Email Jedi inválido!'; break;
                    case 'auth/user-not-found': errorMessage = 'Jedi não encontrado nos registros!'; break;
                }
                if (messageElement) {
                    messageElement.textContent = errorMessage;
                    messageElement.classList.remove('text-warning', 'text-highlight');
                    messageElement.classList.add('text-error');
                }
            });
    } catch (error) {
        console.error('Erro no startRecovery:', error);
    }
}

function verifyRecoveryCode() {
    try {
        const messageElement = document.getElementById('recoveryMessage');
        if (messageElement) {
            messageElement.textContent = 'Funcionalidade de verificação de código em desenvolvimento.';
            messageElement.classList.remove('text-highlight');
            messageElement.classList.add('text-warning');
        }
    } catch (error) {
        console.error('Erro no verifyRecoveryCode:', error);
    }
}

function hideWelcomeScreen() {
    try {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) welcomeScreen.classList.add('hidden');
    } catch (error) {
        console.error('Erro no hideWelcomeScreen:', error);
    }
}

// Criar estrelas para fundo da galáxia
function createStars() {
    try {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

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
    } catch (error) {
        console.error('Erro ao criar estrelas:', error);
    }
}

function checkAuthState() {
    try {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('Usuário já logado, redirecionando...');
                window.location.href = 'lista.html';
            } else {
                console.log('Usuário não logado, permanecendo na página inicial.');
            }
        });
    } catch (error) {
        console.error('Erro no checkAuthState:', error);
    }
}

// Configuração do formulário de contato
function setupContactForm() {
    try {
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;

        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const nome = document.getElementById("name")?.value;
            const email = document.getElementById("email")?.value;
            const assunto = document.getElementById("assunto")?.value;
            const mensagem = document.getElementById("message")?.value;
            const feedback = document.getElementById("feedback");

            if (nome && email && assunto && mensagem) {
                if (feedback) {
                    feedback.textContent = "Enviando mensagem através do hiperespaço...";
                    feedback.style.color = "var(--warning-color)";
                }

                try {
                    const result = await resendService.sendContactEmail({
                        name: nome,
                        email: email,
                        subject: assunto,
                        message: mensagem
                    });

                    if (feedback) {
                        if (result.success) {
                            feedback.textContent = "Mensagem enviada com sucesso! Retornaremos em breve.";
                            feedback.style.color = "var(--highlighted-color)";
                            this.reset();
                            setTimeout(() => { feedback.textContent = ""; }, 10000);
                        } else {
                            feedback.textContent = "Mensagem não enviada. Tente novamente ou entre em contato diretamente.";
                            feedback.style.color = "var(--error-color)";
                        }
                    }
                } catch (error) {
                    if (feedback) {
                        feedback.textContent = "Erro ao enviar mensagem. Tente novamente.";
                        feedback.style.color = "var(--error-color)";
                    }
                }
            } else {
                if (feedback) {
                    feedback.textContent = "Preencha todos os campos.";
                    feedback.style.color = "var(--error-color)";
                }
            }
        });

        // Configurar botões de abrir/fechar formulário de contato
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
    } catch (error) {
        console.error('Erro no setupContactForm:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    try {
        // Fechar modal clicando fora
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
        }

        // Fechar modal com tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        console.log('Event listeners configurados com sucesso');
    } catch (error) {
        console.error('Erro ao configurar event listeners:', error);
    }
}

// Scroll suave para as seções
function setupSmoothScroll() {
    try {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Erro no setupSmoothScroll:', error);
    }
}

// Animação de entrada para elementos com classe scroll-effect
function setupScrollAnimations() {
    try {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        const elements = document.querySelectorAll('.scroll-effect');
        elements.forEach(el => observer.observe(el));
    } catch (error) {
        console.error('Erro no setupScrollAnimations:', error);
    }
}

// Inicialização completa
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Inicializando Star Wars To-Do List...');
        
        // Inicializar componentes
        createStars();
        checkAuthState();
        setupContactForm();
        setupEventListeners();
        setupSmoothScroll();
        setupScrollAnimations();

        console.log('✅ Sistema inicializado com sucesso');
        
        // Debug: verificar se as funções estão disponíveis globalmente
        console.log('🔍 Funções disponíveis:', {
            openModal: typeof openModal,
            closeModal: typeof closeModal,
            handleLogin: typeof handleLogin,
            handleRegister: typeof handleRegister
        });
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
    }
});

// Funções de utilidade para debug
function debugAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        console.log('🔐 Estado da autenticação:', user ? `Logado: ${user.email}` : 'Deslogado');
    });
}

// Teste de funcionalidade do modal
function testModal() {
    console.log('🧪 Testando modal...');
    openModal('login');
    setTimeout(() => {
        closeModal();
        console.log('✅ Teste do modal concluído');
    }, 2000);
}

// Teste de envio de email
async function testarEmailProducao() {
    try {
        const testEmail = prompt('Digite um email para teste em produção:');
        if (testEmail) {
            const result = await resendService.sendWelcomeEmail('Usuário Teste', testEmail);
            if (result.success) {
                alert('Email de teste enviado com sucesso! Verifique sua caixa de entrada.');
            } else {
                alert('Erro ao enviar email: ' + result.error);
            }
        }
    } catch (error) {
        alert('Erro inesperado: ' + error.message);
    }
}

// Exportar funções globalmente para acesso via HTML
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
window.debugAuth = debugAuth;
window.testModal = testModal;
window.testarEmailProducao = testarEmailProducao;

console.log('⭐ Star Wars To-Do List - Script carregado com sucesso!');