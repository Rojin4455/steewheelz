/**
 * Procedural placeholder "product photography".
 *
 * Renders isometric miniature dioramas as SVG data-URIs so the catalogue
 * looks complete before real photos exist. Every product image in
 * src/data/products.js is just a URL string — swap these for real photo
 * URLs (or Supabase Storage URLs) and nothing else needs to change.
 */

const C = 0.866
const S = 0.5
const SCALE = 1.32
const FONT = "'Arial Black', Arial, Helvetica, sans-serif"

/* ---------- colour utils ---------- */
const hexToRgb = (h) => {
  h = h.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const rgbToHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
const mix = (a, b, t) => {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t))
}
const shade = (c, t) => (t >= 0 ? mix(c, '#ffffff', t) : mix(c, '#000000', -t))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const f = (n) => n.toFixed(1)

/* ---------- drawing context ---------- */
function createCtx(night) {
  const out = []
  const cx = 474
  const cy = 435
  const P = (x, y, z = 0) => [cx + (x - y) * C, cy + (x + y) * S - z]
  const pts = (a) => a.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')
  const tone = (c, lit) => (night && !lit ? mix(c, '#141a33', 0.56) : c)
  const glowAttr = (lit) => (lit && night ? 'filter="url(#glow)"' : '')
  const raw = (s) => out.push(s)

  const poly = (arr, fill, attrs = '') => raw(`<polygon points="${pts(arr)}" fill="${fill}" ${attrs}/>`)

  const box = (x, y, z, w, d, h, c, o = {}) => {
    const base = tone(o.left ?? c, o.lit)
    const top = o.top ? tone(o.top, o.lit) : shade(tone(c, o.lit), 0.16)
    const right = o.right ? tone(o.right, o.lit) : shade(tone(c, o.lit), -0.2)
    poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], top)
    poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], base)
    poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], right)
  }
  // Face on a plane of constant y (front-left facing)
  const faceL = (x0, x1, z0, z1, y, fill, o = {}) =>
    poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], o.lit ? fill : tone(fill), `${glowAttr(o.lit)} ${o.attrs ?? ''}`)
  // Face on a plane of constant x (front-right facing)
  const faceR = (y0, y1, z0, z1, x, fill, o = {}) =>
    poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)], o.lit ? fill : tone(fill), `${glowAttr(o.lit)} ${o.attrs ?? ''}`)
  const flat = (x, y, w, d, z, fill, attrs = '') =>
    poly([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)], tone(fill), attrs)

  const text = (matrix, str, size, fill, o) =>
    raw(
      `<text transform="matrix(${matrix})" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${
        o.lit ? fill : tone(fill)
      }" text-anchor="${o.anchor ?? 'middle'}" letter-spacing="${o.ls ?? 1}" ${glowAttr(o.lit)}>${esc(str)}</text>`
    )
  const textL = (str, x, y, z, size, fill, o = {}) => {
    const [ox, oy] = P(x, y, z)
    text(`${C},${S},0,1,${f(ox)},${f(oy)}`, str, size, fill, o)
  }
  const textR = (str, x, y, z, size, fill, o = {}) => {
    const [ox, oy] = P(x, y, z)
    text(`${C},${-S},0,1,${f(ox)},${f(oy)}`, str, size, fill, o)
  }

  /* --- composite helpers --- */
  const glassDay = '#86aec4'
  const glassNight = '#ffd16a'
  const win = (x0, x1, z0, z1, y, o = {}) => {
    faceL(x0 - 2, x1 + 2, z0 - 2, z1 + 2, y, o.frame ?? '#2c3338')
    faceL(x0, x1, z0, z1, y, night ? glassNight : glassDay, { lit: night })
    if (!night) {
      const w = x1 - x0
      faceL(x0 + w * 0.12, x0 + w * 0.3, z0, z1, y, '#d6ebf5', { attrs: 'opacity=".55"' })
    }
  }
  const winR = (y0, y1, z0, z1, x, o = {}) => {
    faceR(y0 - 2, y1 + 2, z0 - 2, z1 + 2, x, o.frame ?? '#252b30')
    faceR(y0, y1, z0, z1, x, night ? shade(glassNight, -0.1) : shade(glassDay, -0.15), { lit: night })
  }
  const cyl = (x, y, z, r, h, color) => {
    const [px, pb] = P(x, y, z)
    const pt = pb - h
    const c = tone(color)
    raw(
      `<path d="M${f(px - r)},${f(pt)} L${f(px - r)},${f(pb)} A${r},${r * 0.5} 0 0 0 ${f(px + r)},${f(pb)} L${f(px + r)},${f(pt)} Z" fill="${shade(c, -0.15)}"/>`
    )
    raw(`<ellipse cx="${f(px)}" cy="${f(pt)}" rx="${r}" ry="${r * 0.5}" fill="${shade(c, 0.12)}"/>`)
  }
  const tree = (x, y, s = 1) => {
    box(x - 2, y - 2, 0, 4, 4, 20 * s, '#6b4a2b')
    const [px, py] = P(x, y, 20 * s + 12 * s)
    raw(`<circle cx="${f(px - 9 * s)}" cy="${f(py + 4 * s)}" r="${15 * s}" fill="${tone('#3c8346')}"/>`)
    raw(`<circle cx="${f(px + 9 * s)}" cy="${f(py + 2 * s)}" r="${15 * s}" fill="${tone('#33733d')}"/>`)
    raw(`<circle cx="${f(px)}" cy="${f(py - 9 * s)}" r="${16 * s}" fill="${tone('#4f9d55')}"/>`)
    raw(`<circle cx="${f(px - 5 * s)}" cy="${f(py - 14 * s)}" r="${6 * s}" fill="${tone('#79c27a')}" opacity=".7"/>`)
  }
  const bush = (x, y) => {
    const [px, py] = P(x, y, 6)
    raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="14" ry="9" fill="${tone('#3f8a48')}"/>`)
    raw(`<ellipse cx="${f(px - 3)}" cy="${f(py - 3)}" rx="7" ry="4" fill="${tone('#6cb36b')}" opacity=".8"/>`)
  }
  const wheels = (list) =>
    list.forEach(([x, y]) => {
      const [px, py] = P(x, y, 4)
      raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="5" ry="4.5" fill="${tone('#151515')}"/>`)
    })
  const car = (x, y, color, dir = 'x') => {
    if (dir === 'x') {
      box(x, y, 3, 40, 18, 9, color)
      box(x + 11, y + 2, 12, 19, 14, 8, shade(color, 0.08))
      faceL(x + 13, x + 28, 13, 19, y + 16, night ? '#55606b' : '#2d3a48')
      faceR(y + 3, y + 15, 13, 19, x + 30, night ? '#55606b' : '#3a4a5a')
      wheels([[x + 8, y + 18], [x + 32, y + 18]])
      if (night) {
        const [hx, hy] = P(x + 40, y + 9, 8)
        raw(`<ellipse cx="${f(hx + 20)}" cy="${f(hy + 8)}" rx="34" ry="12" fill="url(#beam)"/>`)
      }
    } else {
      box(x, y, 3, 18, 40, 9, color)
      box(x + 2, y + 10, 12, 14, 19, 8, shade(color, 0.08))
      faceL(x + 3, x + 15, 13, 19, y + 29, night ? '#55606b' : '#2d3a48')
      faceR(y + 12, y + 27, 13, 19, x + 16, night ? '#55606b' : '#3a4a5a')
      wheels([[x + 18, y + 8], [x + 18, y + 32]])
    }
  }
  const lamp = (x, y, h = 72) => {
    box(x, y, 0, 3, 3, h, '#2e2e2e')
    box(x - 5, y - 1, h, 12, 5, 3, '#3a3a3a')
    const [px, py] = P(x + 1, y + 1, h - 1)
    if (night) {
      raw(`<circle cx="${f(px)}" cy="${f(py + 30)}" r="46" fill="url(#halo)"/>`)
      raw(`<circle cx="${f(px)}" cy="${f(py)}" r="3.5" fill="#fff2c4" filter="url(#glow)"/>`)
    } else raw(`<circle cx="${f(px)}" cy="${f(py)}" r="2.5" fill="#f3e6b5"/>`)
  }
  const person = (x, y, color) => {
    const [px, py] = P(x, y, 0)
    raw(`<rect x="${f(px - 3)}" y="${f(py - 15)}" width="6" height="11" rx="3" fill="${tone(color)}"/>`)
    raw(`<rect x="${f(px - 2.5)}" y="${f(py - 6)}" width="5" height="6" rx="1.5" fill="${tone('#2f3640')}"/>`)
    raw(`<circle cx="${f(px)}" cy="${f(py - 18.5)}" r="3.4" fill="${tone('#e8b994')}"/>`)
  }
  const umbrella = (x, y, color) => {
    box(x - 1, y - 1, 0, 2, 2, 26, '#ddd')
    box(x - 7, y - 7, 10, 14, 14, 2, '#f1ede4')
    const [px, py] = P(x, y, 26)
    raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="22" ry="9" fill="${tone(shade(color, -0.15))}"/>`)
    raw(`<path d="M${f(px - 22)},${f(py)} Q${f(px)},${f(py - 22)} ${f(px + 22)},${f(py)} Z" fill="${tone(color)}"/>`)
  }
  const tyres = (x, y, n) => {
    for (let i = 0; i < n; i++) cyl(x, y, i * 7, 12, 7, '#26272a')
    const [px, py] = P(x, y, n * 7)
    raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="5" ry="2.5" fill="#0d0d0d"/>`)
  }
  const roundSign = (x, y, z, r, fill, stroke, inner) => {
    const [px, py] = P(x, y, z)
    raw(`<g ${glowAttr(true)}><circle cx="${f(px)}" cy="${f(py)}" r="${r + 4}" fill="${tone(stroke, true)}"/>`)
    raw(`<circle cx="${f(px)}" cy="${f(py)}" r="${r}" fill="${fill}"/>${inner(px, py)}</g>`)
  }

  return { out, P, tone, raw, poly, box, faceL, faceR, flat, textL, textR, win, winR, cyl, tree, bush, car, lamp, person, umbrella, tyres, roundSign, night }
}

