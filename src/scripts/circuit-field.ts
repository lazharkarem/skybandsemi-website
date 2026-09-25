
type Point = [number, number]

interface Pulse {
  offset: number
  speed: number
}

interface Trace {
  points: Point[]
  cumulative: number[]
  total: number
  pulses: Pulse[]
}

const sampleTrace = (trace: Trace, progress: number): Point => {
  const distance = Math.min(Math.max(progress, 0), 1) * trace.total
  for (let index = 1; index < trace.cumulative.length; index += 1) {
    const end = trace.cumulative[index]
    if (distance > end && index < trace.cumulative.length - 1) continue
    const start = trace.cumulative[index - 1]
    const span = end - start || 1
    const ratio = (distance - start) / span
    const [x1, y1] = trace.points[index - 1]
    const [x2, y2] = trace.points[index]
    return [x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio]
  }
  return trace.points[trace.points.length - 1]
}

const buildTraces = (width: number, height: number): Trace[] => {
  const columns = Math.max(2, Math.round(width / 78))
  const rows = Math.max(2, Math.round(height / 78))
  const xAt = (index: number) => (width / columns) * index
  const yAt = (index: number) => (height / rows) * index
  const total = Math.min(22, Math.max(9, Math.round((width * height) / 78000)))
  const traces: Trace[] = []

  for (let index = 0; index < total; index += 1) {
    let column = Math.floor(Math.random() * (columns + 1))
    let row = Math.floor(Math.random() * (rows + 1))
    const points: Point[] = [[xAt(column), yAt(row)]]
    const segments = 2 + Math.floor(Math.random() * 3)
    let horizontal = Math.random() > .5

    for (let step = 0; step < segments; step += 1) {
      const distance = 1 + Math.floor(Math.random() * 2)
      const direction = Math.random() > .5 ? 1 : -1
      if (horizontal) {
        column = Math.min(columns, Math.max(0, column + distance * direction))
      } else {
        row = Math.min(rows, Math.max(0, row + distance * direction))
      }
      points.push([xAt(column), yAt(row)])
      horizontal = !horizontal
    }

    const cumulative = [0]
    let length = 0
    for (let step = 1; step < points.length; step += 1) {
      length += Math.hypot(points[step][0] - points[step - 1][0], points[step][1] - points[step - 1][1])
      cumulative.push(length)
    }

    const pulseCount = Math.random() > .55 ? 2 : 1
    const pulses: Pulse[] = []
    for (let pulse = 0; pulse < pulseCount; pulse += 1) {
      pulses.push({
        offset: Math.random(),
        speed: .07 + Math.random() * .13,
      })
    }

    traces.push({ points, cumulative, total: length, pulses })
  }

  return traces
}

const strokePath = (context: CanvasRenderingContext2D, points: Point[]) => {
  context.beginPath()
  context.moveTo(points[0][0], points[0][1])
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index][0], points[index][1])
  }
  context.stroke()
}

const drawPads = (context: CanvasRenderingContext2D, traces: Trace[], color: string) => {
  context.fillStyle = color
  for (const trace of traces) {
    for (const [x, y] of trace.points) {
      context.fillRect(x - 2, y - 2, 4, 4)
    }
  }
}

const drawPulses = (context: CanvasRenderingContext2D, traces: Trace[], elapsed: number) => {
  context.lineCap = 'round'
  context.lineJoin = 'round'

  for (const trace of traces) {
    for (const pulse of trace.pulses) {
      const progress = (pulse.offset + elapsed * pulse.speed) % 1
      const head = sampleTrace(trace, progress)

      for (let step = 1; step <= 7; step += 1) {
        const tail = sampleTrace(trace, progress - step * .012)
        const alpha = .5 * (1 - step / 8)
        context.strokeStyle = `rgba(141, 226, 218, ${alpha.toFixed(3)})`
        context.lineWidth = 2.4 - step * .22
        strokePath(context, [tail, head])
      }

      context.fillStyle = 'rgba(214, 250, 246, .95)'
      context.beginPath()
      context.arc(head[0], head[1], 1.9, 0, Math.PI * 2)
      context.fill()
    }
  }
}



const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('[data-circuit-field]'))

const mount = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d')
  if (!context) return

  let width = 0
  let height = 0
  let traces: Trace[] = []
  let frame = 0
  let running = false
  let visible = true
  let elapsed = 0
  let previous = performance.now()

  const paintStatic = () => {
    context.clearRect(0, 0, width, height)
    context.lineWidth = 1
    context.strokeStyle = 'rgba(141, 226, 218, .09)'
    context.lineCap = 'round'
    for (const trace of traces) strokePath(context, trace.points)
    drawPads(context, traces, 'rgba(141, 226, 218, .16)')
  }

  const resize = () => {
    const bounds = canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
    width = Math.max(1, Math.round(bounds.width))
    height = Math.max(1, Math.round(bounds.height))
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    traces = buildTraces(width, height)
    paintStatic()
  }

  const render = (now: number) => {
    const delta = Math.min((now - previous) / 1000, .05)
    previous = now
    elapsed += delta

    context.clearRect(0, 0, width, height)
    context.lineWidth = 1
    context.strokeStyle = 'rgba(141, 226, 218, .09)'
    context.lineCap = 'round'
    for (const trace of traces) strokePath(context, trace.points)
    drawPulses(context, traces, elapsed)

    if (running) frame = requestAnimationFrame(render)
  }

  resize()

  const start = () => {
    if (running || !visible) return
    running = true
    previous = performance.now()
    frame = requestAnimationFrame(render)
  }

  const stop = () => {
    if (!running) return
    running = false
    cancelAnimationFrame(frame)
  }


  start()

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  }, { threshold: 0 })

  observer.observe(canvas)
  window.addEventListener('resize', resize, { passive: true })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return
    stop()
    observer.disconnect()
  })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) start()
  })
}

canvases.forEach(mount)
