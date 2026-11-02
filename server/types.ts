declare global {
  namespace Express {
    interface User {
      name?: string;
      email?: string;
    }

    interface Request {
      admin?: {
        userId: number;
        email: string;
        role: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};
