/* --- main.js --- */

// 1. DATA (TU BASE DE DATOS MANUAL)
// Aquí es donde controlas qué blogs aparecen.
// IMPORTANTE: Cada objeto aquí debe tener un archivo HTML real en la carpeta 'entradas'.

const blogData = [
    {
        id: 1,
        title: "Cuántas reservas estás perdiendo por desorden interno (y no lo sabes)",
        date: "2026-02-17", // Formato AÑO-MES-DÍA para que se ordene solo
        category: "Administración",
        excerpt: "Señales de desorden interno que están frenando reservas y generando pérdidas silenciosas en tu operación turística.",
        image: "assets/img/Blogs/17 febrero 2025/Recepción de hotel.webp",
        link: "cuantas-reservas-estas-perdiendo-por-desorden-interno-y-no-lo-sabes.html" // ESTE NOMBRE DEBE COINCIDIR CON TU ARCHIVO
    },

    // Para agregar otro blog, copia y pega el bloque anterior aquí abajo, cambiando los datos y el link.
];

// 2. CONFIGURACIÓN
const isSubfolder = window.location.pathname.includes('/entradas/');
const pathPrefix = isSubfolder ? '../' : './';

// 3. CORE (Se ejecuta al cargar)
document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    
    // ESTA LÍNEA ES LA MAGIA: Ordena tus blogs por fecha (del más nuevo al más viejo)
    const sortedPosts = blogData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // A. Renderizar en Home (Index) - Grid simple
    const recentPostsContainer = document.getElementById('recent-posts-container');
    if (recentPostsContainer) {
        // Muestra máximo 3 posts recientes
        renderHomePosts(sortedPosts.slice(0, 3), recentPostsContainer);
    }

    // B. Renderizar en Blog Principal - Layout Moderno
    const blogFeed = document.getElementById('blog-feed');
    if (blogFeed) {
        renderBlogFeed(sortedPosts, blogFeed);
        injectSidebar(sortedPosts);
    }

    // C. Renderizar Sidebar en Artículos Individuales
    const articleSidebar = document.getElementById('article-sidebar');
    const standaloneSidebar = document.getElementById('sidebar-container');
    if (articleSidebar || (standaloneSidebar && !blogFeed)) {
        injectSidebar(sortedPosts);
    }
});

// --- FUNCIONES DE INYECCIÓN ---

function injectHeader() {
    const headerHTML = `
        <div class="logo">
            <a href="${pathPrefix}index.html"><img src="${pathPrefix}/assets/img/logo-andiza.webp" alt="Logo Andiza" style="height: 25px;"></a>
        </div>
        <button class="mobile-menu-btn" aria-label="Menú">
            ☰
        </button>
        <nav class="nav-menu">
            <a href="${pathPrefix}index.html" class="nav-link">Inicio</a>
            <a href="${pathPrefix}blog.html" class="nav-link">Blog</a>
            <a href="${pathPrefix}construccion.html" class="nav-link road-btn">Road Ecuador</a>
        </nav>
    `;
    const header = document.getElementById('main-header');
    if(header) { 
        header.classList.add('site-header'); 
        header.innerHTML = headerHTML; 

        // Lógica del menú móvil (Responsive)
        const btn = header.querySelector('.mobile-menu-btn');
        const nav = header.querySelector('.nav-menu');
        if(btn && nav) {
            btn.addEventListener('click', () => {
                nav.classList.toggle('active');
                btn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
            });
        }
    }
}

function injectFooter() {
    const year = new Date().getFullYear();
    const footerHTML = `
        <div class="footer-grid">
            <div>
                <div class="logo" style="margin-bottom:1.5rem;">
                    <a href="${pathPrefix}index.html">
                        <img src="${pathPrefix}/assets/img/logo-andiza.webp" alt="Logo Andiza" style="height: 23px; display: block;">
                    </a>
                </div>
                <p>Estrategia y gestión administrativa para potenciar el agro y turismo en Ecuador.</p>
            </div>
            <div>
                <h4 class="footer-title">Navegación</h4>
                <ul>
                    <li><a href="${pathPrefix}index.html">Inicio</a></li>
                    <li><a href="${pathPrefix}blog.html">Blog & Recursos</a></li>
                    <li><a href="${pathPrefix}construccion.html">Road Ecuador</a></li>
                </ul>
            </div>
            <div>
                <h4 class="footer-title">Contacto</h4>
                <p>info.andiza@gmail.com</p>
                <p>Quito, Pichincha</p>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; ${year} Andiza. Todos los derechos reservados.
        </div>
    `;
    const footer = document.getElementById('main-footer');
    if(footer) { footer.classList.add('site-footer'); footer.innerHTML = footerHTML; }
}

// --- RENDERIZADO DE POSTS ---

// Para el Home (Tarjetas simples Grid)
function renderHomePosts(posts, container) {
    if (posts.length === 0) {
        container.innerHTML = '<p>No hay entradas recientes.</p>';
        return;
    }
    let html = '';
    posts.forEach(post => {
        const linkPath = isSubfolder ? post.link : `entradas/${post.link}`;
        html += `
            <article class="blog-card-modern" style="box-shadow: none; border: 1px solid #eee;">
                <div class="bc-img-container" style="height: 200px;">
                    <img src="${post.image}" alt="${post.title}" class="bc-img" loading="lazy">
                </div>
                <div class="bc-content" style="padding: 1.5rem;">
                    <div class="bc-meta">${post.category} • ${formatDate(post.date)}</div>
                    <h3 class="bc-title" style="font-size: 1.2rem;"><a href="${linkPath}">${post.title}</a></h3>
                    <a href="${linkPath}" class="bc-link">Leer más</a>
                </div>
            </article>
        `;
    });
    container.innerHTML = html;
}

