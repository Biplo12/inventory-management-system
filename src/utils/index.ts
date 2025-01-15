type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export const generateTimestamps = (): Timestamps => {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const generateObjectId = (
  m = Math,
  d = Date,
  h = 16,
  s = (s: number) => m.floor(s).toString(h)
) => s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));