/* ---------- scenes ---------- */

function plinth(ctx, p) {
  const { box, faceL, faceR, textL, flat } = ctx
  box(0, 0, -30, 360, 300, 30, '#6a4429', { top: p.ground ?? '#5d6168', left: '#70482a', right: '#4d2f1b' })
  faceL(0, 360, -5, 0, 300, '#8c5c35')
  faceR(0, 300, -5, 0, 360, '#6a4227')
  // grain lines
  for (let i = 0; i < 3; i++) faceL(0, 360, -12 - i * 6, -11.5 - i * 6, 300, '#5f3b22', { attrs: 'opacity=".5"' })
  // brass plaque
  faceL(122, 238, -24, -9, 300, '#8a6a2a')
  faceL(124, 236, -23, -10, 300, '#d4ae55')
  textL(p.plaque ?? 'STEEWHEELZ', 180, 300, -13.4, 7, '#3d2c0e', { lit: false, ls: 1.5 })
  // asphalt texture specks
  if (!p.noRoad) {
    for (let i = 0; i < 8; i++) flat(14 + i * 44, 284, 24, 4, 0.3, '#ece7da')
  }
}

const SCENES = {
  fuel(ctx, p) {
    const { box, flat, faceL, textL, win, winR, tree, car, lamp, person, raw, P, night, bush } = ctx
    const accent = p.accent
    flat(0, 0, 360, 44, 0.2, '#5f9c55')
    flat(0, 44, 360, 4, 0.3, '#d6d0c2')
    tree(22, 18, 1.1)
    bush(70, 20)
    // kiosk
    box(14, 14, 0, 140, 76, 64, '#f3efe6')
    win(26, 98, 10, 48, 90)
    faceL(110, 142, 0, 48, 90, '#2a333b')
    faceL(112, 140, 2, 46, 90, night ? '#ffd88a' : '#7fa3b7', { lit: night })
    winR(28, 76, 18, 46, 154)
    box(10, 10, 64, 148, 84, 13, accent)
    textL(p.retro ? 'SERVICE' : 'MART', 84, 94, 67, 10, '#ffffff', { lit: true, ls: 2 })
    // price pylon
    box(318, 36, 0, 6, 6, 118, '#a2a8ad')
    box(300, 32, 112, 42, 10, 62, accent)
    faceL(305, 337, 118, 168, 42, '#fbfbf7', { lit: night })
    textL(p.retro ? 'GAS' : 'FUEL', 321, 42, 156, 10, accent, { lit: true })
    textL('98.4', 321, 42, 141, 10, '#1d1d1d', { lit: true, ls: 0.5 })
    textL('102.1', 321, 42, 126, 10, '#1d1d1d', { lit: true, ls: 0.5 })
    // canopy glow on floor
    if (night) {
      const [gx, gy] = P(254, 200, 0)
      raw(`<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="150" ry="70" fill="url(#halo)" opacity=".9"/>`)
    }
    // pillars back
    box(182, 156, 0, 7, 7, 80, '#e6e6e2')
    box(318, 156, 0, 7, 7, 80, '#e6e6e2')
    // islands + pumps
    box(200, 180, 0, 112, 22, 4, '#cfcac0')
    for (const x of [218, 280]) {
      box(x, 180, 4, 16, 14, 38, '#f6f6f3')
      box(x - 1, 179, 36, 18, 16, 7, accent)
      faceL(x + 3, x + 13, 18, 30, 194, night ? '#8ff3cf' : '#1d2a33', { lit: night })
      faceL(x + 5, x + 11, 8, 13, 194, '#3a3a3a')
    }
    car(226, 208, p.carColor ?? '#2f5e9e')
    person(300, 216, '#e2a23a')
    person(150, 120, '#c94f4f')
    // pillars front
    box(182, 242, 0, 7, 7, 80, '#e6e6e2')
    box(318, 242, 0, 7, 7, 80, '#e6e6e2')
    // canopy
    box(164, 140, 80, 180, 120, 15, '#ffffff', { left: accent, right: shade(accent, -0.22), top: '#f4f4f1' })
    faceL(164, 344, 92, 94.5, 260, '#ffffff', { lit: true })
    textL(p.retro ? 'GASOLINE' : p.sign ?? 'FUEL', 254, 260, 83, 10.5, '#ffffff', { lit: true, ls: 3 })
    lamp(96, 256)
    tree(34, 200, 0.9)
    return [200, 140, 60]
  },

  burger(ctx, p) {
    const { box, flat, faceL, faceR, textL, win, winR, tree, car, lamp, person, roundSign, umbrella, bush } = ctx
    const wall = p.wall ?? '#c7432c'
    const trim = p.accent ?? '#f6b81a'
    flat(0, 0, 360, 30, 0.2, '#5f9c55')
    flat(0, 236, 96, 64, 0.25, '#5f9c55')
    for (let i = 0; i < 4; i++) flat(112 + i * 38, 226, 3, 50, 0.3, '#f3f1ea')
    tree(22, 14)
    bush(330, 18)
    box(40, 40, 0, 190, 110, 70, wall)
    faceL(40, 230, 0, 8, 150, shade(wall, -0.35))
    win(56, 104, 16, 54, 150)
    win(114, 162, 16, 54, 150)
    faceL(176, 212, 0, 52, 150, '#232b31')
    faceL(179, 209, 2, 50, 150, ctx.night ? '#ffd88a' : '#89adc0', { lit: ctx.night })
    winR(70, 112, 22, 48, 230)
    box(230, 64, 50, 10, 54, 4, trim)
    box(34, 34, 70, 202, 122, 22, trim)
    faceL(34, 236, 70, 73, 156, shade(trim, -0.3))
    textL(p.sign ?? 'BURGERS', 135, 156, 76.5, 14, wall === '#c7432c' ? '#a8231a' : shade(wall, -0.3), { lit: true, ls: 3 })
    box(78, 58, 92, 40, 30, 14, '#c8ccd1')
    box(150, 66, 92, 26, 22, 10, '#b6bbc1')
    // pole sign
    box(304, 52, 0, 7, 7, 176, '#a3a9ae')
    roundSign(307, 55, 210, 34, '#fff7e0', wall, (px, py) =>
      `<path d="M${px - 20},${py - 2} Q${px},${py - 26} ${px + 20},${py - 2} Z" fill="#e3a23a"/>` +
      `<rect x="${px - 21}" y="${py}" width="42" height="5" rx="2" fill="#4fae4a"/>` +
      `<rect x="${px - 21}" y="${py + 5}" width="42" height="7" rx="3" fill="#6b3a20"/>` +
      `<path d="M${px - 20},${py + 13} L${px + 20},${py + 13} Q${px + 18},${py + 22} ${px},${py + 22} Q${px - 18},${py + 22} ${px - 20},${py + 13} Z" fill="#e3a23a"/>`
    )
    umbrella(36, 266, trim)
    umbrella(72, 284, wall)
    car(118, 236, '#3b6fb6', 'y')
    car(156, 236, '#ecebe6', 'y')
    car(258, 160, '#2f2f33', 'y')
    person(208, 190, '#3aa0d8')
    lamp(244, 262)
    tree(340, 276, 0.85)
    return [140, 100, 50]
  },

  chicken(ctx, p) {
    const { box, flat, faceL, faceR, textL, win, winR, tree, car, lamp, person, raw, P, tone, umbrella, bush } = ctx
    const red = p.accent ?? '#c8202f'
    flat(0, 0, 360, 34, 0.2, '#5f9c55')
    for (let i = 0; i < 4; i++) flat(120 + i * 38, 222, 3, 52, 0.3, '#f3f1ea')
    tree(26, 16)
    bush(300, 20)
    box(50, 50, 0, 190, 106, 64, '#f4efe6')
    faceL(50, 240, 0, 9, 156, red)
    win(64, 112, 16, 50, 156)
    win(122, 170, 16, 50, 156)
    faceL(184, 220, 0, 50, 156, '#232b31')
    faceL(187, 217, 2, 48, 156, ctx.night ? '#ffd88a' : '#89adc0', { lit: ctx.night })
    winR(76, 136, 20, 48, 240)
    box(44, 44, 64, 202, 118, 22, '#ffffff')
    for (let i = 0; i < 10; i++) faceL(44 + i * 20.2, 54.1 + i * 20.2, 64, 86, 162, red)
    for (let i = 0; i < 6; i++) faceR(44 + i * 19.7, 53.8 + i * 19.7, 64, 86, 246, shade(red, -0.2))
    box(90, 150, 86, 120, 6, 24, red)
    textL(p.sign ?? 'CHICKEN', 150, 156, 92, 13, '#ffffff', { lit: true, ls: 3 })
    // bucket sign
    box(308, 58, 0, 7, 7, 160, '#a3a9ae')
    const [bx, by] = P(311, 61, 196)
    let stripes = ''
    for (let i = 0; i < 6; i++) {
      const t0 = i / 6
      const t1 = (i + 1) / 6
      const xt = (t) => bx - 30 + 60 * t
      const xb = (t) => bx - 22 + 44 * t
      stripes += `<polygon points="${f(xt(t0))},${f(by - 30)} ${f(xt(t1))},${f(by - 30)} ${f(xb(t1))},${f(by + 22)} ${f(xb(t0))},${f(by + 22)}" fill="${i % 2 ? '#ffffff' : red}"/>`
    }
    raw(`<g ${ctx.night ? 'filter="url(#glow)"' : ''}>${stripes}<ellipse cx="${f(bx)}" cy="${f(by - 30)}" rx="30" ry="7" fill="#fff4dc"/><ellipse cx="${f(bx)}" cy="${f(by + 22)}" rx="22" ry="5" fill="${shade(red, -0.2)}"/></g>`)
    void tone
    umbrella(40, 250, red)
    car(126, 232, '#d9a33a', 'y')
    car(202, 232, '#4b6b88', 'y')
    person(250, 186, '#2f8f5b')
    person(262, 196, '#e46b4c')
    lamp(290, 250)
    tree(338, 280, 0.85)
    return [150, 105, 50]
  },

  garage(ctx, p) {
    const { box, flat, faceL, textL, winR, tree, car, lamp, person, tyres, cyl, bush } = ctx
    const wall = p.wall ?? '#5d7f8e'
    const accent = p.accent ?? '#f2a93b'
    flat(0, 0, 360, 24, 0.2, '#5f9c55')
    flat(30, 130, 250, 60, 0.25, '#8a8d91')
    tree(18, 12, 0.9)
    box(30, 26, 0, 250, 104, 92, wall)
    faceL(30, 280, 0, 6, 130, shade(wall, -0.35))
    faceL(38, 272, 62, 66, 130, shade(wall, -0.3))
    const doors = [46, 118, 190]
    doors.forEach((x, i) => {
      faceL(x - 3, x + 63, 0, 63, 130, shade(wall, -0.4))
      if (i === 1) {
        faceL(x, x + 60, 0, 60, 130, ctx.night ? '#4a3a1c' : '#1c2126', { lit: ctx.night })
      } else {
        faceL(x, x + 60, 0, 60, 130, '#d0d5d9')
        for (let z = 6; z < 60; z += 6) faceL(x, x + 60, z, z + 1, 130, '#9aa3aa')
      }
    })
    winR(42, 112, 34, 68, 280)
    box(26, 22, 92, 258, 112, 6, shade(wall, -0.12))
    box(66, 124, 68, 176, 6, 20, '#1e272c')
    textL(p.sign ?? 'GARAGE', 154, 130, 73, 13, accent, { lit: true, ls: 4 })
    car(136, 132, p.carColor ?? '#b7372d', 'y')
    tyres(302, 156, 4)
    tyres(326, 176, 3)
    cyl(310, 112, 0, 9, 22, accent)
    cyl(328, 120, 0, 9, 22, shade(accent, -0.15))
    car(212, 214, '#e7c24a')
    person(110, 180, '#3a6fb0')
    lamp(30, 214)
    bush(330, 30)
    tree(346, 280, 0.85)
    return [150, 90, 50]
  },

  carwash(ctx, p) {
    const { box, flat, faceL, faceR, textL, win, tree, car, lamp, raw, P, roundSign, cyl, bush } = ctx
    const accent = p.accent ?? '#2b8fd6'
    flat(0, 0, 360, 34, 0.2, '#5f9c55')
    flat(0, 160, 360, 50, 0.25, '#7e8287')
    for (let i = 0; i < 8; i++) flat(10 + i * 46, 183, 22, 3, 0.35, '#f6f3ea')
    tree(20, 14)
    bush(110, 18)
    box(40, 50, 0, 230, 90, 58, '#eef2f5')
    faceL(40, 270, 0, 7, 140, accent)
    win(56, 100, 14, 46, 140)
    win(112, 156, 14, 46, 140)
    win(168, 212, 14, 46, 140)
    faceR(64, 128, 0, 48, 270, ctx.night ? '#2c4a68' : '#1f2e3c')
    cyl(276, 76, 0, 8, 44, '#3fa7e8')
    cyl(276, 116, 0, 8, 44, '#e84f7a')
    box(34, 44, 58, 244, 102, 12, accent)
    for (let i = 0; i < 12; i++) faceL(34 + i * 20.3, 44.5 + i * 20.3, 66, 70, 146, '#ffffff', { attrs: 'opacity=".35"' })
    textL(p.sign ?? 'CAR WASH', 156, 146, 61, 9, '#ffffff', { lit: true, ls: 3 })
    car(292, 80, p.carColor ?? '#d6453a')
    const [bx, by] = P(300, 96, 20)
    for (let i = 0; i < 9; i++)
      raw(`<circle cx="${f(bx + ((i * 23) % 50) - 20)}" cy="${f(by - ((i * 17) % 40))}" r="${3 + (i % 3) * 2}" fill="#ffffff" opacity=".75" stroke="#bfe3ff" stroke-width="1"/>`)
    box(318, 228, 0, 6, 6, 120, '#a3a9ae')
    roundSign(321, 231, 150, 26, '#ffffff', accent, (px, py) =>
      `<text x="${px}" y="${py + 6}" font-family="${FONT}" font-weight="900" font-size="15" fill="${accent}" text-anchor="middle">WASH</text>`
    )
    car(60, 168, '#ecebe6')
    car(140, 172, '#3f4a57')
    lamp(250, 240)
    tree(40, 270, 0.9)
    return [160, 100, 40]
  },

  shop(ctx, p) {
    const { box, flat, faceL, textL, win, winR, tree, car, lamp, person, umbrella, poly, P, tone, bush } = ctx
    const wall = p.wall ?? '#efe2c6'
    const awning = p.accent ?? '#2f7d5b'
    const floors = p.floors ?? 1
    const H = floors === 2 ? 122 : 74
    flat(0, 0, 360, 36, 0.2, '#5f9c55')
    flat(20, 150, 300, 44, 0.25, '#d7d1c3')
    for (let i = 0; i < 7; i++) flat(20 + i * 43, 150, 1, 44, 0.3, '#bdb6a6')
    tree(26, 14)
    bush(320, 22)
    box(50, 40, 0, 220, 110, H, wall)
    faceL(56, 264, 0, 54, 150, p.trim ?? '#27342d')
    win(64, 150, 8, 46, 150, { frame: p.trim ?? '#27342d' })
    faceL(160, 186, 0, 46, 150, '#5b3b26')
    faceL(163, 183, 22, 42, 150, ctx.night ? '#ffd88a' : '#89adc0', { lit: ctx.night })
    win(196, 256, 8, 46, 150, { frame: p.trim ?? '#27342d' })
    winR(60, 130, 16, 46, 270)
    faceL(56, 264, 56, 70, 150, p.signBg ?? '#1f2a24')
    textL(p.sign ?? 'GROCERY', 160, 150, 59.5, 10.5, p.signFg ?? '#f3d27a', { lit: true, ls: 4 })
    if (floors === 2) {
      for (const x of [70, 120, 170, 220]) {
        faceL(x - 4, x + 30, 80, 112, 150, '#fbf8f0')
        win(x, x + 26, 83, 109, 150, { frame: '#fbf8f0' })
      }
      winR(66, 96, 82, 108, 270)
      winR(108, 138, 82, 108, 270)
    }
    box(46, 36, H, 228, 118, 8, shade(wall, -0.18))
    // awning
    const n = 12
    for (let i = 0; i < n; i++) {
      const xa = 58 + (i * 204) / n
      const xb = 58 + ((i + 1) * 204) / n
      poly([P(xa, 150, 54), P(xb, 150, 54), P(xb, 176, 42), P(xa, 176, 42)], tone(i % 2 ? awning : '#fbf6ea'))
      poly([P(xa, 176, 42), P(xb, 176, 42), P(xb, 176, 36), P(xa, 176, 36)], tone(i % 2 ? shade(awning, -0.2) : '#e9e2d0'))
    }
    if (p.props === 'tables') {
      umbrella(90, 184, awning)
      umbrella(220, 184, awning)
      person(150, 186, '#c75b3c')
    } else {
      for (let i = 0; i < 5; i++) {
        box(70 + i * 20, 178, 0, 16, 11, 8, '#a5733f')
        const [px, py] = P(78 + i * 20, 183, 8)
        const colors = ['#e2483d', '#f2b632', '#7cb342', '#ff8c2e', '#9c4dcc']
        ctx.raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="7" ry="3.5" fill="${tone(colors[i])}"/>`)
      }
      person(232, 188, '#3b78c2')
    }
    car(140, 238, p.carColor ?? '#3b6fb6')
    lamp(30, 196)
    tree(320, 214, 0.9)
    return [160, 110, H / 2 + 10]
  },

  civic(ctx, p) {
    const { box, flat, faceL, faceR, textL, win, winR, tree, car, lamp, raw, P, cyl, bush } = ctx
    const wall = p.wall ?? '#a8402f'
    const accent = p.accent ?? '#c8102e'
    flat(0, 0, 360, 34, 0.2, '#5f9c55')
    flat(30, 150, 210, 80, 0.25, '#8a8d91')
    tree(22, 16)
    box(30, 40, 0, 200, 110, 96, wall)
    for (let z = 10; z < 96; z += 10) faceL(30, 230, z, z + 0.8, 150, shade(wall, -0.18), { attrs: 'opacity=".6"' })
    for (const x of [46, 122]) {
      faceL(x - 4, x + 66, 0, 70, 150, '#f1ece2')
      faceL(x, x + 62, 0, 66, 150, p.door ?? '#e7e2d6')
      for (let k = 0; k < 4; k++) faceL(x + 4 + k * 15, x + 15 + k * 15, 50, 60, 150, ctx.night ? '#ffd16a' : '#86aec4', { lit: ctx.night })
      for (let z = 8; z < 46; z += 8) faceL(x, x + 62, z, z + 1, 150, '#c9c3b6')
    }
    winR(60, 100, 40, 70, 230)
    winR(110, 140, 40, 70, 230)
    faceL(36, 224, 76, 90, 150, '#f4efe4')
    textL(p.sign ?? 'FIRE STATION', 130, 150, 79.5, 9.5, shade(wall, -0.35), { lit: true, ls: 3 })
    box(26, 36, 96, 208, 118, 6, shade(wall, -0.2))
    // tower
    box(232, 40, 0, 60, 60, 150, shade(wall, -0.05))
    win(248, 276, 100, 130, 100)
    faceR(52, 88, 100, 130, 292, ctx.night ? '#ffd16a' : '#2c3338', { lit: ctx.night })
    textL(p.towerText ?? '7', 262, 100, 52, 30, '#f4efe4', { lit: true, ls: 0 })
    box(228, 36, 150, 68, 68, 6, shade(wall, -0.25))
    // flag
    box(12, 196, 0, 3, 3, 140, '#cfcfcf')
    const [fx, fy] = P(13, 197, 138)
    raw(`<path d="M${f(fx)},${f(fy)} q14,-6 28,2 q14,8 28,0 l0,22 q-14,8 -28,0 q-14,-8 -28,-2 z" fill="${ctx.tone(accent)}"/>`)
    // vehicle
    if (p.vehicle === 'car') {
      car(70, 168, '#f4f4f2', 'y')
      car(104, 168, '#1f3a6b', 'y')
      car(190, 190, '#f4f4f2')
    } else {
      box(134, 156, 4, 28, 66, 24, accent)
      box(134, 216, 4, 28, 20, 34, accent)
      faceL(137, 159, 22, 34, 236, ctx.night ? '#6b7d8f' : '#2d3a48')
      box(138, 160, 28, 20, 50, 3, '#d5d5d5')
      faceR(160, 210, 10, 14, 162, '#f2f2f2')
      raw((() => {
        const pts = [[162, 168], [162, 196], [162, 226]]
        return pts.map(([x, y]) => { const [px, py] = P(x, y, 4); return `<ellipse cx="${f(px)}" cy="${f(py)}" rx="6" ry="5.5" fill="#151515"/>` }).join('')
      })())
      if (ctx.night) {
        const [lx, ly] = P(148, 236, 40)
        raw(`<circle cx="${f(lx)}" cy="${f(ly)}" r="4" fill="#ff4d4d" filter="url(#glow)"/>`)
      }
    }
    cyl(262, 176, 0, 5, 14, accent)
    bush(300, 140)
    lamp(260, 250)
    tree(330, 270, 0.95)
    return [140, 100, 70]
  },
}

/* ---------- variants ---------- */

const VARIANTS = {
  studio: { label: 'Studio' },
  night: { label: 'Night lighting' },
  detail: { label: 'Close-up' },
  showcase: { label: 'Display' },
}

function render(spec, variant) {
  const night = variant === 'night'
  const ctx = createCtx(night)
  plinth(ctx, spec)
  const focus = (SCENES[spec.type] ?? SCENES.shop)(ctx, spec)

  const [b1, b2] =
    variant === 'night'
      ? ['#2a3766', '#0b0f1f']
      : variant === 'showcase'
        ? ['#3a3129', '#110e0b']
        : spec.backdrop ?? ['#fbf4e2', '#ecd9ac']

  let viewBox = '0 0 1000 1000'
  if (variant === 'detail') {
    const [px, py] = ctx.P(...focus)
    const fx = 500 + (px - 500) * SCALE
    const fy = 620 + (py - 620) * SCALE
    viewBox = `${f(fx - 230)} ${f(fy - 230)} 460 460`
  }

  const extras =
    variant === 'showcase'
      ? `<polygon points="380,0 620,0 900,1000 100,1000" fill="url(#beamV)"/>`
      : variant === 'night'
        ? Array.from({ length: 40 }, (_, i) => {
            const x = (i * 197) % 1000
            const y = (i * 83) % 380
            return `<circle cx="${x}" cy="${y}" r="${i % 4 ? 1 : 1.8}" fill="#fff" opacity="${0.25 + (i % 5) / 10}"/>`
          }).join('')
        : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="1000" height="1000" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ffd77a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient>
<radialGradient id="beam"><stop offset="0" stop-color="#fff3c2" stop-opacity=".6"/><stop offset="1" stop-color="#fff3c2" stop-opacity="0"/></radialGradient>
<linearGradient id="beamV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd36b" stop-opacity=".22"/><stop offset=".8" stop-color="#ffd36b" stop-opacity="0"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect x="-500" y="-500" width="2000" height="2000" fill="url(#bg)"/>
<rect x="-500" y="620" width="2000" height="880" fill="url(#floor)"/>
${extras}
<g transform="translate(500 620) scale(${SCALE}) translate(-500 -620)">
<ellipse cx="505" cy="742" rx="330" ry="80" fill="#000" opacity="${night ? 0.5 : 0.28}" filter="url(#soft)"/>
${ctx.out.join('\n')}
</g>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/** Returns an array of image objects for a product's gallery. */
export function placeholderGallery(spec, variants = ['studio', 'night', 'detail', 'showcase']) {
  return variants.map((v) => ({ src: render(spec, v), alt: VARIANTS[v]?.label ?? v }))
}

export function placeholderImage(spec, variant = 'studio') {
  return render(spec, variant)
}
