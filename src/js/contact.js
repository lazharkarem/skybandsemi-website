/* ── Contact form logic ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form')
  const btn  = document.getElementById('submit-btn')
  const ok   = document.getElementById('form-success')
  if (!form) return

  const required = [
    { id: 'f-name',    wrap: 'fw-name',    msg: 'Please enter your name.' },
    { id: 'f-email',   wrap: 'fw-email',   msg: 'Please enter a valid email.' },
    { id: 'f-type',    wrap: 'fw-type',    msg: 'Please select a project type.' },
    { id: 'f-message', wrap: 'fw-message', msg: 'Please describe your project.' },
  ]

  function validate(field) {
    const el = document.getElementById(field.id)
    const wrap = document.getElementById(field.wrap)
    const err  = wrap?.querySelector('.f-error')
    const valid = el?.validity.valid
    wrap?.classList.toggle('has-err', !valid)
    if (err) err.textContent = valid ? '' : field.msg
    return valid
  }

  required.forEach(f => {
    const el = document.getElementById(f.id)
    el?.addEventListener('blur', () => validate(f))
    el?.addEventListener('input', () => {
      if (document.getElementById(f.wrap)?.classList.contains('has-err')) validate(f)
    })
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    let ok2 = required.every(f => validate(f))
    const privacy = document.getElementById('f-privacy')
    if (!privacy?.checked) ok2 = false

    if (!ok2) {
      form.querySelector('.has-err input, .has-err select, .has-err textarea')?.focus()
      return
    }

    btn.disabled = true
    btn.querySelector('.btn-text').textContent = 'Sending…'

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
      if (!res.ok) throw new Error()
      form.style.display = 'none'
      ok?.classList.add('visible')
      ok?.focus()
    } catch {
      btn.disabled = false
      btn.querySelector('.btn-text').textContent = 'Send message'
      alert('Something went wrong. Please email us at contact@skybandsemi.com')
    }
  })
})
