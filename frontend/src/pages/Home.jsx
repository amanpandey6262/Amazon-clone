import React, { useState, useEffect } from 'react';
import './Home.css';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function Home({ refreshCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  // Fetch categories once from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/categories');
        setCategories(['All', ...res.data]);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when search or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = 'http://localhost:3001/api/products';
        const params = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (activeCategory !== 'All') params.push(`category=${encodeURIComponent(activeCategory)}`);
        if (params.length > 0) url += '?' + params.join('&');

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
  }, [search, activeCategory]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:3001/api/cart', { productId, quantity: 1 });
      if (refreshCart) refreshCart();
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  return (
    <div className="home">
      <div className="home__container">
        <img
          className="home__image"
          src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
          alt="Amazon Banner"
        />

        <div className="home__filters">
          {categories.map((cat) => (
            <span 
              key={cat}
              className={`home__categoryBadge ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="home__row">
          {products.map(product => {
            const images = JSON.parse(product.images);
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={images[0]}
                category={product.category}
                onAddToCart={handleAddToCart}
              />
            );
          })}
          {products.length === 0 && (
            <div style={{margin: '40px', textAlign: 'center', width: '100%'}}>
              <h2>No products found.</h2>
              <p style={{color: '#666', marginTop: '10px'}}>Try a different search term or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
