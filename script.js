const body = document.body;
const navbar = document.querySelector(".navbar");
const progress = document.querySelector(".scroll-progress");
const scrollTopBtn = document.querySelector(".scroll-top");
const typedText = document.querySelector("#typedText");
const counters = document.querySelectorAll(".counter");
const navLinks = document.querySelectorAll(".nav-link, .nav-cta");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox-close");
const contactForm = document.querySelector(".contact-form");

const typingPhrases = [
  "nationwide activation campaigns",
  "premium brand experiences",
  "strategic communication plans",
  "consumer engagement journeys"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

window.addEventListener("load", () => {
  body.classList.add("loaded");

  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 80
  });

  initSwiper();
  typeLoop();
});

function initSwiper() {
  new Swiper(".testimonial-swiper", {
    loop: true,
    speed: 650,
    spaceBetween: 24,
    autoplay: {
      delay: 4200,
      disableOnInteraction: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      768: {
        slidesPerView: 2
      },
      1100: {
        slidesPerView: 3
      }
    }
  });
}

function typeLoop() {
  if (!typedText) return;

  const currentPhrase = typingPhrases[phraseIndex];
  const visibleText = isDeleting
    ? currentPhrase.slice(0, charIndex - 1)
    : currentPhrase.slice(0, charIndex + 1);

  typedText.textContent = visibleText;
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

  let delay = isDeleting ? 34 : 62;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1400;
    isDeleting = true;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    delay = 260;
  }

  window.setTimeout(typeLoop, delay);
}

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progress.style.width = `${scrollPercent}%`;
  navbar.classList.toggle("scrolled", scrollTop > 24);
  scrollTopBtn.classList.toggle("show", scrollTop > 520);
  setActiveNavLink();
}

function setActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  let activeId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      activeId = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse.show");
    if (navbarCollapse) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  });
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.6 });

counters.forEach((counter) => counterObserver.observe(counter));

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1450;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progressRatio = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progressRatio, 3);
    counter.textContent = Math.floor(eased * target);

    if (progressRatio < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const imagePath = item.dataset.img;
    lightboxImage.src = imagePath;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("show")) {
    closeLightbox();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = contactForm.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.textContent = "Request Prepared";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1800);
});

document.querySelector("#year").textContent = new Date().getFullYear();
