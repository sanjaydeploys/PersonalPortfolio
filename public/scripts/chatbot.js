.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
  margin-top: 0.4rem;
  font-size: 0.75rem;
}

.action-btn {
  padding: 0.4rem;
  background: var(--chat-border-light);
  color: #FFFFFF;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.chatbot-container.dark .action-btn {
  background: var(--chat-border-dark);
  color: var(--chat-text-dark);
}

.action-btn:hover {
  background: var(--chat-accent);
}

.action-btn svg {
  width: 16px;
  height: 16px;
  stroke: var(--chat-text-light);
}

.chatbot-container.dark .action-btn svg {
  stroke: var(--chat-text-dark);
}

.reaction-picker {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--chat-ai-light);
  border: 1px solid var(--chat-border-light);
  border-radius: 6px;
  padding: 0.3rem;
  display: flex;
  gap: 0.3rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.chatbot-container.dark .reaction-picker {
  background: var(--chat-ai-dark);
  border-color: var(--chat-border-dark);
}

.reaction-picker-item {
  font-size: 1rem;
  padding: 0.2rem;
  cursor: pointer;
  transition: var(--transition);
}

.reaction-picker-item:hover {
  transform: scale(1.2);
}

.reaction-tag {
  background: var(--chat-ai-light);
  color: var(--chat-text-light);
  border-radius: 12px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
}

.chatbot-container.dark .reaction-tag {
  background: var(--chat-ai-dark);
  color: var(--chat-text-dark);
}

.edit-message {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.edit-message-input {
  flex: 1;
  padding: 0.4rem;
  border: 1px solid var(--chat-border-light);
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
}

.chatbot-container.dark .edit-message-input {
  border-color: var(--chat-border-dark);
  background: var(--chat-ai-dark);
  color: var(--chat-text-dark);
}

.edit-message-input:focus {
  border-color: var(--chat-accent);
  box-shadow: 0 0 5px rgba(37, 211, 102, 0.3);
}

.edit-message-button, .cancel-btn {
  padding: 0.4rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.edit-message-button {
  background: var(--chat-accent);
  color: #FFFFFF;
}

.cancel-btn {
  background: var(--chat-error);
  color: #FFFFFF;
}

.edit-message-button:hover {
  background: #1EAF5A;
}

.cancel-btn:hover {
  background: #CC2D38;
}

.edit-message-button svg, .cancel-btn svg {
  width: 16px;
  height: 16px;
}
