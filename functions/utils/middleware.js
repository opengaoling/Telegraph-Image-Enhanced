export const errorHandling = async (context) => {
  const { next } = context;
  try {
    return await next();
  } catch (err) {
    return new Response(err.message || err.toString(), { status: 500 });
  }
};

export const telemetryData = async (context) => {
  return await context.next();
};
