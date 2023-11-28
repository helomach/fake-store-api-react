// Importa as dependências do React e o arquivo de estilos
import React, { useState, useEffect } from 'react';
import './App.css';

// Componente principal do aplicativo
function App() {
  // Estados para armazenar produtos, carrinho, termo de pesquisa, categoria selecionada,
  // categorias disponíveis e a exibição do carrinho
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Buscar dados da API fakestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faz uma requisição para a API fakestore para obter os produtos
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Converte a resposta para o formato JSON
        const data = await response.json();
        // Atualiza o estado dos produtos com os dados obtidos
        setProducts(data);

        // Extrai categorias únicas dos produtos
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        // Atualiza o estado das categorias com as categorias únicas
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        // Em caso de erro, exibe uma mensagem no console
        console.error('Error fetching data:', error);
      }
    };

    // Chama a função de busca de dados ao montar o componente
    fetchData();
  }, []); // Executado apenas uma vez durante a montagem do componente

  // Função para adicionar um item ao carrinho
  const addToCart = (product) => {
    // Verifica se o item já está no carrinho
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Se o item já estiver no carrinho, incrementa a quantidade
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Se o item não estiver no carrinho, adiciona ao carrinho com quantidade 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Função para remover um item do carrinho
  const removeFromCart = (productId) => {
    // Filtra o carrinho para remover o item com o ID correspondente
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  // Função para lidar com alterações na barra de pesquisa
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Função para lidar com alterações na seleção de categoria
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Função para exibir ou ocultar o carrinho
  const toggleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  // Função para fechar o carrinho
  const closeCart = () => {
    setShowCart(false);
  };

  // Controlar o overflow do corpo do documento com base na exibição do carrinho
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [showCart]);

  // Filtra os produtos com base na categoria e termo de pesquisa
  const filteredProducts = products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Componente principal renderizado
  return (
    <div>
      {/* Cabeçalho da aplicação */}
      <header>
        <h1>Fake Store</h1>
        {/* Barra de pesquisa */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {/* Filtro de categoria */}
        <div className="category-filter">
          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
            {/* Mapeia as categorias disponíveis para opções no menu suspenso */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* Informações do carrinho */}
        <div className="cart-info" onClick={toggleCart} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="cart">
            🛒
          </span>{' '}
          {cart.length} Items
        </div>
      </header>

      {/* Lista de produtos renderizados */}
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.title} />
            <div className="product-info">
              <h2>{product.title}</h2>
              <p className="price">${product.price}</p>
            </div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Overlay do carrinho (exibido quando o carrinho está aberto) */}
      {showCart && (
        <div className="cart-overlay" onClick={closeCart}>
          {/* Carrinho */}
          <div className="cart">
            <h2>Shopping Cart</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  <div className="cart-item">
                    <div className="cart-item-info">
                      <p className="name">{item.title}</p>
                      <p className="price">${item.price} x {item.quantity}</p>
                    </div>
                    <div className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            </div>
            <button className="checkout-button">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
