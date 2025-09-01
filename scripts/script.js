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
            modal.classList.add('active');
            
            if (type === 'register') {
                showRegisterForm();
            } else {
                showLoginForm();
            }
        }
        
        function closeModal() {
            const modal = document.getElementById('loginModal');
            modal.classList.remove('active');
        }
        
        function showLoginForm() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        }
        
        function showRegisterForm() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }
        
        // Fechar modal ao clicar fora dele
        document.getElementById('loginModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Inicializar as estrelas quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
            
            // Adicionar efeito de profundidade a todos os elementos com a classe
            document.querySelectorAll('.depth-effect').forEach(element => {
                element.addEventListener('mouseenter', function() {
                    this.style.transition = 'all 0.3s ease';
                });
            });
        });