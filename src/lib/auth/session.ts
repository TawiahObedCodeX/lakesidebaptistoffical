type User = {
    id: number;
    email: string;
    name: string;
  };
  
  // ✅ MUST be a named export
  export async function getSessionUser(): Promise<User | null> {
    // Temporary mock user (replace later with real auth)
    return {
      id: 1,
      email: "test@example.com",
      name: "Guest User",
    };
  
    // If you want strict auth:
    // return null;
  }