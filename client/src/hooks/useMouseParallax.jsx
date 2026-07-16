import { useState, useEffect } from "react";

export default function useMouseParallax(strength = 20) {
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handler = (e) => {
            setPos({
                x: (e.clientX / window.innerWidth - 0.5) * strength,
                y: (e.clientY / window.innerHeight - 0.5) * strength,
            })
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [strength])

    return pos
}