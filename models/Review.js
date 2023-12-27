const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "rating must be set"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "must set title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "must set comment body"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.ratingChange = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: result[0]?.averageRating || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.ratingChange(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.ratingChange(this.product);
});

module.exports = {
  Review: mongoose.model("Review", ReviewSchema),
};
