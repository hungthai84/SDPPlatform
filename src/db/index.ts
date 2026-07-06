/* eslint-disable @typescript-eslint/no-explicit-any */
// Database connection is disabled as requested by the user.
// Mock database interface to prevent crashes while maintaining the expected API structure.
const mockDbCall = {
    from: () => mockDbCall,
    where: () => mockDbCall,
    orderBy: () => mockDbCall,
    limit: () => mockDbCall,
    insert: () => mockDbCall,
    update: () => mockDbCall,
    set: () => mockDbCall,
    values: () => mockDbCall,
    onConflictDoUpdate: () => mockDbCall,
    returning: () => Promise.resolve([]),
    then: (resolve: any) => resolve([]),
};

export const db = {
    select: () => mockDbCall,
    insert: () => mockDbCall,
    update: () => mockDbCall,
} as any;
