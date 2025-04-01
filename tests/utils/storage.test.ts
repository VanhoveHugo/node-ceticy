import upload from "@/utils/storage";

describe("multer upload config", () => {
  describe("fileFilter", () => {
    const { fileFilter } = (upload as any);

    const mockFile = (name: string, mimetype: string) => ({
      originalname: name,
      mimetype,
    });

    it("should accept valid .jpg file", (done) => {
      const file = mockFile("image.jpg", "image/jpeg");

      fileFilter({}, file, (err: Error | null, accept: boolean) => {
        expect(err).toBeNull();
        expect(accept).toBe(true);
        done();
      });
    });

    it("should accept valid .png file", (done) => {
      const file = mockFile("photo.png", "image/png");

      fileFilter({}, file, (err: Error | null, accept: boolean) => {
        expect(err).toBeNull();
        expect(accept).toBe(true);
        done();
      });
    });

    it("should reject .txt file with error", (done) => {
      const file = mockFile("file.txt", "text/plain");

      fileFilter({}, file, (err: Error | null) => {
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toContain("n'est pas un fichier image valide");
        done();
      });
    });

    it("should reject file with wrong extension", (done) => {
      const file = mockFile("image.gif", "image/gif");

      fileFilter({}, file, (err: Error | null) => {
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toMatch(/n'est pas un fichier image valide/);
        done();
      });
    });
  });

  describe("storage params", () => {
    const { params } = (upload as any).storage;

    it("should set folder and public_id correctly", async () => {
      const req = {};
      const file = { originalname: "test.jpg" };

      const result = await params(req, file);

      expect(result.folder).toBe(process.env.NODE_ENV);
      expect(result.public_id).toMatch(/^\d+-test\.jpg$/);
    });

    it("should set transformation correctly", async () => {
      const req = {};
      const file = { originalname: "test.jpg" };

      const result = await params(req, file);

      expect(result.transformation).toEqual([
        {
          width: 600,
          height: 800,
          crop: "fill",
          quality: "auto",
        },
      ]);
    });
  });
});
