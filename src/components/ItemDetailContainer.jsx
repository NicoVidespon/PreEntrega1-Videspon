import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../asyncMock';

const ItemDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div style={styles.loading}>Cargando producto...</div>;
  }

  if (!product) {
    return <div style={styles.loading}>Producto no encontrado.</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    alert('Producto agregado al carrito');
  };

  return (
    <div style={styles.container}>
      <article style={styles.article}>
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.title} style={styles.image} />
        </div>
        <div style={styles.infoContainer}>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.description}><strong>Descripción:</strong> {product.description}</p>
          <p style={styles.price}><strong>Precio:</strong> ${product.price}</p>
          <p style={styles.category}><strong>Categoría:</strong> {product.category}</p>
          <div style={styles.buttonsContainer}>
            <button style={styles.button} onClick={handleGoBack}>Volver</button>
            <button style={styles.button} onClick={handleAddToCart}>Agregar al carrito</button>
          </div>
        </div>
      </article>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    paddingTop: '80px',
    textAlign: 'center',
    backgroundColor: 'grey',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  article: {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '80%', 
    padding: '30px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',  
    textAlign: 'left',  
    display: 'flex',
    flexDirection: 'row',  
    alignItems: 'center', 
    gap: '20px',  
  },
  imageContainer: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', 
    maxWidth: '400px',  
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',  
    objectFit: 'cover',
  },
  infoContainer: {
    flex: '2',  
    display: 'flex',
    flexDirection: 'column',  
    justifyContent: 'center',  
  },
  title: {
    fontSize: '2.5rem',
    color: '#444',
    marginBottom: '20px',
    fontWeight: 'bold',
    textTransform: 'capitalize', 
  },
  description: {
    marginBottom: '20px',
    color: '#555',
  },
  price: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#e91e63', 
    marginBottom: '20px',
  },
  category: {
    fontSize: '1.2rem',
    color: '#777',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px',  
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#e91e63',  
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#c2185b', 
  },
  loading: {
    fontSize: '20px',
    color: 'gray',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default ItemDetailContainer;
