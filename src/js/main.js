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

/* ── Hamburger menu ─────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger')
const mobileNav = document.querySelector('.nav-mobile')
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open')
    mobileNav.classList.toggle('open', open)
    hamburger.setAttribute('aria-expanded', String(open))
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  })
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open')
      mobileNav.classList.remove('open')
      hamburger.setAttribute('aria-expanded', 'false')
      hamburger.setAttribute('aria-label', 'Open menu')
    })
  )
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open')
      mobileNav.classList.remove('open')
    }
  })
}

/* ── Active nav link ─────────────────────────────────── */
const path = window.location.pathname.replace(/\/$/, '') || '/index'
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href')?.replace(/\/$/, '')
  if (href && (path.endsWith(href) || (path === '' && href === '/') || (path.includes('index') && href === '/'))) {
    a.classList.add('active')
  }
})

/* ── Counter animation ───────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count)
  if (isNaN(target)) return
  const suffix = el.dataset.suffix || ''
  const prefix = el.dataset.prefix || ''
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0
  gsap.fromTo({ val: 0 }, { val: target }, {
    duration: 1.8,
    ease: 'power2.out',
    onUpdate: function () {
      el.textContent = prefix + this.targets()[0].val.toFixed(decimals) + suffix
    },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
  })
}
document.querySelectorAll('[data-count]').forEach(animateCounter)

/* ── GSAP Scroll animations ──────────────────────────── */
function initAnimations() {
  gsap.utils.toArray('.anim-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: .85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })
  gsap.utils.toArray('.anim-fade-left').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })
  gsap.utils.toArray('.anim-fade-right').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })
  gsap.utils.toArray('.anim-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1, scale: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })
  document.querySelectorAll('.anim-stagger').forEach(group => {
    const children = group.querySelectorAll(':scope > *')
    children.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(24px)' })
    gsap.to(children, {
      opacity: 1, y: 0, duration: .7, stagger: .09, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    })
  })

  /* Process step connector lines */
  document.querySelectorAll('.process-step').forEach((step, i) => {
    gsap.from(step, {
      opacity: 0, y: 30, duration: .7, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 88%', once: true }
    })
  })

  /* Frequency bars animate width on scroll */
  document.querySelectorAll('.freq-bar').forEach(bar => {
    const w = bar.style.width
    bar.style.width = '0%'
    gsap.to(bar, {
      width: w, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
    })
  })
}

/* ── Hero entrance ───────────────────────────────────── */
function heroEntrance() {
  const items = document.querySelectorAll('.hero-enter')
  if (!items.length) return
  items.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)' })
  gsap.to('.hero-enter', {
    opacity: 1, y: 0, duration: .8, stagger: .13, ease: 'power3.out', delay: .15
  })
}

/* ── Scan line on hero panel ─────────────────────────── */
function initScanline() {
  const panel = document.querySelector('.hero-panel')
  if (!panel) return
  const line = document.createElement('div')
  line.style.cssText = `position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(104,203,209,.25),transparent);pointer-events:none;z-index:10;`
  panel.appendChild(line)
  gsap.fromTo(line,
    { top: '0%' },
    { top: '100%', duration: 3, ease: 'none', repeat: -1, delay: .5 }
  )
}

/* ── Parallax on circuit SVG ─────────────────────────── */
function initParallax() {
  const svg = document.querySelector('.hero-circuit-svg')
  if (!svg) return
  gsap.to(svg, {
    y: '12%', ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: '40% top', scrub: 1 }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initAnimations()
  heroEntrance()
  initScanline()
  initParallax()
})
