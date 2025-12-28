const { DeliveryService } = require('../services');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

const DeliveryController = {
// Create Delivery
createDelivery: [
    upload.fields([{ name: 'image', maxCount: 1 }]), // Image upload handling
    async (req, res, next) => {
        try {
            const imageFile = req.files?.image?.[0];
            const deliveryData = await DeliveryService.createDelivery(req.body, imageFile);
            next({ message: 'Delivery created successfully', deliveryData });
        } catch (error) {
            next(error);
        }
    }
],

// Edit Delivery
editDelivery: [
    upload.fields([{ name: 'image', maxCount: 1 }]), // Image upload handling
    async (req, res, next) => {
        try {
            const imageFile = req.files?.image?.[0];
            const deliveryId = req.params.id;
            const updatedData = await DeliveryService.editDelivery(deliveryId, req.body, imageFile);
            next({ message: 'Delivery updated successfully', updatedData });
        } catch (error) {
            next(error);
        }
    }
],


    // Delete Delivery
    deleteDelivery: [
        async (req, res, next) => {
            try {
                const deliveryId = req.params.id;
                const deletedDelivery = await DeliveryService.deleteDelivery(deliveryId);
                next({ message: 'Delivery deleted successfully', deletedDelivery });
            } catch (error) {
                next(error);
            }
        }
    ],



    // View Delivery by ID
    viewDelivery: [
        async (req, res, next) => {
            try {
                const delivery = await DeliveryService.viewDelivery();
                next({ delivery });
            } catch (error) {
                next(error);
            }
        }
    ],

        // View Delivery by ID
        viewDeliveryId: [
            async (req, res, next) => {
                try {
                    const id = req.params.id;
                    const delivery = await DeliveryService.viewDeliveryId(id);
                    next({ delivery });
                } catch (error) {
                    next(error);
                }
            }
        ],


            
    listDelivery: [
        async (req, res, next) => {
            try {
                const delivery = await DeliveryService.listDelivery({
                    page: parseInt(req.query.page) || 0,
                    limit: parseInt(req.query.limit) || 0,
                    title: req.query.title,
                    active: req.query.active,
                    sortby: req.query.sortBy,
                });
                next(delivery);
            } catch (error) {
                next(error);
            }
        }
    ],



};

module.exports = DeliveryController;