// Para el Blog Page (Layout Vertical Grande)
function renderBlogFeed(posts, container) {
    if (posts.length === 0) {
        container.innerHTML = '<p>Próximamente publicaremos artículos.</p>';
        return;
    }
    let html = '';
    posts.forEach(post => {
        const linkPath = `entradas/${post.link}`;
        html += `
            <article class="blog-card-modern">
                <div class="bc-img-container">
                    <img src="${post.image}" alt="${post.title}" class="bc-img" loading="lazy">
                </div>
                <div class="bc-content">
                    <div class="bc-meta">${post.category} — ${formatDate(post.date)}</div>
                    <h2 class="bc-title"><a href="${linkPath}">${post.title}</a></h2>
                    <p class="bc-excerpt">${post.excerpt}</p>
                    <a href="${linkPath}" class="bc-link">Leer artículo completo</a>
                </div>
            </article>
        `;
    });
    container.innerHTML = html;
}

// --- SIDEBAR (Widget Dinámico - Versión Corregida) ---
function injectSidebar(posts) {
    // 1. Validación de seguridad
    if (!posts || posts.length === 0) return;

    // 2. DETECCIÓN AUTOMÁTICA DE UBICACIÓN
    // Verificamos si estamos dentro de la carpeta "/entradas/" viendo la URL actual
    const isSubfolder = window.location.pathname.includes('/entradas/');
    
    // Definimos los prefijos según dónde estemos
    const linkPrefix = isSubfolder ? '' : 'entradas/';   // Si ya estoy en entradas, el link es directo. Si estoy fuera, agrego 'entradas/'
    const imgPrefix = isSubfolder ? '../' : '';          // Si estoy en entradas, debo salir (../) para buscar assets.

    // 3. Generar Widget Recientes
    const recentPosts = posts.slice(0, 4);
    let recentHTML = '<div class="widget"><h4 class="widget-title">Recientes</h4><ul>';
    
    recentPosts.forEach(post => {
        // Corrección: Usamos los prefijos calculados arriba
        // Asumimos que post.link es algo como "mi-articulo.html"
        // Asumimos que post.image es "assets/img/..."
        
        recentHTML += `
            <li>
                <a href="${linkPrefix}${post.link}" class="widget-post-link">
                    <img src="${imgPrefix}${post.image}" alt="${post.title}" class="widget-thumb" loading="lazy">
                    <span class="widget-post-title">${post.title}</span>
                </a>
            </li>
        `;
    });
    recentHTML += '</ul></div>';

    // 4. Widget Categorías (Estático)
    // Nota: A los enlaces estáticos también hay que arreglarles la ruta si estamos en subcarpeta
    // Si tus enlaces de categoría van al root (ej. blog.html), usa '../' si es subfolder
    const rootPath = isSubfolder ? '../' : '';
    
    const catHTML = `
        <div class="widget">
            <h4 class="widget-title">Categorías</h4>
            <ul>
                <li><a href="#">Gestión Administrativa</a></li>
                <li><a href="#">Turismo Sostenible</a></li>
                <li><a href="#">Agroindustria 4.0</a></li>
                <li><a href="#">Finanzas & Auditoría</a></li>
            </ul>
        </div>
    `;

    // 5. Widget Newsletter
    const newsHTML = `
        <div class="widget" style="background: var(--primary, #2c3e50); color: white;">
            <h4 class="widget-title" style="color:var(--accent, #e67e22); border-color:white;">Newsletter</h4>
            <p style="font-size:0.9rem; color:#ddd; margin-bottom:1rem;">Recibe tips de gestión directos a tu correo.</p>
            <input type="email" placeholder="Tu correo..." style="width:100%; padding:10px; border-radius:4px; border:none; margin-bottom:10px;">
            <button class="btn btn-primary" style="width:100%; font-size:0.8rem; cursor:pointer;">Suscribirse</button>
        </div>
    `;

    // 6. Inyección en el DOM 
    const sidebarContainer = document.getElementById('sidebar-container') || document.getElementById('article-sidebar');

    if (sidebarContainer) {
        sidebarContainer.innerHTML = recentHTML + catHTML + newsHTML;
    } else {
        console.warn('No se encontró ningún contenedor de sidebar (#sidebar-container o #article-sidebar).');
    }
}

// --- FORMULARIO DE CONTACTO ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJkTHYzZOkwiFPmpjn-WC93NFQ8iXlFk6P-t90K7aeRTDdPpgghMXQl0fPKB0ASDsq/exec';

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const status = document.getElementById('form-status');

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        try {
            const formData = new FormData(this);
            formData.append('origin', window.location.hostname);
            await fetch(SCRIPT_URL, { method: 'POST', body: new URLSearchParams(formData) });
            status.textContent = '✓ Mensaje enviado. Te contactaremos pronto.';
            status.style.color = 'green';
            this.reset();
        } catch {
            status.textContent = '✗ Error al enviar. Intenta de nuevo.';
            status.style.color = 'red';
        }

        status.style.display = 'block';
        btn.textContent = 'Enviar Mensaje';
        btn.disabled = false;
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}