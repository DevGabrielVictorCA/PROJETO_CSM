// scripts/script.js - VERSÃO SEM IMPORTS/MÓDULOS

// Variáveis globais
let recoveryCode = null;
let recoveryEmail = null;

// Serviço Resend integrado diretamente (sem import)
class ResendService {
    constructor() {
        this.apiKey = 're_3uSZmLxq_4XC2uAgzhRR9CuvQ1sZQtbpe';
        this.baseUrl = 'https://api.resend.com';
        this.isProduction = window.location.hostname === 'starwarstodolist.shop' || 
                        window.location.hostname === 'www.starwarstodolist.shop';
    }

    async sendEmail({ to, subject, html, from = 'Star Wars To-Do List <sabrina.oliveira0133@gmail.com>' }) {
        try {
            console.log('Enviando email via Resend...');

            // Em produção, usa a API real
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: from,
                    to: to,
                    subject: subject,
                    html: html,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro na resposta do Resend:', errorData);
                throw new Error(errorData.message || `Erro ao enviar email: ${response.status}`);
            }

            const data = await response.json();
            console.log('Email enviado com sucesso via Resend:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao enviar email via Resend:', error);
            return { 
                success: false, 
                error: error.message
            };
        }
    }

    async sendWelcomeEmail(name, email) {
        const subject = 'Bem-vindo(a) à Rebelião! - Star Wars To-Do List';
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ffd700, #ffed4e); padding: 30px 20px; text-align: center; }
                    .content { padding: 40px 30px; }
                    .star-wars-font { font-family: 'Orbitron', 'Arial', sans-serif; color: #000; font-size: 28px; font-weight: bold; margin: 0; }
                    .button { background-color: #ffd700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; margin: 20px 0; border: 2px solid #000; }
                    .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }
                    .footer { text-align: center; padding: 20px; background: #2c3e50; color: white; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="star-wars-font">STAR WARS TO-DO LIST</h1>
                        <p style="color: #000; font-weight: bold; margin: 10px 0 0 0; font-size: 18px;">Que a Força esteja com suas tarefas!</p>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Bem-vindo(a) à Rebelião! Sua jornada para dominar suas tarefas diárias está apenas começando.</p>
                        
                        <div class="features">
                            <h3>O que você pode fazer no nosso app:</h3>
                            <ul>
                                <li><strong>Criar e gerenciar missões</strong> (suas tarefas diárias)</li>
                                <li><strong>Organizar por categorias</strong> personalizadas</li>
                                <li><strong>Acompanhar seu progresso</strong> com métricas visuais</li>
                                <li><strong>Experienciar temas Star Wars</strong> únicos e imersivos</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://starwarstodolist.shop" class="button">🚀 Iniciar Sua Missão</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">Que a força (e a produtividade) esteja com você!<br><strong>Time Star Wars To-Do List</strong></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: email,
            subject: subject,
            html: html
        });
    }

    async sendContactEmail({ name, email, subject, message }) {
        const subjectOptions = {
            'duvida-funcionalidades': '❓ Dúvida sobre Funcionalidades',
            'problemas-conta': '🔐 Problema com Login ou Conta',
            'sincronizacao': '🔄 Problema de Sincronização',
            'sugestoes': '💡 Sugestão de Melhoria',
            'feedback': '🌟 Feedback Geral',
            'reclamacoes': '⚠️ Reclamação',
            'colaboracoes': '🤝 Proposta de Colaboração',
            'outros': '📨 Outro Assunto'
        };

        const subjectText = subjectOptions[subject] || '📨 Mensagem de Contato';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #4facfe, #00f2fe); padding: 25px 20px; text-align: center; color: white; }
                    .content { padding: 30px; }
                    .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #4facfe; margin: 20px 0; white-space: pre-wrap; }
                    .footer { text-align: center; padding: 20px; background: #2c3e50; color: white; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 22px;">📨 NOVA MENSAGEM DE CONTATO</h1>
                    </div>
                    <div class="content">
                        <p><strong>👤 Nome:</strong> ${name}</p>
                        <p><strong>📧 Email:</strong> ${email}</p>
                        <p><strong>🏷️ Assunto:</strong> ${subjectText}</p>
                        
                        <h3>📝 Mensagem:</h3>
                        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                        
                        <p><strong>📅 Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">💫 Star Wars To-Do List - starwarstodolist.shop</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: 'sabrina.oliveira0133@gmail.com',
            subject: `📨 ${subjectText} - de ${name}`,
            html: html
        });
    }

    async sendNewUserNotification(userData) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #32cd32, #228b22); padding: 25px 20px; text-align: center; color: white; }
                    .content { padding: 30px; }
                    .footer { text-align: center; padding: 20px; background: #2c3e50; color: white; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 24px;">🎉 NOVO USUÁRIO CADASTRADO!</h1>
                    </div>
                    <div class="content">
                        <h3>👤 Detalhes do Novo Rebelde:</h3>
                        <p><strong>Nome Jedi:</strong> ${userData.name}</p>
                        <p><strong>Email da Força:</strong> ${userData.email}</p>
                        <p><strong>Data de Recrutamento:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">🎯 A Rebelião cresce! Mais um Jedi se juntou à nossa causa!</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p style="margin: 0;">🤖 Notificação automática - Star Wars To-Do List</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: 'sabrina.oliveira0133@gmail.com',
            subject: 'Novo Usuário registrado!',
            html: html
        });
    }
}

// Instância global do ResendService
const resendService = new ResendService();

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
window.testarEmailProducao = testarEmailProducao;

console.log('⭐ Star Wars To-Do List - Script carregado com sucesso!');