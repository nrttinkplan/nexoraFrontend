import React from 'react';
import Navbar from '../components/Layout/Navbar';
import NexoraHero from '../components/Layout/NexoraHero';
import Footer from '../components/Layout/Footer';
import BestSellers from '../components/Layout/BestSellers';
import AboutUsSection from '../components/Layout/AboutUsSection';
import CategoriesSection from '../components/Layout/CategoriesSection';
import { motion } from 'framer-motion'; 
import TypingEffect from '../components/Effects/TypingEffect';
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <NexoraHero />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BestSellers />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CategoriesSection />
        </motion.div>
                <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AboutUsSection />
        </motion.div>
        

      </main>

      <Footer />
    </div>
  );
}