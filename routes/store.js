var express = require('express');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const Product = require('../models/Product');
const ShoppingCart = require('../models/ShoppingCart');
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const Library = require('../models/Library')
const { Client, Environment, ApiError } = require('square')
const { SQUARE_ACCESS_TOKEN } = require('./config');
const crypto = require('crypto');


var router = express.Router();

const appId = 'sandbox-sq0idb-cOGNPoTLxMDLr1Hf9Ep_Jg';
const locationId = 'L25A8Q74V8J17';

const client = new Client({
  accessToken: SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

async function createPayment(req, res){
  const payload = await json(res);
  console.log(JSON.stringify(payload));

  /* payload verification would go here */
  await retry(async(bail, attempt) => {
    console.log("Creating payment ",attempt);
    try
    {
      const payment = {
        idempotencyKey: payload.idempotencyKey,
          locationId: payload.locationId,
          sourceId: payload.sourceId,
          // While it's tempting to pass this data from the client
          // Doing so allows bad actor to modify these values
          // Instead, leverage Orders to create an order on the server
          // and pass the Order ID to createPayment rather than raw amounts
          // See Orders documentation: https://developer.squareup.com/docs/orders-api/what-it-does
          amountMoney: {
          // the expected amount is in cents, meaning this is $1.00.
          amount: '100',
          // If you are a non-US account, you must change the currency to match the country in which
          // you are accepting the payment.
          currency: 'USD',
          },
      };
      if(payload.customerId)
      {
        payment.customerId = payload.customerId;
      }
      if (payload.verificationToken) {
        payment.verificationToken = payload.verificationToken;
      }

      const { result, statusCode } =
        await square.paymentsApi.createPayment(payment);
      
      console.log("Payment succeeded: ", {result, statusCode})

      send(res, statusCode, {
        success: true,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          receiptUrl: result.payment.receiptUrl,
          orderId: result.payment.orderId,
        },
      });

    }
    catch(err)
    {
      if(err instanceof ApiError){
        bail(err)
        console.log(err.errors)
      }
      else
      {
        console.log("Error on payment attempt ", attempt, err)
        throw err
      }
    }

    
    
  })
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/orderComplete', async function(req, res, next) {
  console.log("ORDER COMPLETE PAGE OPENED");

  user = req.session.user
  
  console.log(req.body.tokenVal)
  if (user === undefined) {
    req.session.next = req.path
    res.render('account/login');
  }
  else
  {
    products = []
    carts = await ShoppingCart.findCart(user.userid)
    for (cart of carts) {
      products.push(await Product.findProduct(cart.dataValues.productid));
    }
    total = 0
    for (product of products) {
      price = product.productprice.toFixed(2) * 100
      total += price
    }
    total = Math.floor(total).toString()
  
    try{
      const payment = {
        sourceId: req.body.tokenVal,
        amountMoney: {
          amount: total,
          currency: 'USD'
        },
        locationID: locationId,
        idempotencyKey: crypto.randomUUID()
      }
      // IF THIS ERRORS THE PAYMENT FAILS!!! do not do the order if it does fail
      const res = await client.paymentsApi.createPayment(payment);

      orderid = Math.floor(getRandomArbitrary(10000, 99999)) // could break if the same number is chosen twice...

      await Order.create({
        orderid: orderid,
        userid: user.userid,
        status: 'Ordered',
        dateOrdered: Date('2024-05-20'),
        dateDelivered: Date('2024-05-20'),
        paymentOption: 1111
      })


      for (cart of carts) {
        
        cart.destroy();
      }

  
      for (product of products) {
        await OrderItem.create({
          orderid: orderid,
          productid: product.productid,
          quantity: 1 // have to get this info from the cart...
        })

        

        try {
          await Library.create({
            userid: user.userid,
            productid: product.productid,
            purchaseDate: new Date('2024-05-13'),
            downloadDate: new Date('2024-05-13')
          })
        }
        catch (error) {
          console.log('ERROR: Product already in library!');
          console.log(error)
        }
      }
    }
    catch(err)
    {
      console.log(err) // maybe do a redirect here with an error
    }
  }


  
  res.redirect('/account/library')
  // res.redirect('/account/orders') // for testing purposes. Use below for actual implementation
  // res.render('store/orderComplete.ejs', {})
})

router.get('/product.ejs', function(req, res, next) {
  res.redirect('product/0');
});

router.get('/product/:productid', async function(req, res, next) {
  const product = await Product.findProduct(parseInt(req.params.productid));
  const publisher = await Publisher.findPublisher(product.publisherid);
  res.render('store/product', { product, publisher });
});

router.get('/cart', async function(req, res, next) {
  user = req.session.user
  
  if (user === undefined) {
    req.session.next = req.path
    res.render('account/login');
  }
  else {
    carts = await ShoppingCart.findCart(user.userid)

    products = []
    for (cart of carts) {
      products.push(await Product.findProduct(cart.dataValues.productid));
    }

    res.render('store/cart.ejs', { products })
  }
})

router.get('/cart/delete/:productid', async function(req, res, next) {
  user = req.session.user
  
  if (user === undefined) {
    req.session.next = req.path
    res.render('account/login');
  }
  else {
    cart = await ShoppingCart.findCartProduct(user.userid, req.params.productid)
    cart.destroy()

    carts = await ShoppingCart.findCart(user.userid)

    products = []
    for (cart of carts) {
      products.push(await Product.findProduct(cart.dataValues.productid));
    }

    res.redirect('/store/cart')
  }
})

router.post('/cart/add/:productid', async function(req, res, next) {
  try {
    user = req.session.user
  
    if (user === undefined) {
      req.session.next = req.path
      res.render('account/login');
    }
    else {
      await ShoppingCart.create({
        userid: user.userid,
        productid: req.params.productid,
        quantity: 1,
        dateAdded: new Date('2024-04-17')
      })
  
      carts = await ShoppingCart.findCart(user.userid)
    
      products = []
      for (cart of carts) {
        products.push(await Product.findProduct(cart.dataValues.productid));
      }
      
      res.redirect('/store/cart')
    }
  } catch (error) {
    console.log("ADD TO SHOPPING CART ERROR: ", error);
    res.redirect('/store/product/' + req.params.productid)
  }
})

router.get('/checkout', async function(req, res, next) {
  console.log("CHECKOUT PAGE OPENED");

  user = req.session.user
  
  if (user === undefined) {
    req.session.next = req.path
    res.render('account/login');
  }
  else {
    carts = await ShoppingCart.findCart(user.userid)

    products = []
    for (cart of carts) {
      products.push(await Product.findProduct(cart.dataValues.productid));
    }

    res.render('store/checkout.ejs', { user, products })
}
})

router.get('/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

module.exports = router;
