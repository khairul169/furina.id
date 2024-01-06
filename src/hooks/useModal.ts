import { useState } from "react";

const useModal = () => {
  const [isOpen, setOpen] = useState(false);

  return {
    isOpen,
    onOpen() {
      setOpen(true);
    },
    onClose() {
      setOpen(false);
    },
    onOpenChange: setOpen,
  };
};

export default useModal;
