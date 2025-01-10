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
