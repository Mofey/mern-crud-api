import express from 'express';
import dotenv from 'dotenv';
import Product from './models/products.js';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI/*, 
            This block of code used to be needed in the past but not anymore
            {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            }*/
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/products', async (req, res) => {
    const { name, price, image } = req.body;
    const product = new Product({
        name,
        price,
        image
    });
    try {
        const createdProduct = await product.save();
        res.status(201).json({ success: true, data: createdProduct});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/products', async (req, res) => {
    console.log('Fetching products...');
    try{
        const products = await Product.find({});
        res.json({ success: true, data: products });
        console.log('Products fetched successfully');
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Product not found" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.delete('/products/:id', async (req, res) => {

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Product not found" });
    }
    
    //console.log("id: ", id);

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted"})
    } catch (error) {
        console.error("Error in Delete Product: ", error.message);
        //internal server error
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;