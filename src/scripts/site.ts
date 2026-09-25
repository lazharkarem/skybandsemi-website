import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Navigation ──────────────────────────────────────────────────────────────
const header = document.querySelector<HTMLElement>('[data-site-header]')
const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
const menuPanel = document.querySelector<HTMLElement>('[data-mobile-panel]')
const menuLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]'))

const setMenu = (open: boolean) => {
  if (!menuToggle || !menuPanel) return
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
  menuPanel.setAttribute('aria-hidden', String(!open))
  menuPanel.classList.toggle('is-open', open)
  menuPanel.toggleAttribute('inert', !open)
  document.body.classList.toggle('menu-open', open)
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true'
  setMenu(open)
  if (open) menuLinks[0]?.focus()
})

menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)))

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false)
    menuToggle.focus()
  }
})

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) setMenu(false)
})

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24)
updateHeader()
window.addEventListener('scroll', updateHeader, { passive: true })

// ── Card sweep elements ──────────────────────────────────────────────────────
document.querySelectorAll<HTMLElement>('.premium-card, .product-card, .platform-card, .phase-card').forEach((card) => {
  if (card.querySelector('.card-sweep')) return
  const sweep = document.createElement('span')
  sweep.className = 'card-sweep'
  sweep.setAttribute('aria-hidden', 'true')
  card.prepend(sweep)
})

// ── GSAP animations — always enabled ————————————————————————————————————
{
  gsap.registerPlugin(ScrollTrigger)

  // Use requestAnimationFrame to ensure all layout/fonts have been applied
  // before GSAP captures element positions and starts hero tweens.
  requestAnimationFrame(() => {
    gsap.context(() => {
        // Hero entrance — staggered reveal of copy, visual panel, and frequency bars
        if (document.querySelector('.home-hero')) {
          const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

          heroTimeline
            .from('.hero-copy > *', { opacity: 0, y: 24, duration: .72, stagger: .08 })
            .from('.hero-visual', { opacity: 0, x: 24, duration: .8 }, '-=.52')
            .from('.frequency-fill', { scaleX: 0, duration: .7, stagger: .08 }, '-=.58')
        }

        // Scroll-triggered single element reveals
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          if (element.closest('.home-hero')) return
          gsap.from(element, {
            opacity: 0,
            y: 24,
            duration: .72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          })
        })

        // Scroll-triggered staggered group reveals
        gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
          gsap.from(group.children, {
            opacity: 0,
            y: 20,
            duration: .66,
            stagger: .07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 86%',
              once: true,
            },
          })
        })

        // Matrix strength bar animations
        gsap.utils.toArray<HTMLElement>('.matrix-line').forEach((line) => {
          const target = line.style.getPropertyValue('--strength').trim()
          if (!target) return
          gsap.fromTo(line, { '--strength': '0%' }, {
            '--strength': target,
            duration: 1.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 90%',
              once: true,
            },
          })
        })

        // Hero image parallax
        if (document.querySelector('.home-hero-image')) {
          gsap.to('.home-hero-image', {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: '.home-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Counting number animations
        document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
          const target = Number(element.dataset.count ?? 0)
          const suffix = element.dataset.suffix ?? ''
          const state = { value: 0 }
          gsap.to(state, {
            value: target,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
            onUpdate: () => {
              element.textContent = `${Math.round(state.value)}${suffix}`
            },
          })
        })

        // Process timeline progress bar
        const progress = document.querySelector<HTMLElement>('[data-process-progress]')
        const timeline = document.querySelector<HTMLElement>('[data-process-timeline]')

        if (progress && timeline) {
          gsap.to(progress, {
            height: timeline.offsetHeight,
            ease: 'none',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 60%',
              end: 'bottom 72%',
              scrub: .35,
            },
          })

          gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
            ScrollTrigger.create({
              trigger: step,
              start: 'top 58%',
              end: 'bottom 42%',
              onEnter: () => step.classList.add('is-active'),
              onEnterBack: () => step.classList.add('is-active'),
              onLeave: () => step.classList.remove('is-active'),
              onLeaveBack: () => step.classList.remove('is-active'),
            })
          })
      }
    })
  })

  // Refresh ScrollTrigger after fonts, images, and layout settle
    let refreshTimer = 0
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 220)
    }

    window.addEventListener('load', scheduleRefresh)
    document.fonts?.ready.then(scheduleRefresh)
    document.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', scheduleRefresh, { once: true })
    })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) ScrollTrigger.refresh()
  })

  // Final safety net: clear any stuck invisible elements after page fully settles
  window.setTimeout(() => {
    ScrollTrigger.refresh()
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      const bounds = element.getBoundingClientRect()
      if (bounds.top < window.innerHeight * .95 && bounds.bottom > 0) {
        gsap.set(element, { clearProps: 'opacity,transform' })
      }
    })
  }, 2600)

}