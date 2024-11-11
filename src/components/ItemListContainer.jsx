import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategory, getProducts } from '../asyncMock';

const ItemListContainer = ({ greeting }) => {
  const { id: categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const items = categoryId ? await getCategory(categoryId) : await getProducts;
        setProducts(items);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return <div style={styles.loading}>Cargando productos...</div>;
  }

  return (
    <div style={styles.container}>
      <br />
      <h1>{greeting}</h1>
      <div style={styles.productList}>
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              style={styles.productItem}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  ...styles.productImage,
                  transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              <h2>{product.title}</h2>
              <p style={styles.price}>Precio: ${product.price}</p>
              <Link to={`/item/${product.id}`} style={styles.detailsLink}>Ver detalles</Link>
            </div>
          ))
        ) : (
          <p>No se encontraron productos para esta categoría.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '40px',
    backgroundColor: 'grey',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowY: 'auto',
  },
  h1: {
    marginBottom: '20px',
    fontSize: '2.5rem',
    color: '#333',
  },
  productList: {
    marginTop: '20px',
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(3, 1fr)',
    width: '100%',
    padding: '0 20px',
  },
  productItem: {
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '5px',
    transition: 'transform 0.3s ease',
  },
  price: {
    fontSize: '1.2rem',
    color: '#333',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  detailsLink: {
    display: 'inline-block',
    marginTop: '15px',
    textDecoration: 'none',
    color: '#e91e63',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'color 0.3s ease',
  },
  loading: {
    fontSize: '20px',
    color: 'white',
    textAlign: 'center',
  },
};

export default ItemListContainer;

