const ItemListContainer = ({ greeting }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>{greeting}</h1>
    </div>
  );
};

const styles = {
  container: {
    height: '500px',
    padding: '0px',
    textAlign: 'center',
    backgroundColor: 'blue',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1: {
    margin: 0,

  }
};

export default ItemListContainer;
