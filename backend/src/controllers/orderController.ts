import { Request, Response } from 'express';
import Order from '../models/Order';
import { OrderItem } from '../models/Order';
import { IProduct } from '../models/Product';

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orderList = await Order.find()
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category'
        }
      })
      .sort({ dateOrdered: -1 });

    if (!orderList) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.send(orderList);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get a single order by ID
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category'
        }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.send(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Create order items first
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem: any) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product
        });

        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id;
      })
    );

    // Calculate total price
    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate<{ product: IProduct }>('product');
        if (!orderItem) return 0;
        
        // The product should now be properly typed as IProduct
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    // Create the order
    const order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user
    });

    const savedOrder = await order.save();

    if (!savedOrder) {
      return res.status(400).json({ message: 'The order cannot be created' });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete associated order items
    await Promise.all(
      order.orderItems.map(async (orderItemId) => {
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    );

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(500).json({ message: 'The order cannot be deleted' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get total sales
export const getTotalSales = async (_req: Request, res: Response) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);

    if (!totalSales || totalSales.length === 0) {
      return res.status(400).json({ message: 'No sales data found' });
    }

    res.status(200).json({ totalSales: totalSales[0].totalSales });
  } catch (error) {
    console.error('Get total sales error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get order count
export const getOrdersCount = async (_req: Request, res: Response) => {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).json({ count: orderCount });
  } catch (error) {
    console.error('Get order count error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userId })
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category'
        }
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(userOrderList);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 