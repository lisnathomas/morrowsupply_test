// Expected total number of products on the products page
export const TOTAL_PRODUCTS = 12;

// Category filter options and the number of products expected in each
export const categories = [
  { id: "TC-P02", name: "Apparel", count: 5 },
  { id: "TC-P03", name: "Accessories", count: 4 },
  { id: "TC-P04", name: "Gear", count: 2 },
  { id: "TC-P05", name: "Books", count: 1 },
  { id: "TC-P06", name: "All categories", count: 12 },
];

// Sort options: what to sort by (name or price) and in which order
export const sortOptions = [
  { id: "TC-P07", option: "Name: A to Z", by: "name", order: "asc" },
  { id: "TC-P08", option: "Name: Z to A", by: "name", order: "desc" },
  { id: "TC-P09", option: "Price: Low to High", by: "price", order: "asc" },
  { id: "TC-P10", option: "Price: High to Low", by: "price", order: "desc" },
];
