
// TEMA CLARO / ESCURO
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.className = 'fas fa-moon';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ANIMAÇÃO DE LOADER
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1500);
    }
});

// MENU MOBILE
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('open');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// SCROLL SUAVE (APENAS ÂNCORAS INTERNAS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Se for apenas "#", ignora
        if (targetId === '#') return;
        
        // Tenta encontrar o elemento na página
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Só bloqueia a navegação se o elemento realmente existir na página
            e.preventDefault();
            
            const headerElement = document.querySelector('header');
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        // Se não encontrar (ex: python.html), deixa o navegador seguir normalmente
    });
});

// HEADER FIXO COM SOMBRA
const header = document.getElementById('header');
if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// BOTÃO VOLTAR AO TOPO
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ANIMAÇÃO DOS CARDS AO SCROLL

const cards = document.querySelectorAll('.card');
if (cards.length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        cardObserver.observe(card);
    });
}

// ANIMAÇÃO DOS NÚMEROS (ESTATÍSTICAS)
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.floor(progress * target);
                    
                    if (target >= 1000) {
                        entry.target.textContent = value.toLocaleString() + '+';
                    } else {
                        entry.target.textContent = value;
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                
                requestAnimationFrame(updateCounter);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
}

// DESTAQUE DO LINK ATIVO NO MENU
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// EFEITO PARALAX NO BANNER
const banner = document.querySelector('.banner');
if (banner) {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        banner.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });
}


// EFEITO DE DIGITAÇÃO NO TÍTULO (CORRIGIDO)
const bannerTitle = document.querySelector('.banner-text h2 .highlight');
if (bannerTitle) {
    const text = bannerTitle.textContent;
    // Não apaga o texto de imediato para evitar sumir caso dê erro
    let index = 0;
    let typingStarted = false;
    
    function typeWriter() {
        if (!typingStarted) {
            bannerTitle.textContent = '';
            typingStarted = true;
        }
        
        if (index < text.length) {
            bannerTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Só inicia a digitação após o loader (1.5s) + um tempinho
    setTimeout(typeWriter, 2000);
}

console.log('LingProg - Site carregado com sucesso!');