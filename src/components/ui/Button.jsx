import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  loading,
  ...props
}) => {
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
