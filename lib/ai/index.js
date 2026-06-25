// Thin wrappers so future code can import from semantic paths.
// Today they delegate to the mock engine; later they call the LLM.
export { classifyMessage as classify } from './mock-engine'
export { generateReply } from './generateReply'
export { generateContent } from './mock-engine'
