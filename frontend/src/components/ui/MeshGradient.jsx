import React from 'react';
import { motion } from 'framer-motion';

const MeshGradient = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute inset-0 bg-gray-50 dark:bg-slate-950 transition-colors duration-500" />
            
            <motion.div 
                animate={{
                    x: ['0%', '10%', '-5%', '0%'],
                    y: ['0%', '-10%', '5%', '0%'],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-700 dark:bg-slate-300 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-20"
            />
            
            <motion.div 
                animate={{
                    x: ['0%', '-10%', '10%', '0%'],
                    y: ['0%', '10%', '-10%', '0%'],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-slate-600 dark:bg-slate-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[130px] opacity-30 dark:opacity-20"
            />
            
            <motion.div 
                animate={{
                    x: ['0%', '5%', '-15%', '0%'],
                    y: ['0%', '-15%', '10%', '0%'],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-slate-500 dark:bg-slate-300 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-30 dark:opacity-15"
            />
        </div>
    );
};

export default MeshGradient;
