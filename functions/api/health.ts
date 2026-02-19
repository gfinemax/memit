export const onRequestGet = async (): Promise<Response> => {
  return Response.json({
    ok: true,
    service: "memit-ai-functions",
  });
};
