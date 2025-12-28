const { Delivery } = require('../db/models');
const s3Service = require('./s3.service'); 
const { CommonLib } = require('../../../lib');
const DeliveryService = {

    async createDelivery(data, file) {
        const deliveryData = {
            title: data.title, 
            description: data.description, 
            link: data.link
        };

        const existingDelivery = await Delivery.findOne({ title: deliveryData.title});
        if (existingDelivery) {
            throw new Error('Title already exists');
        }
    
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            deliveryData.image = imageUrl;
          }
    
        // Create and save the delivery in the database
        const newDelivery = new Delivery(deliveryData);
        return await newDelivery.save();
    },
    
        
    

    

    async editDelivery(id, data, file) {
        const delivery = await Delivery.findById(id);
    
        if (!delivery) {
            throw new Error('Delivery not found');
        }

        const existingDelivery = await Delivery.findOne({ title: data.title, _id: { $ne: id }});
        if (existingDelivery) {
            throw new Error('Title already exists');
        }
    
        // Update the main title if provided
        delivery.title = data.title || delivery.title;
        delivery.description = data.description || delivery.description;
        delivery.link = data.link || delivery.link;
       
        if (file) {
            const imageUrl = await s3Service.uploadFile(file, 'images');
            delivery.image = imageUrl;
          }
    
        // Save and return the updated delivery
        return await delivery.save();
    },
    

    // Delete Delivery
    async deleteDelivery(id) {
        const delivery = await Delivery.findById(id);

        if (!delivery) {
            throw new Error('Delivery not found');
        }

        await Delivery.findByIdAndDelete(id); // Remove the delivery from DB
        return delivery;
    },



    // View Delivery (most recent delivery)
    async viewDelivery() {
        const delivery = await Delivery.findOne().sort({ createdAt: -1 });

        if (!delivery) {
            throw new Error('No delivery found');
        }

        return delivery;
    },

        // View Delivery (most recent delivery)
        async viewDeliveryId(id) {
            const delivery = await Delivery.findById(id);;
    
            if (!delivery) {
                throw new Error('No delivery found');
            }
    
            return delivery;
        },

    async listDelivery({ page, limit, title, active, sortby}) {
        const aggregate = {is_deleted:false};
        let delivery = [];
        let offset;
        let total = null; // Initialize total as null
        let pagination = null;
    
        let sort = {};
        // Implement a switch-case statement
        switch (sortby) {
            case '1':
                sort = { title: 1 }
                break;
            case '2':
                sort = { title: -1 }
                break;
            case '3':
                sort = { createdAt: 1 }
                break;
            case '4':
                sort = { createdAt: -1 }
                break;
            default:
                sort = { createdAt: 1 }
            }
    
        if (page && limit) {
            offset = CommonLib.getOffset(page, limit);
            const query = aggregate;
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') };
            }
    
            if (active){
                query.is_active = active;
            }
    
    
            // Calculate the total count based on the query
            total = await Delivery.countDocuments(query);
    
            // Calculate pagination
            pagination = CommonLib.getPagination(page, limit, total);
    
            // Retrieve users with pagination and type filter
            delivery = await Delivery.find(query)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                ;
        } else {
            const query = aggregate;
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') };
            }
    
            if (active){
                query.is_active = active;
            }
           
            // Calculate the total count based on the query
            total = await Delivery.countDocuments(query);
    
            // Retrieve users with or without type filter
            delivery = await Delivery.find(query).sort(sort);
        }
    
        // Now you have the total count and pagination based on the 'type' variable.
        return { delivery, pagination };
    },


};

module.exports = DeliveryService;
