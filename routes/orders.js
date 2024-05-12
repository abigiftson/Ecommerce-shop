var express = require("express");
var router = express.Router();
const { database } = require("../config/helper");

/* GET ALL ORDERS. */
router.get('/', function (req, res) {
  database
    .table("orders_details as od")
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
router.get('/:id', (req, res) => {
  const orderId = req.params.id;

  database
    .table("orders_details as od")
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
      "p.image",
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
router.post('/new', async (req, res) => {
  let { userId, products } = req.body;

  if (userId != null && userId > 0 && !isNaN(userId)) {
    try {

      const newOrderId = await database.table("orders").insert({ user_id: userId });
 
      if (newOrderId.insertId > 0) {
 
        console.log(newOrderId.insertId)
        for (let p of products) {
           try {
             let data = await database.table("products").filter({ id: p.id }).withFields(["quantity"]).get();
           let inCart = p.incart;

            if (data.quantity > 0) {
              data.quantity = data.quantity - inCart;
              if (data.quantity < 0) {
                data.quantity = 0;
              }
            } else {
              data.quantity = 0;
            }

            await database.table("orders_details").insert({
              order_id: newOrderId.insertId,
              product_id: p.id,
              quantity: inCart,
            });

            await database.table("products").filter({ id: p.id }).update({ quantity: data.quantity });

          } catch (error) {
            console.error("Error processing product:", error);
            // Handle errors
          }
        }

        res.json({
          message: `Order successfully placed with order id ${newOrderId.insertId}`,
          success: true,
          order_id: newOrderId,
          products: products
        });
      } else {
        res.json({ message: 'New order failed while adding order details', success: false });
      }
    } catch (err) {



      console.error("Error creating new order:", err);
      res.json({ message: 'New order failed', success: false });
    }
  } else {
    res.json({ message: 'Invalid user ID', success: false });
  }
});

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req,res) => {
    setTimeout(() => {
      res.status(200).json({ success: true });
    }, 3000);
});

module.exports = router;
