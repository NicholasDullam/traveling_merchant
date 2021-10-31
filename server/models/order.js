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
    earnings: Number,
    requirements: Object,
    metadata: Object
}, { 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

Order.post('findOneAndUpdate', async (doc, next) => {
    let notification = {}

    switch(doc.status) {
        case ('delivery_pending'):
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                link: process.env.NODE_ENV === 'production' ? `${process.env.ORIGIN}/orders/${doc._id}` : `localhost:3000/orders/${doc._id}`,
                content: 'New Order: Awaiting delivery'
            }
        case ('confirmation_pending'):
            notification = {
                type: 'order',
                sender: doc.seller,
                receiver: doc.buyer,
                link: process.env.NODE_ENV === 'production' ? `${process.env.ORIGIN}/orders/${doc._id}` : `localhost:3000/orders/${doc._id}`,
                content: 'Order Delivered: Awaiting confirmation'
            }
        case ('denied_delivery_pending'):
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                link: process.env.NODE_ENV === 'production' ? `${process.env.ORIGIN}/orders/${doc._id}` : `localhost:3000/orders/${doc._id}`,
                content: 'Order Denied: Awaiting delivery'
            }
        case ('confirmed'):
            notification = {
                type: 'order',
                sender: doc.buyer,
                receiver: doc.seller,
                link: process.env.NODE_ENV === 'production' ? `${process.env.ORIGIN}/orders/${doc._id}` : `localhost:3000/orders/${doc._id}`,
                content: 'Order Confirmed'
            }
    }
    
    notification = new Notification(notification)
    await notification.save()
    next()
})

module.exports = mongoose.model('Order', Order);