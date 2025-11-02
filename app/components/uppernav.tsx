import * as motion from "motion/react-client"
import { useTheme } from "next-themes"

export default function UpperNavBar() {
    const box = {
        width: "50px",
        height: "50px",
        backgroundColor: "blue"
    }

    return (
        <motion.div
            whileHover={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            style={box}
            transition={{
                duration: 1,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
            }}
        />
    )
}