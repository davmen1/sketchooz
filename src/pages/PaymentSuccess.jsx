import { motion } from 'framer-motion';
import { CheckCircle, Smartphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-accent/15 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-accent" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Payment successful!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your credits have been added to your account.<br />
            You can now enjoy them on web and in the app.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            <span className="font-medium text-foreground">Web</span>
            <span className="text-xs text-muted-foreground">sketchooz.com</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2">
            <Smartphone className="w-6 h-6 text-accent" />
            <span className="font-medium text-foreground">App</span>
            <span className="text-xs text-muted-foreground">iOS & Android</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Credits are synced across all your devices automatically.
        </p>

        <Button asChild className="w-full">
          <a href="https://www.sketchooz.com">Go to Sketchooz →</a>
        </Button>
      </motion.div>
    </div>
  );
}