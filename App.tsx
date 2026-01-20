
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  Sparkles, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight,
  Filter,
  Gamepad2,
  TrendingUp,
  Tag
} from 'lucide-react';
import { MOCK_GAMES } from './constants';
import { Game, Genre, CartItem, Platform } from './types';
import GeminiAssistant from './components/GeminiAssistant';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const addToCart = (game: Game) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === game.id);
      if (existing) {
        return prev.map(item => item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...game, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight hidden sm:block">
              KEY<span className="text-indigo-400">NEXUS</span>
            </span>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar juegos, expansiones..." 
              className="w-full bg-slate-800 border-transparent focus:border-indigo-500 focus:ring-0 rounded-full py-2 pl-10 pr-4 text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Scout</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button className="sm:hidden p-2 hover:bg-slate-800 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Promo Section */}
      {!searchQuery && selectedGenre === 'All' && (
        <section className="relative h-[400px] overflow-hidden">
          <img 
            src="https://picsum.photos/seed/hero/1920/600" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full mb-4 border border-indigo-500/30 uppercase tracking-widest">
                  Oferta de Verano
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                  DOMINA EL <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">JUEGO</span>
                </h1>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Las mejores keys de juegos digitales para PC, Xbox y PlayStation. Precios imbatibles, entrega inmediata.
                </p>
                <div className="flex gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105">
                    Comprar Ahora
                  </button>
                  <button className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-8 py-3 rounded-lg font-bold transition-all">
                    Ver Más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 no-scrollbar overflow-x-auto pb-2">
          <button 
            onClick={() => setSelectedGenre('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${selectedGenre === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Todos
          </button>
          {Object.values(Genre).map(genre => (
            <button 
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${selectedGenre === genre ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : selectedGenre === 'All' ? (
              <><TrendingUp className="text-indigo-400" /> Tendencias</>
            ) : selectedGenre}
          </h2>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1"><Filter className="w-4 h-4" /> Ordenar por: Relevancia</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? filteredGames.map(game => (
            <div key={game.id} className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={game.imageUrl} 
                  alt={game.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-300 border border-slate-700 uppercase">
                    {game.platform}
                  </span>
                </div>
                {game.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-indigo-600 px-2 py-1 rounded text-xs font-black text-white shadow-lg">
                      -{game.discount}%
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 game-card-gradient opacity-80"></div>
                
                {/* Overlay Action */}
                <div className="absolute inset-0 flex items-end p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => addToCart(game)}
                    className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Añadir al Carrito
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{game.genre}</span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{game.region}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white">{game.price.toFixed(2)}€</span>
                  {game.discount > 0 && (
                    <span className="text-sm text-slate-500 line-through font-medium">{game.originalPrice.toFixed(2)}€</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 text-lg">No encontramos juegos que coincidan con tu búsqueda.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                className="mt-4 text-indigo-400 hover:underline font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <Gamepad2 className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold">KEYNEXUS</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tu destino número uno para licencias digitales originales. Calidad, velocidad y soporte 24/7.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-200">Tienda</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-indigo-400 cursor-pointer">Bestsellers</li>
                <li className="hover:text-indigo-400 cursor-pointer">Novedades</li>
                <li className="hover:text-indigo-400 cursor-pointer">Próximos lanzamientos</li>
                <li className="hover:text-indigo-400 cursor-pointer">Ofertas especiales</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-200">Soporte</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-indigo-400 cursor-pointer">Centro de ayuda</li>
                <li className="hover:text-indigo-400 cursor-pointer">Cómo activar una key</li>
                <li className="hover:text-indigo-400 cursor-pointer">Política de reembolso</li>
                <li className="hover:text-indigo-400 cursor-pointer">Contáctanos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-200">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-indigo-400 cursor-pointer">Términos y condiciones</li>
                <li className="hover:text-indigo-400 cursor-pointer">Privacidad</li>
                <li className="hover:text-indigo-400 cursor-pointer">Cookies</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2024 KeyNexus Digital Services. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Paypal" />
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 z-[70] shadow-2xl border-l border-slate-800 flex flex-col transform transition-transform animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="text-indigo-400" /> Tu Carrito
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-800 rounded-full">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Tu carrito está vacío</p>
                    <p className="text-slate-600 text-sm">Explora nuestra colección y añade algunos juegos.</p>
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                    <img src={item.imageUrl} className="w-20 h-24 object-cover rounded-lg" alt={item.title} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm truncate pr-4">{item.title}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mb-2">{item.platform} • {item.region}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-slate-800 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-slate-800 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-indigo-400">{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 space-y-4">
              <div className="flex justify-between items-center text-slate-400">
                <span>Subtotal</span>
                <span>{totalCartPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl">
                <span>Total</span>
                <span className="text-white">{totalCartPrice.toFixed(2)}€</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
              >
                Tramitar Pedido
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Assistant Modal */}
      <GeminiAssistant isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onAddToCart={addToCart} />
    </div>
  );
};

export default App;
