import '../css/main.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Nav scroll effect ─────────────────────────────── */
const nav = document.querySelector('.nav')
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20)
  }, { passive: true })
}

/* ── Hamburger menu ────────────────────────────────── */
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

/* ── Active nav link ───────────────────────────────── */
const path = window.location.pathname.replace(/\/$/, '') || '/index'
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href')?.replace(/\/$/, '')
  if (href && (path.endsWith(href) || (path === '' && href === '/') || (path.includes('index') && href === '/'))) {
    a.classList.add('active')
  }
})

/* ── GSAP Scroll animations ────────────────────────── */
function initAnimations() {
  // Fade up
  gsap.utils.toArray('.anim-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })
  // Fade left
  gsap.utils.toArray('.anim-fade-left').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })
  // Fade right
  gsap.utils.toArray('.anim-fade-right').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })
  // Scale in
  gsap.utils.toArray('.anim-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1, scale: 1, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  })
  // Stagger groups
  document.querySelectorAll('.anim-stagger').forEach(group => {
    const children = group.querySelectorAll(':scope > *')
    children.forEach(c => {
      c.style.opacity = '0'
      c.style.transform = 'translateY(28px)'
    })
    gsap.to(children, {
      opacity: 1, y: 0, duration: .7, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    })
  })
}

// Hero entrance
function heroEntrance() {
  const tl = gsap.timeline({ delay: .1 })
  const items = document.querySelectorAll('.hero-enter')
  if (!items.length) return
  items.forEach((el, i) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
  })
  tl.to('.hero-enter', {
    opacity: 1, y: 0, duration: .75, stagger: .12, ease: 'power3.out'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initAnimations()
  heroEntrance()
})
