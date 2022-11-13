const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//create product
exports.createProduct = catchAsyncError(async(req,res,next)=>{
    console.log(req.body);
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});
//get all product
exports.getAllProducts = catchAsyncError(async(req,res)=>{
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    //console.log(apiFeature.query);
    const products = await apiFeature.query;
    //console.log(products);
    res.status(200).json({
        success:true,
        products,
        productCount
    });
});
//get product details
exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        product
    })
});


//update product
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",500));
    }
    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
});

//delete
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",500));
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});