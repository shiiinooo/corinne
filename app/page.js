'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'

const rnd = (a, b) => a + Math.random() * (b - a)

const PETAL_COLORS = ['#e8b4c0', '#d4a0b0', '#f0cdb8', '#e8c4a8', '#c9a0b0']

function genAmbientPetals() {
  return Array.from({ length: 10 }, (_, i) => ({
    width:  rnd(8, 16) + 'px',
    height: rnd(10, 20) + 'px',
    background: PETAL_COLORS[i % PETAL_COLORS.length],
    left: rnd(0, 100) + '%',
    top: '-8vh',
    opacity: rnd(0.25, 0.5),
    animationDuration: rnd(18, 32) + 's',
    animationDelay: -rnd(0, 20) + 's',
  }))
}

function genBurstPetals() {
  return Array.from({ length: 28 }, (_, i) => {
    const ang = rnd(0, Math.PI * 2)
    const dist = rnd(120, 380)
    const size = rnd(7, 14)
    return {
      tx: Math.cos(ang) * dist + 'px',
      ty: Math.sin(ang) * dist + rnd(20, 80) + 'px',
      r: rnd(-180, 180) + 'deg',
      style: {
        width: size + 'px',
        height: size * 1.2 + 'px',
        background: PETAL_COLORS[i % PETAL_COLORS.length],
        borderRadius: '54% 8% 54% 8%',
        position: 'absolute',
        left: 0,
        top: 0,
        animation: `petalBurst ${rnd(5000, 8000)}ms cubic-bezier(.2,.8,.3,1) forwards`,
        animationDelay: rnd(0, 400) + 'ms',
      },
    }
  })
}

const FLOWER_PALETTE = [
  ['#d4a0b0', '#dfc89a'],
  ['#b86a84', '#e8c4a8'],
  ['#e8b4c0', '#dfc89a'],
  ['#c9a0b0', '#e8c4a8'],
  ['#b86a84', '#dfc89a'],
]

function genFlowers() {
  return Array.from({ length: 5 }, (_, i) => ({
    index: i,
    size: rnd(64, 96),
    petalColor: FLOWER_PALETTE[i][0],
    centerColor: FLOWER_PALETTE[i][1],
    swayDelay: -rnd(0, 4),
    stemH: rnd(100, 180),
  }))
}

function Flower({ index, size, petalColor, centerColor, swayDelay, stemH, className = '', blooming = true }) {
  const petals = 6
  const pw = size * 0.32
  const ph = size * 0.54

  const head = (
    <>
      <div className="flower__head" style={{ width: size, height: size, animationDelay: swayDelay + 's' }}>
        {Array.from({ length: petals }, (_, k) => (
          <div
            key={k}
            className="flower__petal"
            style={{
              width: pw,
              height: ph,
              background: petalColor,
              transform: `translate(-50%, -100%) rotate(${k * (360 / petals)}deg)`,
            }}
          />
        ))}
        <div
          className="flower__center"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            background: `radial-gradient(circle at 38% 34%, #fce8a8, ${centerColor})`,
          }}
        />
      </div>
      {stemH > 0 && <div className="flower__stem" style={{ height: stemH }} />}
      {stemH > 0 && (
        <div
          className="flower__leaf"
          style={{
            left: index % 2 ? '56%' : '28%',
            top: size + stemH * 0.4,
            width: size * 0.38,
            height: size * 0.2,
            transform: index % 2 ? 'rotate(24deg)' : 'rotate(-24deg) scaleX(-1)',
          }}
        />
      )}
    </>
  )

  if (!blooming) {
    return <div className={`flower ${className}`.trim()}>{head}</div>
  }

  return (
    <motion.div
      className={`flower ${className}`.trim()}
      style={{ transformOrigin: 'bottom center' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2.2, delay: 0.6 + index * 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {head}
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay: 0.8 + i * 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Page() {
  const [revealed, setRevealed] = useState(false)
  const [petals, setPetals] = useState([])
  const [burst, setBurst] = useState([])
  const [flowers, setFlowers] = useState([])

  useEffect(() => { setPetals(genAmbientPetals()) }, [])

  function reveal() {
    setBurst(genBurstPetals())
    setFlowers(genFlowers())
    setRevealed(true)
  }

  function replay() {
    setRevealed(false)
    setBurst([])
    setFlowers([])
  }

  return (
    <MotionConfig reducedMotion="never">
      <div className={`page${revealed ? ' page--revealed' : ''}`}>

        {/* Floating petals */}
        <div className="petals" aria-hidden="true">
          {petals.map((p, i) => (
            <div
              key={i}
              className="petal"
              style={{
                width: p.width,
                height: p.height,
                background: p.background,
                left: p.left,
                top: p.top,
                opacity: p.opacity,
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Intro */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              key="intro"
              className="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.7, ease: 'easeInOut' } }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <motion.p
                className="intro__label"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                Pour toi
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Flower
                  className="intro__flower"
                  blooming={false}
                  index={0}
                  size={52}
                  petalColor="#d4a0b0"
                  centerColor="#dfc89a"
                  swayDelay={0}
                  stemH={0}
                />
              </motion.div>

              <motion.h1
                className="intro__name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Corrine
              </motion.h1>

              <motion.p
                className="intro__hint"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.75 }}
              >
                Quelqu'un a préparé une petite surprise…
              </motion.p>

              <motion.button
                className="btn-open"
                onClick={reveal}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                whileTap={{ scale: 0.97 }}
              >
                Ouvrir
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              key="reveal"
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Soft glow */}
              <div className="bloom" aria-hidden="true">
                <motion.div
                  className="bloom__ring"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Petal burst */}
              <div className="burst" aria-hidden="true">
                {burst.map((p, i) => (
                  <div key={i} style={{ ...p.style, '--tx': p.tx, '--ty': p.ty, '--r': p.r }} />
                ))}
              </div>

              {/* Flower meadow */}
              <div className="meadow" aria-hidden="true">
                {flowers.map((f, i) => (
                  <Flower key={i} {...f} />
                ))}
              </div>

              {/* Message */}
              <div className="message">
                <motion.p className="message__eyebrow" custom={0} variants={fadeUp} initial="hidden" animate="show">
                  Avec gratitude
                </motion.p>

                <motion.h1 className="message__title" custom={1} variants={fadeUp} initial="hidden" animate="show">
                  Merci, <em>Corrine</em>
                </motion.h1>

                <motion.div className="message__divider" custom={2} variants={fadeUp} initial="hidden" animate="show" />

                <motion.p className="message__body" custom={3} variants={fadeUp} initial="hidden" animate="show">
                  Grâce à ta formation <strong>« Évaluer son image pro »</strong>, tu nous as aidés à révéler le meilleur de nous-mêmes.
                </motion.p>

                <motion.p className="message__body" custom={4} variants={fadeUp} initial="hidden" animate="show">
                  Ta bienveillance et tes conseils ont fait toute la différence.
                </motion.p>

                <motion.p className="message__sign" custom={5} variants={fadeUp} initial="hidden" animate="show">
                  — Force Collective
                </motion.p>
              </div>

              <motion.button
                className="btn-replay"
                onClick={replay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 4, duration: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                Recommencer
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
