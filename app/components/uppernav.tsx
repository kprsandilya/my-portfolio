import * as motion from "motion/react-client"
import { useTheme } from "next-themes"

// Assuming this SVG import provides the URL path for the <img> tag
import SvgComponent from "./logo" 

export default function UpperNavBar() {
    const boxSize = {
        width: "50px",
        height: "50px",
        // Using overflow: hidden to contain the scaling animation cleanly
        overflow: "hidden", 
    };

    return (
        // The outer motion.div is fine, but we apply the animation directly to the container holding the image.
        <motion.div 
            style={boxSize} 
            whileHover={{
                // Animations for the container
                scale: [1, 1.2, 1.2, 1, 1], // Changed keyframes to make the animation cycle less disruptive
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{
                duration: 1,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
            }}
        >
            <SvgComponent/>
        </motion.div>
    )
}