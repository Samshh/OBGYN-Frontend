interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center h-screen">
      <div className="bg-white p-[1rem] border border-border rounded-md relative flex flex-col gap-[1rem] w-fit">
        {children}
      </div>
    </div>
  );
}

function Close({ onClose, children }: ModalProps) {
  return (
    <button type="button" onClick={onClose}>
      {children}
    </button>
  );
}

function Separator() {
  return <div className="bg-border h-[1px] w-full" />;
}

Modal.Close = Close;
Modal.Separator = Separator;
