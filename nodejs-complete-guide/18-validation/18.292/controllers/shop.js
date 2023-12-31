const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  console.log("getProducts")
  const prodId = req.params.productId;
  console.log(prodId)
  Product.find()
  .then(products => {
    console.log(products)
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    // moves right to the error middlewares on the bottom of app.js
    return next(error)
  })
};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render(
      'shop/product-detail', {
        product: product, 
        pageTitle: product.title, 
        path:'/products'
      });
  });
};


exports.getCart = async (req, res, next) => {
  const user = await req.user
  .populate('cart.items.productId')
  console.log('items', user.cart.items)
  res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
  });
};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then( result => {
    console.log(result);
    res.redirect('/cart')
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    // moves right to the error middlewares on the bottom of app.js
    return next(error)
  })
}

exports.postOrder = async (req, res, next) => {
  const user = await req.user
  .populate('cart.items.productId')
  const products = user.cart.items.map(i => {
    return {quantity: i.quantity, product: { ...i.productId._doc }}
  });
  const order = new Order({
    user: {
      email: req.user.email,
      userId: req.user
    },
    products: products
  });
  order.save()
  .then(() => {
    req.user.clearCart();
  })
  .then(() => {
      res.redirect('/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    // moves right to the error middlewares on the bottom of app.js
    return next(error)
  })
};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    // moves right to the error middlewares on the bottom of app.js
    return next(error)
  })
};

/*
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
*/