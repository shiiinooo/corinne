'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const rnd = (a, b) => a + Math.random() * (b - a)

/* ── Data generators (client-only) ── */

function genAmbientPetals() {
  const cols = ['#e89bb0','#f0b8c4','#e9a178','#f2c95e','#d97a98','#cfe0c3','#f4d4b0']
  return Array.from({ length: 18 }, (_, i) => {
    const size = rnd(9, 22)
    const dur  = rnd(12, 24)
    return {
      width:          size + 'px',
      height:         size * 1.25 + 'px',
      background:     cols[i % cols.length],
      borderRadius:   '54% 8% 54% 8%',
      position:       'absolute',
      left:           rnd(0, 100) + '%',
      top:            '-12vh',
      opacity:        rnd(0.35, 0.7),
      filter:         'blur(.2px)',
      animation:      `drift ${dur}s linear infinite`,
      animationDelay: -rnd(0, dur) + 's',
      pointerEvents:  'none',
    }
  })
}

function genBurstPetals() {
  const cols = ['#e58aa6','#f0b8c4','#e9a178','#f2c95e','#d4738f','#f4d4b0','#cfe0c3']
  return Array.from({ length: 56 }, (_, i) => {
    const ang  = rnd(0, Math.PI * 2)
    const dist = rnd(200, 600)
    const size = rnd(9, 22)
    const dur  = rnd(4500, 7000)
    return {
      tx: (Math.cos(ang) * dist) + 'px',
      ty: (Math.sin(ang) * dist + rnd(30, 160)) + 'px',
      r:  rnd(-360, 360) + 'deg',
      style: {
        position:          'absolute',
        left:              0, top: 0,
        width:             size + 'px',
        height:            size * 1.3 + 'px',
        background:        cols[i % cols.length],
        borderRadius:      '54% 8% 54% 8%',
        animation:         `petalBurst ${dur}ms cubic-bezier(.15,.7,.4,1)`,
        animationDelay:    rnd(0, 800) + 'ms',
        animationFillMode: 'forwards',
      },
    }
  })
}

function genFlowers() {
  const palette = [
    ['#e58aa6','#e8a23a'], ['#d4738f','#f2c95e'], ['#f0a8b8','#e8a23a'],
    ['#e9a178','#d98a3a'], ['#cf86a8','#f2c95e'], ['#f2b6c4','#e8a23a'], ['#dd7e9a','#e8a23a'],
  ]
  return Array.from({ length: 7 }, (_, i) => ({
    index:       i,
    size:        rnd(72, 120),
    petalColor:  palette[i][0],
    centerColor: palette[i][1],
    swayDelay:   -rnd(0, 3),
    stemH:       rnd(120, 240),
  }))
}

/* ── Flower component ── */
function Flower({ index, size, petalColor, centerColor, swayDelay, stemH }) {
  const n  = 7
  const pw = size * 0.3
  const ph = size * 0.56

  return (
    <motion.div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'bottom center' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2.8, delay: 0.5 + index * 0.3, ease: [0.2, 0.85, 0.25, 1] }}
    >
      <div style={{
        position: 'relative', width: size, height: size,
        animation: `sway 4.5s ease-in-out infinite`,
        animationDelay: swayDelay + 's',
      }}>
        {Array.from({ length: n }, (_, k) => (
          <div key={k} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: pw, height: ph,
            background: petalColor, borderRadius: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%,-100%) rotate(${k * (360 / n)}deg)`,
            boxShadow: 'inset 0 -6px 10px -6px rgba(0,0,0,.12)',
          }} />
        ))}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: size * 0.34, height: size * 0.34,
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle at 38% 34%,#fce8a8,${centerColor})`,
          borderRadius: '50%', zIndex: 2,
          boxShadow: '0 1px 3px rgba(120,80,40,.25)',
        }} />
      </div>
      <div style={{
        width: 6, height: stemH, marginTop: -4,
        background: 'linear-gradient(#9bbf8f,#6f9a73)', borderRadius: 4,
      }} />
      <div style={{
        position: 'absolute',
        left:      index % 2 ? '58%' : '30%',
        top:       size + stemH * 0.42,
        width:     size * 0.42,
        height:    size * 0.24,
        background:   '#7fa97f',
        borderRadius: '0 80% 0 80%',
        transform: index % 2 ? 'rotate(28deg)' : 'rotate(-28deg) scaleX(-1)',
      }} />
    </motion.div>
  )
}

/* ── Animation variants ── */
const msgContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.55, delayChildren: 1.4 } },
}

const msgItem = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 1.2, ease: 'easeOut' } },
}

