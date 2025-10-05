"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="relative inline-block" onMouseLeave={() => setOpen(false)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { open, setOpen });
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  { asChild?: boolean; children: React.ReactNode; open?: boolean; setOpen?: (open: boolean) => void }
>(({ asChild, children, open, setOpen }, ref) => {
  return (
    <div ref={ref} className="inline-block" onClick={() => setOpen?.(!open)}>
      {children}
    </div>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  { align?: "start" | "end"; children: React.ReactNode; className?: string; open?: boolean; setOpen?: (open: boolean) => void }
>(({ align = "start", children, className, open, setOpen }, ref) => {
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 min-w-[200px] max-h-[300px] overflow-auto rounded-xl border bg-popover p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onClick?: () => void;
    className?: string;
  }
>(({ children, checked, onCheckedChange, onClick, className }, ref) => {
  return (
    <button
      ref={ref}
      onClick={() => {
        onClick?.();
        onCheckedChange?.(!checked);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      <span className="text-xs">{checked ? "☑" : "☐"}</span>
      {children}
    </button>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }
>(({ children, onClick, className }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
};
