const express = require("express");
const router = express.Router();
const { database } = require("../config/helper");

/* GET ALL PRODUCTS */
router.get("/", function (req, res) {
  let page =
    (req.query.page != undefined) & (req.query.page != 0) ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit != undefined && req.query.limit != 0 ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0,10,20,30 I
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: "c.id = p.cat_id",
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.id"
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if(prods.length > 0 ) {
        res.status(200).json({
            count: prods.length,
            products: prods
        });
      }else {
        res.json({message: 'no products found'});
      }
    }).catch(err => console.log(err));

});

/* GET SINGLE PRODUCTS */
router.get("/:prodId", (req,res)=>{

 let productId = req.params.prodId;
 console.log(productId);

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: "c.id = p.cat_id",
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.images",
      "p.id"
    ])  
    .filter({'p.id' : productId})
    .sort({id: .1})
    .get()
    .then(prod => {
      if(prod) {
        res.status(200).json({prod});
      }else {
        res.json({message: `no product found with product id ${productId}`});
      }
    }).catch(err => console.log(err));


});

/* GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY */
router.get('/category/:cateName',(req,res) => {

  let page =
    (req.query.page != undefined) & (req.query.page != 0) ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit != undefined && req.query.limit != 0 ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0,10,20,30 I
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

// Fetch the Category Name from the URL
  const cat_title = req.params.cateName;

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: `c.id = p.cat_id  WHERE c.title LIKE '%${cat_title}%'`,
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.image",
      "p.id"
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(prods => {
      if(prods.length > 0 ) {
        res.status(200).json({
            count: prods.length,
            products: prods
        });
      }else {
        res.json({message: `no products found from ${cat_title} category.`});
      }
    }).catch(err => console.log(err));

})

module.exports = router;
