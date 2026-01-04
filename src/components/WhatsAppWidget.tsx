'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '260974399695'; // Designhub Zambia WhatsApp number
  const message = 'Hello Designhub team! 👋 I found you through your website and would love to learn more about your services. Could you please share more details?';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden w-80"
          >
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Chat with us</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">Hi there! 👋 How can we help you today?</p>
              <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.96.63 3.77 1.69 5.25L2 22l4.75-1.69A9.98 9.98 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.56-.53-5.01-1.44l-.35-.21-3.75.98 1-3.65-.24-.37A7.98 7.98 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-12.5l-5.5 3.3-2.5-2.5-3.5 3.5 6 3.5 5.5-3.3 2.5 2.5 3.5-3.5-6-3.5z" />
                </svg>
                Open WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
};
