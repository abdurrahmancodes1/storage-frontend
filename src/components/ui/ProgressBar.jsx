import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
const ProgressBar = ({ value, max, className }) => {
  return (
    <div
      className={cn(
        "h-1.5 w-full bg-slate-100 rounded-full overflow-hidden",
        className,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-blue-600 rounded-full"
      />
    </div>
  );
};

export default ProgressBar;
