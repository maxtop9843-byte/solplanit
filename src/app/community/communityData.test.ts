import { describe, expect, it } from "vitest";
import {
  communityCategories,
  communityCategoryIds,
  communityPosts,
  getCommunityCategory,
  getPostsByCategory,
} from "./communityData";

describe("community data", () => {
  it("keeps category identifiers unique and complete", () => {
    expect(new Set(communityCategoryIds).size).toBe(5);
    expect(communityCategories.map((category) => category.id)).toEqual(communityCategoryIds);
  });

  it("links every example post to a valid category", () => {
    for (const post of communityPosts) {
      expect(getCommunityCategory(post.categoryId)).toBeDefined();
      expect(post.isExample).toBe(true);
      expect(post.title.length).toBeGreaterThan(5);
      expect(post.summary.length).toBeGreaterThan(10);
      expect(post.answerCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("filters posts without mutating the source collection", () => {
    const originalLength = communityPosts.length;
    const quotePosts = getPostsByCategory("quote-review");

    expect(quotePosts).toHaveLength(1);
    expect(quotePosts[0]?.categoryId).toBe("quote-review");
    expect(getPostsByCategory("all")).toHaveLength(originalLength);
    expect(communityPosts).toHaveLength(originalLength);
  });

  it("keeps structured numeric values positive when supplied", () => {
    for (const post of communityPosts) {
      if (post.capacityKw !== undefined) expect(post.capacityKw).toBeGreaterThan(0);
      if (post.annualGenerationKwh !== undefined) {
        expect(post.annualGenerationKwh).toBeGreaterThan(0);
      }
    }
  });
});
