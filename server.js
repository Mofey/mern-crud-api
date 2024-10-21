import express from 'express';
import dotenv from 'dotenv';
import { createProduct, getProducts, updateProduct, deleteProduct } from './controllers/ProductControllers.js';
import mongoose from 'mongoose';
import cors from 'cors';

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

app.use(cors({
  origin: [
      'http://localhost:5173',
      'https://mern-crud-frontend-orpin.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// routes
app.post('/products', createProduct);

app.get('/products', getProducts);

app.put('/products/:id', updateProduct);

app.delete('/products/:id', deleteProduct);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

export default app;