import React, { useState } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: any;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const [isOpened, setIsOpened] = useState<boolean>(isOpen);

  const handleClose = () => {
    setIsOpened(false);
    onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden z-50 ${
        isOpened ? 'visible' : 'invisible'
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          className={`w-64 bg-white shadow-lg overflow-y-auto ease-in-out transition-all duration-300 transform ${
            isOpened ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between px-6 py-3 bg-gray-200">
            <h3 className="text-lg font-medium">Drawer Title</h3>
            <button className="text-gray-500" onClick={handleClose}>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
