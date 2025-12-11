import { motion } from 'framer-motion';
import { BeatLoader, SyncLoader, PuffLoader } from 'react-spinners';

type LoaderVariant = 'beat' | 'sync' | 'puff';

interface LoadingProps {
  variant?: LoaderVariant;
  size?: number;
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

export function Loading({
  variant = 'beat',
  size = 20,
  color = '#3b82f6',
  fullScreen = false,
  message = 'Loading...',
}: LoadingProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const renderLoader = () => {
    switch (variant) {
      case 'sync':
        return <SyncLoader color={color} size={size / 3} margin={2} />;
      case 'puff':
        return <PuffLoader color={color} size={size} />;
      case 'beat':
      default:
        return <BeatLoader color={color} size={size / 2} margin={2} />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {renderLoader()}
        </motion.div>
      </div>
      {message && (
        <motion.p 
          className="text-foreground/80 text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {content}
    </motion.div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loading variant="puff" size={60} fullScreen={false} message="Preparing your experience..." />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <BeatLoader color="#ffffff" size={8} margin={2} />
      <span>Processing...</span>
    </div>
  );
}
