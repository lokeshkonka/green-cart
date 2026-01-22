import User from "../Models/User.js";

// Update user cart: POST /api/cart/update
export const updateCart = async (req, res) => {
  try {
    // ✅ user comes from authUser middleware
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const { cartItems } = req.body;

    // ✅ validate cartItems
    if (!cartItems || typeof cartItems !== "object") {
      return res.status(400).json({
        success: false,
        message: "cartItems must be a valid object",
      });
    }

    // ✅ update directly (no extra fetch + save needed)
    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "Cart updated successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Cart Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};
