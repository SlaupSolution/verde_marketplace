import React, { useState } from 'react';
import './Catalog.css';

const SHEETDB_API = 'https://sheetdb.io/api/v1/xc3sa8jtv6o7m';

const products = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 'R$ 5,99',
    image: '/images/tomatoes.jpg',
    category: 'Vegetables'
  },
  {
    id: 2,
    name: 'Fresh Bread',
    price: 'R$ 4,50',
    image: '/images/bread.jpg',
    category: 'Bakery'
  },
  {
    id: 3,
    name: 'Local Honey',
    price: 'R$ 15,90',
    image: '/images/honey.jpg',
    category: 'Groceries'
  },
  {
    id: 4,
    name: 'Farm Eggs',
    price: 'R$ 8,99',
    image: '/images/eggs.jpg',
    category: 'Dairy'
  },
  {
    id: 5,
    name: 'Organic Lettuce',
    price: 'R$ 3,99',
    image: '/images/lettuce.jpg',
    category: 'Vegetables'
  },
  {
    id: 6,
    name: 'Regional Cheese',
    price: 'R$ 22,90',
    image: '/images/cheese.jpg',
    category: 'Dairy'
  }
];

function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Publish product to spreadsheet
  const publishToSheet = async (product) => {
    try {
      const response = await fetch(SHEETDB_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            nome: product.name,
            preco: product.price,
            categoria: product.category,
            data_adicao: new Date().toLocaleString('pt-BR')
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao publicar produto');
      }

      alert('Produto publicado com sucesso!');
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('Erro ao publicar produto. Tente novamente.');
    }
  };

  // Add to cart function
  const addToCart = (product) => {
    setCart([...cart, product]);
    publishToSheet(product);
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => 
    total + parseFloat(item.price.replace('R$ ', '').replace(',', '.')), 0
  );

  return (
    <div className="catalog-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cart-summary">
        <h3>Carrinho ({cart.length} items)</h3>
        <p>Total: R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
      </div>

      <h2>Nosso Catálogo</h2>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">{product.price}</p>
              <button 
                className="add-to-cart"
                onClick={() => addToCart(product)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;