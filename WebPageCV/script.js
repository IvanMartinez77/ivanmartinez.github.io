'use strict';

// Menú accesible en dispositivos móviles.
const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#site-nav');
if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

// Filtros de proyectos. Los proyectos ocultos se excluyen de la navegación por teclado.
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-category]')];
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => {
      card.hidden = filter !== 'todos' && card.dataset.category !== filter;
    });
  });
});

// Información para el diálogo. No se muestran capturas falsas ni se publican detalles privados.
const projects = {
  autolavado: {
    gallery: [
      ["ecommerce-inicio.webp", "Página de inicio", "Vista principal de la plataforma de comercio electrónico"],
      ["ecommerce-catalogo.webp", "Catálogo", "Listado de productos, búsqueda y filtros"],
      ["ecommerce-guias.webp", "Guías", "Contenido y navegación para orientar al cliente"],
      ["ecommerce-servicio.webp", "Servicios", "Presentación de los servicios del negocio"],
      ["ecommerce-pedidos.webp", "Pedidos", "Consulta del estado de pedidos mediante identificadores"]
    ],
    tag: 'ECOMMERCE · FULL STACK',
    title: 'Plataforma de comercio electrónico',
    description: 'Aplicación web para la venta de productos de automoción. El proyecto reúne experiencia de cliente y herramientas de gestión en una misma solución.',
    points: ['Catálogo de productos y navegación por categorías.', 'Lógica de pedidos, clientes y pagos en línea.', 'Panel de administración y almacenamiento de datos.', 'Tecnologías utilizadas en el proyecto: Node.js, Express, PostgreSQL, Stripe y Docker.']
  },
  albaigiene: {
    gallery: [
      ["web-negocio-inicio.webp", "Página de inicio", "Diseño de portada y presentación de servicios"],
      ["web-negocio-contacto.webp", "Zona de contacto", "Sección de contacto y navegación corporativa"]
    ],
    tag: 'DESARROLLO WEB · EMPRESA',
    title: 'Página web para negocio',
    description: 'Sitio corporativo orientado a mostrar los servicios de una empresa de manera clara y profesional.',
    points: ['Diseño adaptable a escritorio y dispositivos móviles.', 'Organización de la información corporativa y servicios.', 'Animaciones y transiciones al desplazarse por la página.', 'Atención al estilo visual y a la experiencia de navegación.']
  },
  cuadrantes: {
    gallery: [
      ["automatizacion-cuadrante.webp", "Cuadrante general", "Vista general de planificación semanal y resumen de personal"],
      ["automatizacion-disponibilidad.webp", "Disponibilidad", "Distribución de descansos y disponibilidad de conductores"],
      ["automatizacion-conductores.webp", "Conductores", "Administración de personas incluidas en el cuadrante"],
      ["automatizacion-ajustes.webp", "Ajustes", "Parámetros del ciclo, exportación e importación de datos"]
    ],
    tag: 'AUTOMATIZACIÓN · PROCESOS',
    title: 'Automatización de cuadrantes',
    description: 'Aplicación para visualizar cuadrantes, administrar conductores y automatizar ciclos de descansos. Es una versión inicial de planificación orientativa; no sustituye la verificación de la normativa aplicable.',
    points: ['Análisis de una necesidad administrativa recurrente.', 'Calendario semanal, disponibilidad del personal y configuración de descansos.', 'Gestión de conductores y opciones de importación/exportación.', 'Ejemplo demostrable bajo solicitud, usando datos de muestra.']
  },
  nube: {
    tag: 'SISTEMAS · REDES',
    title: 'Nube personal doméstica',
    description: 'Configuración de almacenamiento privado utilizando infraestructura de red doméstica.',
    points: ['Configuración de equipos y recursos de red.', 'Acceso a archivos desde dispositivos conectados.', 'Aprendizaje práctico de redes y almacenamiento.', 'Explicación técnica disponible sin divulgar datos de la red privada.']
  },
  coches: {
    tag: 'DESARROLLO WEB · AUTOMOCIÓN',
    title: 'Web de compraventa de vehículos',
    description: 'Proyecto web orientado a la presentación y exploración de vehículos en un catálogo.',
    points: ['Estructura y organización de contenidos de automoción.', 'Diseño de interfaz para consultar vehículos.', 'Desarrollo de una solución orientada a un caso de uso comercial.', 'Demostración del proyecto disponible bajo solicitud.']
  }
};
const dialog = document.querySelector('#project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogTag = document.querySelector('#dialog-tag');
const dialogDescription = document.querySelector('#dialog-description');
const dialogPoints = document.querySelector('#dialog-points');
const dialogEmail = document.querySelector('#dialog-email');
const projectGallery = document.querySelector('#project-gallery');
const galleryImage = document.querySelector('#gallery-image');
const galleryFull = document.querySelector('#gallery-full');
const galleryCaption = document.querySelector('#gallery-caption');
const galleryCounter = document.querySelector('#gallery-counter');
const galleryThumbs = document.querySelector('#gallery-thumbs');
const galleryPrev = document.querySelector('#gallery-prev');
const galleryNext = document.querySelector('#gallery-next');
let activeGallery = [];
let galleryIndex = 0;

function selectGalleryImage(index) {
  if (!activeGallery.length) return;
  galleryIndex = (index + activeGallery.length) % activeGallery.length;
  const [src, title, description] = activeGallery[galleryIndex];
  const url = `assets/${src}`;
  galleryImage.src = url;
  galleryImage.alt = `${title}. ${description}`;
  galleryFull.href = url;
  galleryCaption.textContent = `${title} · ${description}`;
  galleryCounter.textContent = `${galleryIndex + 1} / ${activeGallery.length}`;
  [...galleryThumbs.children].forEach((button, i) => {
    button.classList.toggle('is-active', i === galleryIndex);
    button.setAttribute('aria-pressed', String(i === galleryIndex));
  });
}

function setGallery(images) {
  activeGallery = images || [];
  projectGallery.hidden = activeGallery.length === 0;
  galleryThumbs.replaceChildren();
  if (!activeGallery.length) {
    galleryImage.removeAttribute('src');
    return;
  }
  activeGallery.forEach(([src,title], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumb';
    button.setAttribute('aria-label', `Ver imagen ${index + 1}: ${title}`);
    const img = document.createElement('img');
    img.src = `assets/${src}`;
    img.alt = '';
    img.loading = 'lazy';
    button.appendChild(img);
    button.addEventListener('click', () => selectGalleryImage(index));
    galleryThumbs.appendChild(button);
  });
  galleryPrev.hidden = activeGallery.length < 2;
  galleryNext.hidden = activeGallery.length < 2;
  selectGalleryImage(0);
}

if (dialog && typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-open-project]').forEach(button => {
    button.addEventListener('click', () => {
      const data = projects[button.dataset.openProject];
      if (!data) return;
      dialogTitle.textContent = data.title;
      dialogTag.textContent = data.tag;
      dialogDescription.textContent = data.description;
      dialogPoints.replaceChildren(...data.points.map(point => {
        const li = document.createElement('li');
        li.textContent = point;
        return li;
      }));
      setGallery(data.gallery);
      dialogEmail.href = 'mailto:ivanmartinez2004@outlook.es?subject=' + encodeURIComponent('Demostración de proyecto: ' + data.title);
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  galleryPrev?.addEventListener('click', () => selectGalleryImage(galleryIndex - 1));
  galleryNext?.addEventListener('click', () => selectGalleryImage(galleryIndex + 1));
  const closeDialog = () => dialog.close();
  document.querySelector('#close-dialog')?.addEventListener('click', closeDialog);
  document.querySelector('#close-dialog-bottom')?.addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('keydown', event => {
    if (!projectGallery.hidden && event.key === 'ArrowLeft') { selectGalleryImage(galleryIndex - 1); event.preventDefault(); }
    if (!projectGallery.hidden && event.key === 'ArrowRight') { selectGalleryImage(galleryIndex + 1); event.preventDefault(); }
  });
}

// Entrada suave de elementos cuando el visitante navega por la página.
const animated = [...document.querySelectorAll('[data-reveal]')];
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  animated.forEach(item => observer.observe(item));
} else {
  animated.forEach(item => item.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
