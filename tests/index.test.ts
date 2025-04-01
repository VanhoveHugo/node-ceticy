describe("index.ts", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  it("should listen on default port when process.env.PORT is undefined", () => {
    delete process.env.PORT;
    const listenMock = jest.fn();

    jest.doMock("@/app", () => ({
      app: { listen: listenMock },
    }));

    require("@/index");
    expect(listenMock).toHaveBeenCalledWith(3000);
  });

  it("should listen on custom port when process.env.PORT is set", () => {
    process.env.PORT = "8888";

    const listenMock = jest.fn();

    jest.doMock("@/app", () => ({
      app: { listen: listenMock },
    }));

    require("@/index");

    expect(listenMock).toHaveBeenCalledWith(8888);
  });
});
