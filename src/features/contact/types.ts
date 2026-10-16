export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactResult =
  | { ok: true; id: string }
  | { ok: false; error: string; details?: Record<string, string[]> };