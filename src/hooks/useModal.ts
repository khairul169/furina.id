import { useState } from "react";

const useModal = <T = unknown>() => {
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState<T | undefined | null>(null);

  return {
    isOpen,
    data,
    onOpen(_data?: T | null) {
      setOpen(true);
      setData(_data);
    },
    onClose() {
      setOpen(false);
    },
    onOpenChange: setOpen,
  };
};

export default useModal;
