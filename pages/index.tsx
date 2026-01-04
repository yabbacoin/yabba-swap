import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

const PAIR_ADDRESS =
  'Bdpkk1xvn1WG5QEsUbRBPxFbv5ULdn996Jf1pbQeL26W'

const RAYDIUM_SWAP_URL =
  'https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=Bp6ph46cRm2kkxU36fgx23wK6LWHa63NttEqLw1w8Z9A'

/**
 * MOBILE FLOWS (IMPORTANT)
 * - Connect → open THIS SITE inside Phantom
 * - Buy → open Raydium with $YABBA selected
 */
const PHANTOM_BROWSE_SITE =
  'https://phantom.app/ul/browse/https://www.yabba-swap.com'

const PHANTOM_RAYDIUM_DEEPLINK =
  'https://phantom.app/ul/browse/https%3A%2F%2Fraydium.io%2Fswap%2F%3FinputMint%3DSo11111111111111111111111111111111111111112%26outputMint%3DBp6ph46cRm2kkxU36fgx23wK6LWHa63NttEqLw1w8Z9A'

export default function Home() {
  const { publicKey, connect } = useWallet()

  const [price, setPrice] = useState('—')
  const [liquidity, setLiquidity] = useState('—')
  const [fdv, setFdv] = useState('—')
  const [volume, setVolume] = useState('—')

  const [showSwap, setShowSwap] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  /* ===============================
     MOBILE DETECTION
     =============================== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ===============================
     LOAD DEXSCREENER METRICS
     =============================== */
  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR_ADDRESS}`
        )
        const json = await res.json()
        const pair = json?.pairs?.[0]
        if (!pair) return

        setPrice(`$${Number(pair.priceUsd).toFixed(6)}`)
        setLiquidity(
          `$${Number(pair.liquidity.usd).toLocaleString()}`
        )
        setFdv(`$${Number(pair.fdv || 0).toLocaleString()}`)
        setVolume(
          `$${Number(pair.volume.h24).toLocaleString()}`
        )
      } catch (e) {
        console.error(e)
      }
    }

    loadMetrics()
    const i = setInterval(loadMetrics, 15000)
    return () => clearInterval(i)
  }, [])

  function shortAddress(addr: string) {
    return addr.slice(0, 4) + '...' + addr.slice(-4)
  }

  /* ===============================
     ESC CLOSE MODALS
     =============================== */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSwap(false)
        setShowDisclaimer(false)
      }
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  return (
    <main
      style={{
        height: '100vh',
        width: '100vw',
        background:
          'radial-gradient(circle at top,#0b1220,#020617)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* HEADER */}
      <header
        style={{
          height: 72,
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src="/logo-yabba-icon.png"
            alt="YABBA"
            style={{ height: 64, width: 64 }}
          />

          {!isMobile && (
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                YABBA
              </div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>
                The Meme that rules them all
              </div>
            </div>
          )}
        </div>

        {/* WALLET */}
        {publicKey ? (
          <div
            style={{
              background: '#020617',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700
            }}
          >
            {shortAddress(publicKey.toBase58())}
          </div>
        ) : (
          <button
            onClick={() => {
              if (isMobile) {
                // 📱 MOBILE → open THIS SITE inside Phantom (wallet context)
                window.location.href = PHANTOM_BROWSE_SITE
              } else {
                // 🖥️ DESKTOP → normal connect
                connect()
              }
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              fontWeight: 700,
              background:
                'linear-gradient(90deg,#a855f7,#6366f1)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Connect
          </button>
        )}
      </header>

      {/* CHART AREA */}
      <section
        style={{
          position: 'relative',
          height: 'calc(100vh - 72px)'
        }}
      >
        {/* METRICS */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 20,
            background: 'rgba(2,6,23,.85)',
            padding: isMobile ? '10px 12px' : '14px 18px',
            borderRadius: 14,
            fontSize: isMobile ? 12 : 14,
            lineHeight: 1.6,
            backdropFilter: 'blur(6px)'
          }}
        >
          <div><strong>Price:</strong> {price}</div>
          <div><strong>Liq:</strong> {liquidity}</div>
          {!isMobile && <div><strong>FDV:</strong> {fdv}</div>}
          <div><strong>Vol 24h:</strong> {volume}</div>
        </div>

        <iframe
          src={`https://dexscreener.com/solana/${PAIR_ADDRESS}?embed=1&theme=dark`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />

        {/* BUY BUTTON */}
        <button
          onClick={() => {
            if (isMobile) {
              // 📱 MOBILE → Phantom → Raydium ($YABBA)
              window.location.href = PHANTOM_RAYDIUM_DEEPLINK
            } else {
              // 🖥️ DESKTOP → modal Raydium
              setShowSwap(true)
            }
          }}
          style={{
            position: 'absolute',
            bottom: isMobile ? 16 : 24,
            left: isMobile ? '50%' : 'auto',
            right: isMobile ? 'auto' : 24,
            transform: isMobile
              ? 'translateX(-50%)'
              : 'none',
            zIndex: 30,
            padding: isMobile
              ? '14px 28px'
              : '16px 26px',
            borderRadius: 999,
            border: 'none',
            fontWeight: 800,
            fontSize: 16,
            background:
              'linear-gradient(90deg,#38bdf8,#22d3ee)',
            color: '#020617',
            boxShadow:
              '0 12px 30px rgba(56,189,248,.45)'
          }}
        >
          BUY $YABBA
        </button>
      </section>

      {/* DISCLAIMER BAR */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(1,1,1,.99)',
          padding: '8px 12px',
          fontSize: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <span>
          ⚠️ Crypto assets are volatile. Do your own research.
        </span>
        <button
          onClick={() => setShowDisclaimer(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer'
          }}
        >
          Read disclaimer
        </button>
      </footer>

      {/* DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div
          onClick={() => setShowDisclaimer(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 520,
              width: '90%',
              background: '#020617',
              padding: 24,
              borderRadius: 16,
              fontSize: 14
            }}
          >
            <h3>Disclaimer</h3>
            <p>
              This website is provided for informational purposes
              only and does not constitute financial advice.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              style={{
                marginTop: 16,
                padding: '10px 16px',
                borderRadius: 999,
                border: 'none',
                fontWeight: 700
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RAYDIUM SWAP MODAL (DESKTOP ONLY) */}
      {showSwap && !isMobile && (
        <div
          onClick={() => setShowSwap(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 420,
              height: 720,
              background: '#020617',
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowSwap(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 22
              }}
            >
              ×
            </button>

            <iframe
              src={RAYDIUM_SWAP_URL}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}