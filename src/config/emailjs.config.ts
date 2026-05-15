// config/emailjs.config.ts

import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID ,
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ,
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ,
    DEV_MODE: import.meta.env.VITE_EMAILJS_DEV_MODE === 'true' || import.meta.env.DEV,
  };
  

export const initEmailJS = () => {
  // Only initialize if public key is provided and not a placeholder
  if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialized');
  } else {
    console.warn('⚠️ EmailJS not initialized: Missing public key');
  }
};