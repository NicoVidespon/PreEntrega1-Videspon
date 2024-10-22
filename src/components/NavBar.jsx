import CartWidget from './CartWidget';

const NavBar = () => {
    return (
        <nav style={styles.navBar}>
            <h2 style={styles.h2}>X PROYECT</h2>
            <ul style={styles.navList}>
                <li><a href="/productos" style={styles.navLink}>Productos</a></li>
                <li><a href="/descuentos" style={styles.navLink}>Descuentos</a></li>
                <li><a href="/contacto" style={styles.navLink}>Contacto</a></li>
            </ul>
            <CartWidget />
        </nav>
    );
};

const styles = {
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '200px',
        padding: '10px 20px',
        backgroundColor: 'white',
        color: 'black',
    },
    h2: {
        fontSize: '40px',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        gap: '30px',
        color: 'black',
        fontSize: '25px',
    },
    navLink: {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
    },
};

export default NavBar;

