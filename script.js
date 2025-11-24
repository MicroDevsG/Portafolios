// Modo debug para saltar la animación
const DEBUG_MODE = false;

// ... (resto del código de animación)

// Funcionalidad para copiar email
document.addEventListener('DOMContentLoaded', function() {
    const copyEmail = document.querySelector('.copy-email');
    if (copyEmail) {
        copyEmail.addEventListener('click', async function() {
            const email = this.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
                
                // Cambiar el tooltip para mostrar confirmación
                const tooltip = this.querySelector('.copy-tooltip');
                const originalText = tooltip.textContent;
                tooltip.textContent = '¡Copiado!';
                tooltip.style.background = 'var(--color-primary)';
                
                // Restaurar el tooltip después de 2 segundos
                setTimeout(() => {
                    tooltip.textContent = originalText;
                    tooltip.style.background = 'var(--color-text-main)';
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que la página comience desde arriba
    window.scrollTo(0, 0);

    if (DEBUG_MODE) {
        skipIntroAnimation();
        return;
    }
    
    // Prevenir scroll durante la animación
    document.body.classList.add('animating');
    
    // Elementos de la animación
    const ideaText = document.getElementById('idea-text');
    const unstyledPortfolio = document.getElementById('unstyled-portfolio');
    const executionText = document.getElementById('execution-text');
    const styledPortfolio = document.getElementById('styled-portfolio');
    const animationContainer = document.querySelector('.animation-container');

    // Función para mostrar elemento con fade in
    const fadeIn = (element, delay = 0) => {
        return new Promise(resolve => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    element.classList.add('fade-in');
                    setTimeout(resolve, 800); // Ajustado a la duración de la animación CSS
                });
            }, delay);
        });
    };

    // Función para ocultar elemento con fade out
    const fadeOut = (element, delay = 0) => {
        return new Promise(resolve => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    element.classList.remove('fade-in');
                    setTimeout(resolve, 800); // Ajustado a la duración de la animación CSS
                });
            }, delay);
        });
    };

    // Secuencia de animación
    async function startAnimation() {
        const ideaSubtext = document.getElementById('idea-subtext');
        const executionSubtext = document.getElementById('execution-subtext');
        
        // Pequeña pausa inicial para mejor experiencia
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. Mostrar "primero la idea"
        await fadeIn(ideaText);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 1.1 Mostrar el subtexto de la idea
        await fadeIn(ideaSubtext);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 2. Mostrar el portafolio sin estilos
        await fadeIn(unstyledPortfolio, 300);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 3. Ocultar todos los elementos de la primera fase
        await Promise.all([
            fadeOut(ideaText),
            fadeOut(ideaSubtext),
            fadeOut(unstyledPortfolio)
        ]);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 4. Mostrar "luego la ejecución"
        await fadeIn(executionText, 300);
        
        // 4.1 Mostrar el subtexto de la ejecución después de 500ms
        setTimeout(async () => {
            await fadeIn(executionSubtext);
        }, 500);
        
        // Esperar 2 segundos para apreciar mejor el texto
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 5. Mostrar el portafolio con estilos inmediatamente
        window.scrollTo(0, 0); // Asegurar que estamos en la parte superior
        styledPortfolio.style.display = 'block';
        fadeIn(styledPortfolio, 0);
        
        // 6. Ocultar los textos y permitir scroll
        await Promise.all([
            fadeOut(executionText),
            fadeOut(executionSubtext)
        ]);
        
        // Fade out suave del contenedor de animación
        animationContainer.style.transition = 'opacity 0.8s ease-out';
        animationContainer.style.opacity = '0';
        
        // Remover el contenedor después de la animación
        setTimeout(() => {
            window.scrollTo(0, 0); // Asegurar posición superior una vez más
            animationContainer.style.display = 'none';
            // Permitir scroll después de que termine la animación
            requestAnimationFrame(() => {
                document.body.classList.remove('animating');
            });
        }, 800);
    }

    // Iniciar la secuencia de animación
    startAnimation();

    // Función para saltar la animación inicial
    function skipIntroAnimation() {
        const animationContainer = document.querySelector('.animation-container');
        const styledPortfolio = document.getElementById('styled-portfolio');
        
        // Ocultar el contenedor de animación
        animationContainer.style.display = 'none';
        
        // Mostrar el portafolio estilizado
        styledPortfolio.style.display = 'block';
        styledPortfolio.classList.add('fade-in');
        
        // Permitir scroll
        document.body.classList.remove('animating');
    }

    // Manejar el scroll suave para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});