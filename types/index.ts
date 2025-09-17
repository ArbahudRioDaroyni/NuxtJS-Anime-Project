// Main Types Export
// This file centralizes all type exports for easy importing

// Primary exports - most commonly used types
// export * from './database'

// Optional: Export specific modules only when needed
// Uncomment these lines if you need direct access to these modules:
// export * from './type'
// export * from './anime'
// export * from './metadata' 
// export * from './relations'

// Legacy exports for backward compatibility
export type { AnimeDetails, AnimeCreateInput } from './anime'
export type { ResponseType, QueryType } from './database'

