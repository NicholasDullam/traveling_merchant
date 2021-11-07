const mongoose = require('mongoose');
const Notification = require('./notification')

// Order Schema
const Order = new mongoose.Schema({
    buyer: { type: mongoose.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
    pi_id: String,
    tr_id: String,
    status: String,
    custom: Boolean,
    refunded: Boolean,
    last_delivered_at: Date,
    auto_confirm_at: Date,
    confirmed_at: Date,
    unit_price: Number,
    quantity: Number,
    total_cost: Number,
    commission_fees: Number,
    requirements: Object,
    metadata: Object
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

Order.post('findOneAndUpdate', async (doc, next) => {
    let notification = null

    switch(doc.status) {
        case ('delivery_pending'): {
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                content: 'New Order: Awaiting delivery',
                metadata: {
                    order_id: doc._id
                }
            }
            break;    
        }

        case ('confirmation_pending'): {
            notification = {
                type: 'order',
                sender: doc.seller,
                receiver: doc.buyer,
                content: 'Order Delivered: Awaiting confirmation',
                metadata: {
                    order_id: doc._id
                }
            }
            break;
        }
            
        case ('denied_delivery_pending'): {
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                content: 'Order Denied: Awaiting delivery',
                metadata: {
                    order_id: doc._id
                }
            }
            break;
        }
        
        case ('confirmed'): {
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                content: 'Order Confirmed',
                metadata: {
                    order_id: doc._id
                }
            }
            break;
        }
    }
    
    if (!notification) return next()
    notification = new Notification(notification)
    await notification.save()
    next()
})

module.exports = mongoose.model('Order', Order);