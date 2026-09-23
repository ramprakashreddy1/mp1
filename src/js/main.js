const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = Array.from(navLinks, (link) => {
  return document.querySelector(link.getAttribute("href"));
});

function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 20);

  let currentSection = 0;
  const readingLine = navbar.offsetHeight + 16;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) {
      currentSection = index;
    }
  });

  const atPageBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
  if (atPageBottom) {
    currentSection = navLinks.length - 1;
  }

  navLinks.forEach((link, index) => {
    const isCurrent = index === currentSection;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let navbarUpdatePending = false;

function scheduleNavbarUpdate() {
  if (navbarUpdatePending) {
    return;
  }

  navbarUpdatePending = true;
  window.requestAnimationFrame(() => {
    updateNavbar();
    navbarUpdatePending = false;
  });
}

window.addEventListener("scroll", scheduleNavbarUpdate, { passive: true });
window.addEventListener("resize", scheduleNavbarUpdate);
updateNavbar();

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
const slideNumber = document.querySelector("#current-slide");
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.classList.remove("slide-2", "slide-3");
  if (currentSlide > 0) {
    track.classList.add(`slide-${currentSlide + 1}`);
  }
  slideNumber.textContent = currentSlide + 1;
}

document.querySelector(".previous").addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

document.querySelector(".next").addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

const modal = document.querySelector("#info-modal");
const openModalButton = document.querySelector("#open-modal");
const closeModalButtons = modal.querySelectorAll(".modal-close, .modal-done");
const modalFocusableElements = Array.from(
  modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
).filter((element) => !element.hasAttribute("disabled"));
let previouslyFocusedElement = null;

function closeModal() {
  if (!modal.classList.contains("open")) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
}

openModalButton.addEventListener("click", () => {
  previouslyFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    const firstFocusableElement = modalFocusableElements[0];
    const lastFocusableElement =
      modalFocusableElements[modalFocusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastFocusableElement
    ) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
