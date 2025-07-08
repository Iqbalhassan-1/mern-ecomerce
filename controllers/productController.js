
import cloudinary from "cloudinary";
import ProductModel from "../models/productModel.js";
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        console.log(req.files);

        const image1 = req.files?.image1?.[0] || null;
        const image2 = req.files?.image2?.[0] || null;
        const image3 = req.files?.image3?.[0] || null;
        const image4 = req.files?.image4?.[0] || null;
        const images = [image1, image2, image3, image4]
            .filter(image => image !== null)

        let imageUrl = await Promise.all(images.map(async (image) => {
            const uploadedImage = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });
            return uploadedImage.secure_url;
        }));
        // Check if all images are uploaded
        if (imageUrl.length < 1) {
            return res.json({ success: false, message: "Please upload at least one image" });
        }
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            images: imageUrl,
            date: Date.now()
        }
        const product = new ProductModel(productData);
        await product.save();
        res.json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }

}

const listProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({})
        res.json({ success: true, message: "Products listed successfully", products });

    } catch (error) {
        console.error("Error listing products:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }

}

const removeProduct = async (req, res) => {

}
const singleProduct = async (req, res) => {

}

export { addProduct, listProducts, removeProduct, singleProduct };