const express = require("express");
const router = express.Router();

// Predefined event categories
const eventCategories = [
  {
    id: 1,
    name: "Music & Concerts",
    icon: "🎵",
    description: "Live music performances and concerts",
  },
  {
    id: 2,
    name: "Sports & Fitness",
    icon: "⚽",
    description: "Sports events and fitness activities",
  },
  {
    id: 3,
    name: "Technology & Innovation",
    icon: "💻",
    description: "Tech conferences and innovation events",
  },
  {
    id: 4,
    name: "Business & Networking",
    icon: "💼",
    description: "Business meetings and networking events",
  },
  {
    id: 5,
    name: "Arts & Culture",
    icon: "🎨",
    description: "Art exhibitions and cultural events",
  },
  {
    id: 6,
    name: "Food & Drink",
    icon: "🍕",
    description: "Food festivals and culinary events",
  },
  {
    id: 7,
    name: "Education & Workshops",
    icon: "📚",
    description: "Educational seminars and workshops",
  },
  {
    id: 8,
    name: "Entertainment & Shows",
    icon: "🎭",
    description: "Theater shows and entertainment events",
  },
  {
    id: 9,
    name: "Health & Wellness",
    icon: "🧘",
    description: "Health and wellness events",
  },
  {
    id: 10,
    name: "Community & Social",
    icon: "🤝",
    description: "Community gatherings and social events",
  },
];

// Get all categories
router.get("/", (req, res) => {
  res.json({
    status: "success",
    data: eventCategories,
  });
});

// Get category by ID
router.get("/:id", (req, res) => {
  const category = eventCategories.find(
    (cat) => cat.id === parseInt(req.params.id)
  );

  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "Category not found",
    });
  }

  res.json({
    status: "success",
    data: category,
  });
});

module.exports = router;
