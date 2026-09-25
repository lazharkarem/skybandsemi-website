import '../css/main.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Nav scroll effect ──────────────────────────────── */
const nav = document.querySelector('.nav')
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20)
  }, { passive: true })
}

/* ── Mobile Nav ─────────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger')
const mobileNav = document.getElementById('mobile-nav')
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true'
    hamburger.setAttribute('aria-expanded', !isOpen)
    hamburger.classList.toggle('open')
    mobileNav.classList.toggle('open')
  })
}

/* ── Active Nav Link ────────────────────────────────── */
const currentPath = window.location.pathname
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/')) {
    link.classList.add('active')
  }
})

/* ── Page Transitions handled natively by CSS @view-transition ─
   No JavaScript needed — browser handles the animation automatically
   See main.css: @view-transition { navigation: auto } ────────── */

/* ── HEADLINE REVEAL (blur slide-in) ──────────────────── */
document.querySelectorAll('.h1, .h2').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
    duration: 1.6,
    ease: 'power3.out'
  })
})

/* ── Scroll Reveal Animations ────────────────────────── */
gsap.utils.toArray('.anim-fade').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, y: 0, duration: 1.4, ease: 'power3.out'
  })
})
gsap.utils.toArray('.anim-fade-left').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, x: 0, duration: 1.4, ease: 'power3.out'
  })
})
gsap.utils.toArray('.anim-fade-right').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, x: 0, duration: 1.4, ease: 'power3.out'
  })
})
gsap.utils.toArray('.anim-stagger').forEach(container => {
  gsap.to(container.children, {
    scrollTrigger: { trigger: container, start: 'top 88%' },
    opacity: 1, y: 0, x: 0, scale: 1, duration: 1.2,
    stagger: 0.15, ease: 'power3.out'
  })
})

/* ── Hero Parallax ──────────────────────────────────── */
const heroCircuit = document.querySelector('.hero-circuit-svg')
if (heroCircuit) {
  gsap.to(heroCircuit, {
    y: '20%', ease: 'none',
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true }
  })
}

/* ── Stat Counters ──────────────────────────────────── */
document.querySelectorAll('.stat-num[data-count]').forEach(stat => {
  const target = parseInt(stat.getAttribute('data-count'))
  const suffix = stat.getAttribute('data-suffix') || ''
  gsap.to({ val: 0 }, {
    val: target, duration: 2.2, ease: 'power3.out',
    scrollTrigger: { trigger: stat, start: 'top 90%' },
    onUpdate: function() { stat.innerText = Math.floor(this.targets()[0].val) + suffix }
  })
})

/* ── Frequency Bars ─────────────────────────────────── */
document.querySelectorAll('.freq-bar').forEach(bar => {
  const width = bar.style.width || bar.getAttribute('data-width')
  if (width) {
    bar.style.width = '0%'
    gsap.to(bar, {
      width: width, duration: 1.8, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: bar, start: 'top 90%' }
    })
  }
})

/* ── AMBIENT GLOW NODES (semiconductor signal pulses) ─── */
document.querySelectorAll('.bg-circuit, .bg-circuit-dark, .page-hero').forEach(bg => {
  if (window.getComputedStyle(bg).position === 'static') bg.style.position = 'relative'
  bg.style.overflow = 'hidden'
  const count = 5
  for (let i = 0; i < count; i++) {
    // Large glow
    const px = document.createElement('div')
    px.className = 'data-pulse-x'
    px.style.top = (Math.random() * 80 + 10) + '%'
    px.style.left = (Math.random() * 80 + 10) + '%'
    px.style.animationDelay = (i * 1.6) + 's'
    bg.appendChild(px)
    // Small glow
    const py = document.createElement('div')
    py.className = 'data-pulse-y'
    py.style.top = (Math.random() * 70 + 15) + '%'
    py.style.left = (Math.random() * 70 + 15) + '%'
    py.style.animationDelay = (i * 2.2 + 1.1) + 's'
    bg.appendChild(py)
  }
})
