export interface JwtPayload {
    id: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
  }