/* ── Main page ── */
export default function Page() {
  const [revealed,      setRevealed]      = useState(false)
  const [ambientPetals, setAmbientPetals] = useState([])
  const [flowers,       setFlowers]       = useState([])
  const [burstPetals,   setBurstPetals]   = useState([])

  useEffect(() => { setAmbientPetals(genAmbientPetals()) }, [])

  function reveal() {
    setFlowers(genFlowers())
    setBurstPetals(genBurstPetals())
    setRevealed(true)
  }

  function replay() {
    setRevealed(false)
    setFlowers([])
    setBurstPetals([])
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(120% 120% at 50% 0%,#fdf8f1 0%,#f7efe6 48%,#f1e4da 100%)',
      fontFamily: 'var(--font-nunito), system-ui, sans-serif',
      overflow: 'hidden',
    }}>

      {/* Ambient petals */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        {ambientPetals.map((s, i) => <div key={i} style={s} />)}
      </div>

      {/* ── BEFORE ── */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            key="before"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            exit={{ opacity: 0, y: -24, scale: 0.95, transition: { duration: 0.6 } }}
            style={{
              position: 'relative', zIndex: 5, textAlign: 'center',
              padding: '44px 40px', maxWidth: 560,
              background: 'rgba(255,255,255,.62)',
              border: '1px solid rgba(201,122,150,.18)',
              borderRadius: 28,
              boxShadow: '0 30px 70px -30px rgba(122,74,82,.4)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={{ fontSize: 34, marginBottom: 10, animation: 'twinkle 3s ease-in-out infinite' }}>
                🌷
              </div>
              <div style={{ fontWeight: 700, letterSpacing: '.32em', textTransform: 'uppercase', fontSize: 11.5, color: '#c97a96', marginBottom: 16 }}>
                une petite attention
              </div>
              <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 600, fontSize: 'clamp(46px,8vw,76px)', lineHeight: 1, margin: '0 0 14px', color: '#7a4a52' }}>
                Corrine,
              </h1>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: 'clamp(19px,2.4vw,24px)', lineHeight: 1.45, color: '#6a5750', margin: '0 0 34px' }}>
                on a préparé quelque chose rien que pour toi…
              </p>
              <motion.button
                onClick={reveal}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ['0 10px 26px -10px rgba(201,108,140,.55)', '0 16px 34px -10px rgba(201,108,140,.75)', '0 10px 26px -10px rgba(201,108,140,.55)'] }}
                transition={{ boxShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}
                style={{ border: 'none', background: 'linear-gradient(135deg,#e58aa6 0%,#d4738f 55%,#c96c8c 100%)', color: '#fff', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, fontSize: 17, letterSpacing: '.02em', padding: '16px 38px', borderRadius: 999, cursor: 'pointer' }}
              >
                Ouvrir la surprise &nbsp;🌸
              </motion.button>
              <div style={{ marginTop: 18, fontSize: 12.5, color: '#b39a93' }}>
                (appuie sur le bouton ✨)
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AFTER ── */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="after"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Glow background */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(130% 120% at 50% 12%,#fbe6ec 0%,#f7ddd0 45%,#f3e7d2 100%)' }}
            />

            {/* Flowers */}
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1.5vw', zIndex: 3, pointerEvents: 'none' }}>
              {flowers.map((f, i) => <Flower key={i} {...f} />)}
            </div>

            {/* Burst petals */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '42%', zIndex: 4, pointerEvents: 'none' }}>
              {burstPetals.map((p, i) => (
                <div key={i} style={{ ...p.style, '--tx': p.tx, '--ty': p.ty, '--r': p.r }} />
              ))}
            </div>

            {/* Message */}
            <motion.div
              variants={msgContainer}
              initial="hidden"
              animate="show"
              style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: 32, maxWidth: 680, width: '100%', marginBottom: '16vh' }}
            >
              <motion.div variants={msgItem} style={{ fontWeight: 700, letterSpacing: '.32em', textTransform: 'uppercase', fontSize: 12, color: '#c97a96', marginBottom: 14 }}>
                ✿ avec tout notre cœur ✿
              </motion.div>
              <motion.h1 variants={msgItem} style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 600, fontSize: 'clamp(54px,9vw,104px)', lineHeight: .98, margin: '0 0 22px', color: '#7a4a52' }}>
                Merci Corrine
              </motion.h1>
              <motion.p variants={msgItem} style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: 'clamp(20px,2.6vw,27px)', lineHeight: 1.5, color: '#6a5750', margin: '0 auto 16px', maxWidth: 540 }}>
                Grâce à ta formation « Évaluer son image pro », tu nous as aidés à révéler le meilleur de nous‑mêmes.
              </motion.p>
              <motion.p variants={msgItem} style={{ fontSize: 'clamp(15px,1.8vw,17.5px)', lineHeight: 1.65, color: '#8a766e', margin: '0 auto 30px', maxWidth: 480 }}>
                Ta bienveillance, ton écoute et tes précieux conseils ont fait toute la différence. 🌸
              </motion.p>
              <motion.div variants={msgItem} style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(18px,2.2vw,22px)', color: '#7a4a52' }}>
                Avec toute notre gratitude — ton groupe 💐
              </motion.div>
              <motion.button
                variants={msgItem}
                onClick={replay}
                whileHover={{ background: 'rgba(255,255,255,.9)' }}
                style={{ marginTop: 36, border: '1px solid #e3c0c9', background: 'rgba(255,255,255,.55)', color: '#b86a84', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '.04em', padding: '10px 20px', borderRadius: 999, cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                ✿ recommencer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
