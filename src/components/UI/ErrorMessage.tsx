import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ErrorMessageProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed z-100 bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-md rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <i className="bx bxs-error-circle text-xl"></i>
            <span className="flex items-center justify-center text-sm">
              <i className="bxr bx-alert-triangle mr-1"></i> {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
