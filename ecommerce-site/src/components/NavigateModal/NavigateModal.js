import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';

const NavigateModal = ({ isOpen, onClose, actions, title, children }) => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action.type === 'navigate') {
      navigate(action.path);
    } else if (action.type === 'function' && typeof action.fn === 'function') {
      action.fn();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
      {actions.map((action, index) => (
        <button key={index} onClick={() => handleAction(action)}>
          {action.label}
        </button>
      ))}
    </Modal>
  );
};

export default NavigateModal;
