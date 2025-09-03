const express = require("express");
const { protect, restrictTo } = require("./auth");

const router = express.Router();

// In-memory storage for marketing campaigns (in production, use database)
let marketingCampaigns = [];

// Get all marketing campaigns
router.get("/campaigns", (req, res) => {
  try {
    const activeCampaigns = marketingCampaigns.filter(
      (campaign) => campaign.status === "active"
    );

    res.json({
      status: "success",
      data: activeCampaigns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create marketing campaign (admin only)
router.post("/campaigns", protect, restrictTo("admin"), (req, res) => {
  try {
    const {
      name,
      description,
      targetAudience,
      startDate,
      endDate,
      discount,
      conditions,
    } = req.body;

    if (!name || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCampaign = {
      id: `CAMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      targetAudience: targetAudience || "all",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      discount: discount || 0,
      conditions: conditions || [],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    marketingCampaigns.push(newCampaign);

    res.status(201).json({
      status: "success",
      message: "Marketing campaign created successfully",
      data: newCampaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update marketing campaign (admin only)
router.put("/campaigns/:id", protect, restrictTo("admin"), (req, res) => {
  try {
    const campaign = marketingCampaigns.find((c) => c.id === req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    Object.assign(campaign, req.body, { updatedAt: new Date() });

    res.json({
      status: "success",
      message: "Campaign updated successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete marketing campaign (admin only)
router.delete("/campaigns/:id", protect, restrictTo("admin"), (req, res) => {
  try {
    const campaignIndex = marketingCampaigns.findIndex(
      (c) => c.id === req.params.id
    );

    if (campaignIndex === -1) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    marketingCampaigns.splice(campaignIndex, 1);

    res.json({
      status: "success",
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign analytics (admin only)
router.get(
  "/campaigns/:id/analytics",
  protect,
  restrictTo("admin"),
  (req, res) => {
    try {
      const campaign = marketingCampaigns.find((c) => c.id === req.params.id);

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Mock analytics data (in production, calculate from actual usage)
      const analytics = {
        campaignId: campaign.id,
        campaignName: campaign.name,
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 1000) + 100,
        conversions: Math.floor(Math.random() * 100) + 10,
        revenue: Math.floor(Math.random() * 5000) + 500,
        ctr: Math.random() * 10 + 1, // Click-through rate
        conversionRate: Math.random() * 5 + 0.5,
      };

      res.json({
        status: "success",
        data: analytics,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get promotional codes
router.get("/promo-codes", (req, res) => {
  try {
    const activePromoCodes = [
      {
        id: "WELCOME10",
        discount: 10,
        description: "Welcome discount for new users",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        minPurchase: 50,
      },
      {
        id: "SUMMER20",
        discount: 20,
        description: "Summer sale discount",
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        minPurchase: 100,
      },
    ];

    res.json({
      status: "success",
      data: activePromoCodes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate promotional code
router.post("/validate-promo", protect, (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Promo code is required" });
    }

    const promoCode = [
      {
        id: "WELCOME10",
        discount: 10,
        description: "Welcome discount for new users",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minPurchase: 50,
      },
      {
        id: "SUMMER20",
        discount: 20,
        description: "Summer sale discount",
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        minPurchase: 100,
      },
    ].find((p) => p.id === code);

    if (!promoCode) {
      return res.status(404).json({ message: "Invalid promo code" });
    }

    if (new Date() > promoCode.validUntil) {
      return res.status(400).json({ message: "Promo code has expired" });
    }

    res.json({
      status: "success",
      message: "Promo code is valid",
      data: promoCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
