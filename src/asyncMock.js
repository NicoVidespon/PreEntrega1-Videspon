// asyncMock.js
const products = [
  {
    id: 1,
    title: 'Remera undefined black',
    price: '25000',
    category: 'remeras',
    description: 'Colores: negro',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18844787-800-auto?v=638479273335370000&width=800&height=auto&aspect=true',
  },
  {
    id: 2,
    title: 'Buzo undefined black',
    price: '45000',
    category: 'buzos',
    description: 'Colores: negro',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18824875-800-auto?v=638477541708330000&width=800&height=auto&aspect=true',
  },
  {
    id: 3,
    title: 'Remera undefined white',
    price: '30000',
    category: 'remeras',
    description: 'Colores: blanco',
    image: 'https://newsport.vtexassets.com/arquivos/ids/19483198-800-auto?v=638634804315070000&width=800&height=auto&aspect=true',
  },
  {
    id: 4,
    title: 'Buzo undefined brown',
    price: '45000',
    category: 'buzos',
    description: 'Colores: marron',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18826255-800-auto?v=638477603038430000&width=800&height=auto&aspect=true',
  },
  {
    id: 5,
    title: 'Remera undefined Vi',
    price: '20000',
    category: 'zapatillas',
    description: 'Colores: negro, blanco',
    image: 'https://newsport.vtexassets.com/arquivos/ids/19483379-800-auto?v=638634810414430000&width=800&height=auto&aspect=true',
  },
  {
    id: 6,
    title: 'Remera undefined Vii',
    price: '20000',
    category: 'remeras',
    description: 'Colores: negro, blanco',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18844791-800-auto?v=638479273336930000&width=800&height=auto&aspect=true',
  },
  {
    id: 7,
    title: 'Pantalon undefined orange',
    price: '45000',
    category: 'pantalones',
    description: 'Colores: naranja',
    image: 'https://marathon.vtexassets.com/arquivos/ids/555330-800-auto?v=638500191449500000&width=800&height=auto&aspect=true',
  },
  {
    id: 8,
    title: 'Buzo undefined',
    price: '50000',
    category: 'buzos',
    description: 'Colores: negro, blanco y gris',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18826293/BUCG332-A.jpg?v=638477610258770000',
  },
  {
    id: 9,
    title: 'Pantalon jean undefined',
    price: '45000',
    category: 'pantalones',
    description: 'Colores: celeste, negro',
    image: 'https://newsport.vtexassets.com/arquivos/ids/18844764/PACT363-A.jpg?v=638479273302600000',
  },
];


export const getProducts = new Promise((resolve) => {
  setTimeout(() => {
    resolve(products);
  }, 2000);
});

export const getProduct = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((prod) => prod.id === parseInt(id));
      resolve(product);
    }, 1000);
  });
};

export const getCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = products.filter((product) => product.category === category);
      resolve(filteredProducts);
    }, 1000);
  });
};

