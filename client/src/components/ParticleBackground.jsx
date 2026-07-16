import { useEffect, useRef } from "react";

export default function ParticleBackground({ count = 60, opacity = 0.25 } = {}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let aimId
        const particles = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        class Particle {
            constructor() { this.reset() }
            reset() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 1.4 + 0.2
                this.vx = (Math.random() - 0.5) * 0.3
                this.vy = (Math.random() - 0.5) * 0.3
                this.life = Math.random() * Math.PI * 2
            }
            update() {
                this.x += this.vx
                this.y += this.vy
                this.life += 0.008
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset()
            }
            draw() {
                const a = (0.08 + Math.abs(Math.sin(this.life)) * 0.3) * opacity
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(201, 168, 76, ${a})`
                ctx.fill()
            }
        }
        for (let i = 0; i < count; i++) particles.push(new Particle())

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x, dy = p.y - p2.y
                    const d = Math.sqrt(dx * dx + dy * dy)
                    if (d < 90) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `rgba(201, 168, 76, ${0.05 * (1 - d / 90) * opacity})`
                        ctx.lineWidth = 0.4
                        ctx.stroke()
                    }
                }
                p.update()
                p.draw()
            }
            aimId = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            cancelAnimationFrame(aimId)
            window.removeEventListener('resize', resize)
        }

    }, [count, opacity])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0
            }} />
    )

}