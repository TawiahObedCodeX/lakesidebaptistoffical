import { ReactNode } from "react";

type Props = {
  kind?: "error" | "info" | "success";
  children: ReactNode;
  className?: string;
};

export function Alert({ kind = "error", children, className = "" }: Props) {
  const config = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "⚠️",
      iconColor: "text-red-600",
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
      icon: "✅",
      iconColor: "text-emerald-600",
    },
    info: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "ℹ️",
      iconColor: "text-amber-600",
    },
  };

  const current = config[kind];

  return (
    <div
      className={`
        ${current.bg} ${current.border} ${current.text}
        rounded-2xl border px-5 py-4 text-[15px] leading-relaxed
        flex items-start gap-3 shadow-sm
        animate-in fade-in slide-in-from-top-1 duration-300
        ${className}
      `}
    >
      <span className={`text-xl shrink-0 mt-px ${current.iconColor}`}>
        {current.icon}
      </span>
      <div className="flex-1 pt-px">{children}</div>
    </div>
  );
}