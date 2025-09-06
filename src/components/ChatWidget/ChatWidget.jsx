import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Bonjour ! Je suis l'assistant AutoDashboard. Comment puis-je vous aider ?", 
      sender: 'bot' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prevMessages => [...prevMessages, {
        id: prevMessages.length + 1,
        text: botResponse,
        sender: 'bot'
      }]);
      setIsTyping(false);
    }, 300 + Math.random() * 200); // Délai optimisé pour la démonstration
  };

  // Simple response generation based on keywords
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('bonjour') || input.includes('salut') || input.includes('hello')) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    }
    
    if (input.includes('objectif') || input.includes('target')) {
      return "Les objectifs peuvent être configurés dans l'onglet 'Objectifs du mois'. Vous pouvez y définir les objectifs d'heures, de CA et de ventes additionnelles.";
    }
    
    if (input.includes('heure') || input.includes('hour')) {
      return "Vous pouvez consulter les heures facturées dans l'onglet 'Gestion des heures'. Vous y trouverez l'avancement par rapport aux objectifs et le potentiel de facturation.";
    }
    
    if (input.includes('ca') || input.includes('chiffre') || input.includes('revenue')) {
      return "Le chiffre d'affaires est disponible dans l'onglet 'Chiffre d'affaires'. Vous pouvez y voir l'avancement par rapport aux objectifs et la répartition par service.";
    }
    
    if (input.includes('videocheck') || input.includes('vidéo')) {
      return "Les statistiques VideoCheck sont disponibles dans l'onglet 'VideoCheck'. Vous pouvez y suivre le taux de réalisation et le CA généré.";
    }
    
    if (input.includes('productivité') || input.includes('productivity')) {
      return "La productivité des techniciens est disponible dans l'onglet 'Productivité'. Vous pouvez y voir les taux de réalisation par technicien et par service.";
    }
    
    if (input.includes('crescendo') || input.includes('vente') || input.includes('additionnelle')) {
      return "Les ventes additionnelles sont suivies dans l'onglet 'Crescendo'. Vous pouvez y voir l'avancement des ventes par famille de produits.";
    }
    
    if (input.includes('aide') || input.includes('help')) {
      return "Vous pouvez consulter l'aide dans l'onglet 'Aide & Support' ou me poser directement vos questions ici.";
    }
    
    if (input.includes('merci') || input.includes('thank')) {
      return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
    }
    
    return "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous préciser votre question concernant la gestion après-vente automobile ?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`chat-widget-modern flex items-center justify-center w-16 h-16 transition-all duration-500 ${
          isOpen ? 'bg-gradient-to-r from-red-500 to-red-600 rotate-180' : 'hover:scale-110 bg-gradient-to-r from-blue-500 to-blue-600'
        }`}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        <div className="relative z-10">
        {isOpen ? (
          <XMarkIcon className="h-7 w-7 text-white" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-white" />
        )}
        </div>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 chat-window-modern flex flex-col overflow-hidden animate-scale-in">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
            <h3 className="font-bold text-lg">AutoDashboard Assistant</h3>
            <p className="text-sm text-blue-100 font-medium">Posez vos questions sur l'application</p>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-5 overflow-y-auto max-h-96 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none backdrop-blur-sm'
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 text-gray-800 rounded-xl rounded-bl-none p-4 max-w-[80%] shadow-md backdrop-blur-sm">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Posez votre question..."
                className="flex-1 input-modern px-4 py-3 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-modern bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-3 rounded-xl"
                disabled={inputValue.trim() === ''}
              >
                <PaperAirplaneIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}