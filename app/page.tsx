"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen items-center justify-center bg-gray-100"
    >
      <h1 className="text-5xl font-bold text-blue-600">Hi, I'm Sandilya 👋</h1>
    </motion.main>
  );
}
