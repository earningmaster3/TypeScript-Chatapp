export interface TestRequestBody {
  fullName: string;
  email: string;
  password: string;
  profilePic: string;
}

export interface TestRequestMsg {
  text ?: string | null;
  image?: string | null;
}