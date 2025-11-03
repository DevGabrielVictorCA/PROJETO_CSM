// scripts/resend-service.js
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
            console.log('De:', from);
            console.log('Para:', to);
            console.log('Assunto:', subject);
            console.log('Ambiente:', this.isProduction ? 'Produção' : 'Desenvolvimento');

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

    // Template para email de boas-vindas
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

    // Template para contato
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

    // Template para notificação de novo usuário
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

    // Método para verificar o ambiente atual
    getCurrentEnvironment() {
        return {
            hostname: window.location.hostname,
            isProduction: this.isProduction,
            fullUrl: window.location.href
        };
    }
}

// Exportar uma instância única
export default new ResendService();