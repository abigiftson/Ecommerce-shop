var express = require("express");
var router = express.Router();
const { database } = require("../config/helper");


/* GET  ALL ORDERS. */
router.get("/", function (req, res) {
  database
    .table("order_details as od")
    .join([
      {
        table: "orders as o",
        on: "o.id = od.order_id",
      },
      {
        table: "products as p",
        on: "p.id = od.product_id",
      },
      {
        table: "users as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields([
      "o.id",
      "p.title as name",
      "p.description",
      "p.price",
      "u.username",
    ])
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ Message: "no orders found" });
      }
    })
    .catch((err) => console.log(err));
});

/* GET SINGLE ORDERS. */
router.get("/:id", (req, res) => {
  const orderId = req.params.id;

  database
    .table("order_details as od")
    .join([
      {
        table: "orders as o",
        on: "o.id = od.order_id",
      },
      {
        table: "products as p",
        on: "p.id = od.product_id",
      },
      {
        table: "users as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields([
      "o.id",
      "p.title as name",
      "p.description",
      "p.price",
      "u.username",
    ])
    .filter({ "o.id": orderId })
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ Message: `no orders found with orderId ${orderId}` });
      }
    })
    .catch((err) => console.log(err));
});

/* PLACE A NEW ORDER */
router.post('/new', (req, res) => {
  let {userId, products} = req.body;
  console.log(userId, products);

  // if (userId != null && userId > 0 && !isNaN(userId)) {
  //   database
  //     .table("orders")
  //     .insert({
  //       user_id: userId,
  //     })
  //     .then(newOrderId => {
        
  //       if (newOrderId > 0) {
  //         products.forEach(async (p) => {
  //           let data = await database
  //             .table("products")
  //             .filter({ id: p.id })
  //             .withFields(["qty"])
  //             .get();

  //           let inCart = p.inCart;

  //           // Deduct the number of pieces ordered from the quantity column in database
  //           if (data.qty > 0) {
  //             data.qty = data.qty - inCart;

  //             if (data.qty < 0) {
  //               data.qty = 0;
  //             }
  //           } else {
  //             data.qty = 0;
  //           }

  //           // INSERT ORDER DETAILS W.R.T THE NEWLY GENERATED ORDER ID
  //           database
  //             .table("order_details")
  //             .insert({
  //               order_id: newOrderId,
  //               product_id: p.id,
  //               qty: inCart,
  //             })
  //             .then((newId) => {
  //               database
  //                 .table("products")
  //                 .filter({ id: p.id })
  //                 .update({ 
  //                   qty: data.qty,
  //                 })
  //                 .then(successNum => {})
  //                 .catch(err => console.log(err));
  //                }).catch(err => console.log(err));
              
  //               });
              
  //       } else {
  //         res.json({message: 'new order failed while adding order details',success: false})
  //       }
  //       res.json({
  //         message: `order successfully placed with order id ${newOrderId}`,
  //         success: true,
  //         order_id: newOrderId,
  //         products: products
  //       });

  //     }).catch(err => console.log(err))
  // } else {
  //   res.json({message: 'New order failed', success: false});
  // }


});

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req,res) => {
    setTimeout( () => {
      res.status(200).json({success: true});
    }, 3000);
})



module.exports = router;
