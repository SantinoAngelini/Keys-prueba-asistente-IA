
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Gamepad, Zap, BrainCircuit, User } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_GAMES } from '../constants';
import { Game } from '../types';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (game: Game) => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  recommendedGameId?: string;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose, onAddToCart }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: '¡Hola! Soy Nexus AI. Estoy aquí para ayudarte a encontrar tu próximo gran juego o resolver dudas sobre tus compras. ¿Qué tienes ganas de jugar hoy?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const availableGamesContext = MOCK_GAMES.map(g => `${g.title} (${g.genre}, ${g.price}€, id:${g.id})`).join(', ');

      const prompt = `
        Eres un asistente experto en videojuegos llamado Nexus AI.
        Tu objetivo es recomendar juegos de nuestra tienda basándote en lo que el usuario pide.
        Juegos disponibles: ${availableGamesContext}.
        
        Instrucciones:
        1. Sé amable, entusiasta y usa un tono gamer.
        2. Responde siempre en español.
        3. Si recomiendas un juego, trata de que sea uno de la lista anterior.
        4. Al final de tu respuesta, si crees que un juego específico es la mejor opción, incluye su ID en formato [RECOMMEND_ID:xxxx].
        
        Usuario dice: "${userMessage}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const fullText = response.text || "Lo siento, tuve un pequeño glitch. ¿Podrías repetir eso?";
      
      // Extract recommendation if present
      const match = fullText.match(/\[RECOMMEND_ID:(.*?)\]/);
      const gameId = match ? match[1] : undefined;
      const cleanContent = fullText.replace(/\[RECOMMEND_ID:.*?\]/, '').trim();

      setMessages(prev => [...prev, { role: 'ai', content: cleanContent, recommendedGameId: gameId }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Ups, parece que perdí la conexión con los servidores principales. ¿Lo intentamos de nuevo?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedGame = (id?: string) => {
    return MOCK_GAMES.find(g => g.id === id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-slate-900 w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">Nexus AI Scout</h3>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Soporte Inteligente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  {msg.role === 'ai' ? <BrainCircuit className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                    {msg.content}
                  </div>
                  
                  {msg.recommendedGameId && recommendedGame(msg.recommendedGameId) && (
                    <div className="bg-slate-800/50 border border-indigo-500/30 p-3 rounded-xl flex gap-3 animate-in slide-in-from-bottom-2">
                      <img 
                        src={recommendedGame(msg.recommendedGameId)?.imageUrl} 
                        className="w-16 h-20 object-cover rounded-lg" 
                        alt="Recomendación" 
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm">{recommendedGame(msg.recommendedGameId)?.title}</h4>
                          <p className="text-xs text-indigo-400 font-bold">{recommendedGame(msg.recommendedGameId)?.price.toFixed(2)}€</p>
                        </div>
                        <button 
                          onClick={() => {
                            onAddToCart(recommendedGame(msg.recommendedGameId)!);
                            onClose();
                          }}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-500 font-bold py-1.5 px-3 rounded text-center transition-colors"
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Pregúntame algo... ej: 'Busco un RPG difícil'" 
              className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/10"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['Mejor RPG', 'Ofertas hoy', 'Acción para PS5', 'Starfield vs Elden'].map(tag => (
              <button 
                key={tag}
                onClick={() => setInput(tag)}
                className="flex-shrink-0 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
