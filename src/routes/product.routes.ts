import { Router } from 'express';
import { ProductController } from '../controllers/product_controller';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.post('/', productController.createProduct.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

export default router;
