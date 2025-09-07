import User from "../Models/User.js";

// Update user cart: POST /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Make sure cartItems is an object
    if (!cartItems || typeof cartItems !== "object") {
      return res.status(400).json({ success: false, message: "cartItems must be an object" });
    }

    // Find user and update cartItems
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.cartItems = cartItems;
    await user.save(); // Save changes

    return res.json({ success: true, message: "Cart updated successfully", cartItems: user.cartItems });
  } catch (error) {
    console.error("Cart Controller Update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
