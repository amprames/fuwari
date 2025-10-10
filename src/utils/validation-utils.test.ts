import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("validation-utils", () => {
  describe("basic zod validation", () => {
    it("should validate string correctly", () => {
      const schema = z.string();
      const result = schema.safeParse("hello");
      expect(result.success).toBe(true);
    });

    it("should reject invalid string", () => {
      const schema = z.string();
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
    });

    it("should validate email format", () => {
      const schema = z.string().email();
      const validEmail = schema.safeParse("test@example.com");
      const invalidEmail = schema.safeParse("invalid-email");
      
      expect(validEmail.success).toBe(true);
      expect(invalidEmail.success).toBe(false);
    });

    it("should validate object schema", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      
      const validData = schema.safeParse({ name: "John", age: 30 });
      const invalidData = schema.safeParse({ name: "John" });
      
      expect(validData.success).toBe(true);
      expect(invalidData.success).toBe(false);
    });

    it("should validate array schema", () => {
      const schema = z.array(z.string());
      
      const validArray = schema.safeParse(["a", "b", "c"]);
      const invalidArray = schema.safeParse([1, 2, 3]);
      
      expect(validArray.success).toBe(true);
      expect(invalidArray.success).toBe(false);
    });
  });
});