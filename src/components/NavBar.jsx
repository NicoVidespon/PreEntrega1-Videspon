import React, { useState } from 'react';
import CartWidget from './CartWidget';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.png';

const NavBar = () => {
    const [hoveredLogo, setHoveredLogo] = useState(false);
    const [hoveredRemeras, setHoveredRemeras] = useState(false);
    const [hoveredPantalones, setHoveredPantalones] = useState(false);
    const [hoveredZapatillas, setHoveredZapatillas] = useState(false);
    const [hoveredCart, setHoveredCart] = useState(false);

    return (
        <nav style={styles.navBar}>
            <Link
                to='/'
                style={styles.img}
                onMouseEnter={() => setHoveredLogo(true)}
                onMouseLeave={() => setHoveredLogo(false)}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        ...styles.logoImage,
                        transform: hoveredLogo ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                />
            </Link>
            <ul style={styles.navList}>
                <li
                    style={{
                        ...styles.navItem,
                        transform: hoveredRemeras ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredRemeras(true)}
                    onMouseLeave={() => setHoveredRemeras(false)}
                >
                    <Link to='/category/remeras' style={styles.navLink}>Remeras</Link>
                </li>
                <li
                    style={{
                        ...styles.navItem,
                        transform: hoveredPantalones ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredPantalones(true)}
                    onMouseLeave={() => setHoveredPantalones(false)}
                >
                    <Link to='/category/pantalones' style={styles.navLink}>Pantalones</Link>
                </li>
                <li
                    style={{
                        ...styles.navItem,
                        transform: hoveredZapatillas ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredZapatillas(true)}
                    onMouseLeave={() => setHoveredZapatillas(false)}
                >
                    <Link to='/category/buzos' style={styles.navLink}>Buzos</Link>
                </li>
            </ul>
            <Link
                to='/cart'
                style={{
                    ...styles.cartLink,
                    transform: hoveredCart ? 'scale(1.1)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredCart(true)}
                onMouseLeave={() => setHoveredCart(false)}
            >
                <CartWidget />
            </Link>
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
    },
    img: {
        marginLeft: '30px',
        height: 'auto',
        width: '200px',
        display: 'flex',
    },
    logoImage: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        gap: '30px',
        color: 'black',
        fontSize: '25px',
    },
    navItem: {
        transition: 'transform 0.3s ease',
    },
    navLink: {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
    },
    cartLink: {
        transition: 'transform 0.3s ease',
    },
};

export default NavBar;
