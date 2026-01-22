import Address from "../Models/Address.js";

// ADD ADDRESS — POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    // ✅ user comes from authUser middleware
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const { address } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address data is required" });
    }

    await Address.create({
      ...address,
      userId,
    });

    res.json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Error in addAddress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

// GET ADDRESS — GET /api/address/get
export const getAddress = async (req, res) => {
  try {
    // ✅ user comes from authUser middleware
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error in getAddress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};
