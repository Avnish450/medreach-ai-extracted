"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Props {
  reason: string;
  onDismiss: () => void;
}

export function EmergencyBanner({ reason, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-6 shadow-2xl"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">🚨 EMERGENCY DETECTED</h2>
          <p className="text-red-100">
            {reason ? `Reason: ${reason}. ` : ""}
            Your symptoms may indicate a medical emergency. Redirecting to emergency services...
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" render={<a href="tel:112" />}>
            📞 CALL 112 NOW
          </Button>
          <Button variant="ghost" size="lg" onClick={onDismiss} className="text-white hover:text-red-600">
            Dismiss
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
