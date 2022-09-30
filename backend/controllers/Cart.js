const Products = require("../models/products.model");
const Cart = require("../models/cart.model");

const title = "Cart";
const roleTitle = "cart";

const getProducts  = (req, res) => {
const rolesControl = req.user.isActive;
if(rolesControl){
    Cart.find()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => res.json({
        message: "Error" + err,
        variant: "error"
    }
    ))
} else {
    res.status(403).json({
        message: "Your account is not active!",
        variant: "error",
    })
}
};

// Post new items
const Addproduct = (req, res) => {
const rolesControl = req.user.isActive;
if(rolesControl){
    new Cart(req.body)
    .save()
    .then(() => res.json({message: title + " Added",
  variant: "success,"
})
)
.catch((err) =>  res.json({message: " Error: " + err,
  variant: "error"
}))
} else {
    res.status(403).json({
        message: "Your account is not active !",
        variant: "error",
    })
}
};

// Get all product 
const getAllProducts = (req, res) => {
    Products.find(req.body)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({
            message: "Error: " + err,
            variant: "error",
        })
    })
}

// Get product by id 
 const getProductById  =  (req, res) => {
    const rolesControl = req.user.isActive;
    if (rolesControl) {
      Cart.findById(req.params.id)
        .then((data) => res.json(data))
        .catch((err) =>
          res.status(400).json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else {
      res.status(403).json({
        message: {
          messagge: "Your account is not active!",
          variant: "error",
        },
      });
    };
 }

 // get customer by id
 const getCustomerById = (req, res) => {
    const rolesControl = req.user.isActive;
    if(rolesControl){
        Cart.find({customer_id: req.params.id})
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({
            message: "Error: " + err,
            variant: "error",
        }))
    } else {
        res.status(403).json({
         message: "Your account is not active!",
         variant: "error",
        })
    }
 }

 // delete an item from cart by id
 const deleteItemById = (req, res) => {
    const rolesControl = req.user.role;
    if(rolesControl[roleTitle + "delete"]){
        Cart.findByIdAndDelete(re.params.id)
        .then(() => {
            res.json({
                message: title + " deleted successfully",
                variant: "error",
            })
        })
    }
 }

 // Update an item in cart
 const UpdateCartItem = (req, res) => {
const rolesControl = req.user.isActive;

if(rolesControl) {
  Cart.findByIdAndUpdate(req.params.id, req.body)
  .then(() =>{
    res.json({
        message: title + " updated successfully",
        variant: "success",
    })
    .catch((err) => res.json({
        message: " Error: " + err,
        variant: "error",
    }))
  }
  )
} else {
    res.status(403).json({
        message: "Your account is not active !",
        variant: "error",  
    })
}
 }

module.exports = {
    getProducts,
    Addproduct,
    getAllProducts,
    getProductById,
    getCustomerById,
    deleteItemById,
    UpdateCartItem,
}