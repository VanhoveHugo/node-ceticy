describe("swaggerDocs", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should use development server", async () => {
    process.env.NODE_ENV = "development";
    const { swaggerDocs } = await import("@/utils/swagger");

    expect(swaggerDocs.servers?.[0]).toEqual({
      url: "http://localhost:3000",
      description: "Development",
    });
  });

  it("should use production server", async () => {
    process.env.NODE_ENV = "production";

    const { swaggerDocs } = await import("@/utils/swagger");

    expect(swaggerDocs.servers?.[0]).toEqual({
      url: "https://api.ceticy.fr",
      description: "Production",
    });
  });

  it("should set version from package.json", async () => {
    process.env.npm_package_version = "2.3.4";
    const { swaggerDocs } = await import("@/utils/swagger");

    expect(swaggerDocs.info.version).toBe("2.3.4");
  });

  it("should set default version if package.json version is not set", async () => {
    delete process.env.npm_package_version;
    const { swaggerDocs } = await import("@/utils/swagger");

    expect(swaggerDocs.info.version).toBe("1.0.0");
  });
});
