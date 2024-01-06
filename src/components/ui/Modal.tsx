import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./Dialog";

export type ModalProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const Modal = ({
  children,
  isOpen,
  onOpenChange,
  title,
  description,
  size = "md",
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        <DialogContent
          className={
            { sm: "max-w-md", md: "max-w-lg", lg: "max-w-xl", xl: "max-w-2xl" }[
              size
            ]
          }
        >
          {title ? (
            <DialogTitle className="text-xl">{title}</DialogTitle>
          ) : null}

          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}

          {children}

          <DialogClose />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
