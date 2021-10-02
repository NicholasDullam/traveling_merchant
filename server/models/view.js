var mongoose = require('mongoose');

// view history schema

const View = new mongoose.Schema({
    products: [{type:mongoose.Types.ObjectId,ref:'Product'}],
    token: String,
    user: {type:mongoose.Types.ObjectId,ref:'User'}
});

View.methods.addProduct = function addProduct(p) {
    var i;
    var f = 0;
    for (i = 0; i < this.products.length; i++) {
        if (this.products[i] == p) {
            f = 1;
        }
    }
    if (f == 0) {
        this.products[this.products.length] = p;
    }
}

View.methods.init = function () {};