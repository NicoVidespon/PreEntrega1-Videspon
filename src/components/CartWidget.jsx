import cartIcon from '../assets/images/carrito-de-compras.png'

const CartWidget = () => {
    return (
        <div style={styles.cart}>
            <a href="/carrito"><img src={cartIcon} alt="Carrito" style={styles.cartIcon} /></a>
            <span style={styles.span}>2</span>
        </div>
    );
};
const styles = {

    cart: {
        display: 'flex',
        alignItems: 'center'
    },
    cartIcon: {
        width: '30px',
        marginRight: '5px',
    },
    span: {
        fontSize: '20px',
    }
}

export default CartWidget;