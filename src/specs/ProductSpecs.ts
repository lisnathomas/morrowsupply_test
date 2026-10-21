import { expect } from "@wdio/globals";
import ProductPage from "../pages/ProductPage";
import { loginAsStandardUser } from "../utils/helpers";
import { categories, TOTAL_PRODUCTS, sortOptions } from "../data/products";

describe("Product Tests", () => {
  beforeEach(async () => {
    await loginAsStandardUser();
  });

  // ---------- Step 2: Product count ----------

  it("TC-P01: displays the total count of items", async () => {
    const count = await ProductPage.getItemCount();
    expect(count).toBe(TOTAL_PRODUCTS);

    // Number of cards on the page should match the total
    await expect(ProductPage.productCards).toBeElementsArrayOfSize(TOTAL_PRODUCTS);
  });

  // ---------- Step 2: Filter by category ----------

  // TC-P02 to TC-P06: one filter test per category in products.ts
  for (const category of categories) {
    it(`${category.id}: filter by ${category.name} shows ${category.count} items`, async () => {
      await ProductPage.filterByCategory(category.name);

      // Number of cards should match the expected count for this category
      await expect(ProductPage.productCards).toBeElementsArrayOfSize(category.count);

      const count = await ProductPage.getItemCount();
      expect(count).toBe(category.count);
    });
  }

  // ---------- Step 2: Sort ----------

  // TC-P07 to TC-P10: one sort test per sort option in products.ts
  // TC-P10 currently fails: "Price: High to Low" sorts ascending (Bug #2)
  for (const sort of sortOptions) {
    it(`${sort.id}: sort by ${sort.option}`, async () => {
      await ProductPage.sortBy(sort.option);

      //Compare the page order with a correctly sorted copy of the same list
      if (sort.by === "name") {
        const actual = await ProductPage.getProductNames();
        const expected = [...actual].sort((a, b) => a.localeCompare(b)); //localeCompare get rid of ASCII disparities with alphabets
        if (sort.order === "desc") expected.reverse();
        expect(actual).toEqual(expected);
      } else {
        const actual = await ProductPage.getProductPrices();
        const expected = [...actual].sort((a, b) => a - b);
        if (sort.order === "desc") expected.reverse();
        expect(actual).toEqual(expected);
      }
    });
  }
});


