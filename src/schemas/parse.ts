import { z } from "zod"

export const parseOrThrow = <T>(schema: z.ZodType<T>, data: unknown, context: string): T => {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error(`[${context}] schema validation failed`, result.error.issues)
    throw new Error(`Unexpected response from ${context}`)
  }
  return result.data
}
