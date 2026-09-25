document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]')
  if (!form) return

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const buttonText = submitButton?.querySelector<HTMLElement>('[data-button-text]')
  const status = form.querySelector<HTMLElement>('[data-form-status]')
  const privacy = form.querySelector<HTMLInputElement>('[name="privacy"]')
  const privacyWrapper = form.querySelector<HTMLElement>('[data-privacy-wrapper]')
  const privacyError = form.querySelector<HTMLElement>('[data-privacy-error]')
  const endpoint = form.dataset.endpoint ?? ''

  const fields = [
    { id: 'f-name', message: 'Please enter your name.' },
    { id: 'f-email', message: 'Please enter a valid email address.' },
    { id: 'f-type', message: 'Please select a project type.' },
    { id: 'f-message', message: 'Please describe your project.' },
  ]

  const validateField = (id: string, message: string) => {
    const field = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
    if (!field) return true
    const valid = field.checkValidity()
    const error = field.closest('.form-field')?.querySelector<HTMLElement>('.field-error')
    field.setAttribute('aria-invalid', String(!valid))
    if (error) error.textContent = valid ? '' : message
    return valid
  }

  fields.forEach(({ id, message }) => {
    const field = document.getElementById(id)
    field?.addEventListener('blur', () => validateField(id, message))
    field?.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(id, message)
    })
  })

  const validatePrivacy = () => {
    const valid = Boolean(privacy?.checked)
    privacy?.setAttribute('aria-invalid', String(!valid))
    privacyWrapper?.classList.toggle('has-error', !valid)
    if (privacyError) privacyError.textContent = valid ? '' : 'Please confirm that you have read the privacy policy.'
    return valid
  }

  privacy?.addEventListener('change', validatePrivacy)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    form.noValidate = true
    const valid = [...fields.map(({ id, message }) => validateField(id, message)), validatePrivacy()].every(Boolean)

    if (!valid) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    if (submitButton) submitButton.disabled = true
    form.setAttribute('aria-busy', 'true')
    if (buttonText) buttonText.textContent = endpoint ? 'Sending…' : 'Preparing…'
    if (status) {
      status.dataset.state = ''
      status.textContent = ''
    }

    if (!endpoint) {
      const data = new FormData(form)
      const subject = `RF project enquiry — ${String(data.get('name') ?? '')}`
      const body = [
        `Name: ${String(data.get('name') ?? '')}`,
        `Company: ${String(data.get('company') ?? '')}`,
        `Email: ${String(data.get('email') ?? '')}`,
        `Project type: ${String(data.get('project_type') ?? '')}`,
        `Frequency: ${String(data.get('frequency') ?? '')}`,
        '',
        String(data.get('message') ?? ''),
      ].join('\n')
      if (status) status.textContent = 'Your email application is opening with the project details.'
      window.location.href = `mailto:contact@skybandsemi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      if (submitButton) submitButton.disabled = false
      form.setAttribute('aria-busy', 'false')
      if (buttonText) buttonText.textContent = 'Send enquiry'
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })

      if (!response.ok) throw new Error('Submission failed')

      form.reset()
      if (status) status.textContent = 'Thank you. Your enquiry has been received and will be reviewed within one business day.'
      if (buttonText) buttonText.textContent = 'Enquiry sent'
    } catch {
      if (status) {
        status.dataset.state = 'error'
        status.textContent = 'The enquiry could not be sent. Please email contact@skybandsemi.com.'
      }
      if (submitButton) submitButton.disabled = false
      if (buttonText) buttonText.textContent = 'Send enquiry'
    } finally {
      form.setAttribute('aria-busy', 'false')
    }
  })
})
