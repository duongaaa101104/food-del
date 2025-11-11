import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'


import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { $set: { cart: [] } })

        const live_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))
        live_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: live_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Order processing failed. Check server logs." });


    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
    }

//listing all orders for admin panel
const listOrders = async (req, res) => {
    try {
    const orders = await orderModel.find({});
    res.json({success:true, data:orders})
} catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
}
}

//api for updating order status
const updateStatus = async (req, res) => {
    try {
        // 1. Tìm đơn hàng
        const order = await orderModel.findById(req.body.orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found (Check ID)" });
        }

        // 2. Cập nhật trường status
        order.status = req.body.status;

        // 3. LƯU thay đổi (buộc Mongoose phải ghi dữ liệu)
        await order.save(); 

        res.json({ success: true, message: "Status Updated (via .save())", data: order });
    } catch (error) {
        // Nếu có lỗi Schema hoặc validation, nó sẽ hiển thị ở đây
        console.log("Mongoose Save Error:", error); 
        res.json({ success: false, message: "Error during status update" });
    }
}
export { placeOrder, verifyOrder ,userOrders,listOrders,updateStatus }