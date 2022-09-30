const router = require("express").Router();
const passport = require("passport");

const {getProducts, Addproduct, getAllProducts, getProductById, getCustomerById,UpdateCartItem, deleteItemById} = require("../controllers/cart");

// get all item 
router.get("/", passport.authenticate("jwt", {session: false}), getProducts)
router.post("/add", passport.authenticate("jwt", {session: false}),Addproduct);
router.post("/allproducts", passport.authenticate("jwt", {session: false}), getAllProducts)
router.get("/:id", passport.authenticate("jwt", {session: false}), getProductById)
router.get("/customer/:id", passport.authenticate("jwt", {session: false}), getCustomerById)
router.delete("/:id", passport.authenticate("jwt", {session: false}), deleteItemById)
router.delete("/:id", passport.authenticate("jwt", {session: false}), UpdateCartItem)

module.exports = router;
