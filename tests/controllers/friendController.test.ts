import {
  getFriends,
  addFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  deleteFriendRequest,
} from "@/controllers/friendController";

import * as customerService from "@/services/customerService";
import * as friendService from "@/services/friendService";
import { ERROR_MESSAGES } from "@/utils/errorMessages";

jest.mock("@/services/customerService");
jest.mock("@/services/friendService");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("friendController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFriends", () => {
    it("should return 400 if no user", async () => {
      const res = mockRes();
      await getFriends({ user: undefined } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if manager", async () => {
      const res = mockRes();
      await getFriends({ user: { id: 1, manager: true } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 if service fails", async () => {
      (friendService.friendServiceGetAll as jest.Mock).mockResolvedValue(
        undefined
      );
      const res = mockRes();
      await getFriends({ user: { id: 1, manager: false } } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 201 with friend list", async () => {
      (friendService.friendServiceGetAll as jest.Mock).mockResolvedValue([
        "friend",
      ]);
      const res = mockRes();
      await getFriends({ user: { id: 1, manager: false } } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(["friend"]);
    });
  });

  describe("getFriendRequests / update / delete", () => {
    const res = mockRes();
    it("should return 400 not implemented", () => {
      getFriendRequests({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);

      updateFriendRequest({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);

      deleteFriendRequest({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("addFriendRequest", () => {
    const validUser = { id: 1, manager: false };

    it("should return 400 if manager", async () => {
      const res = mockRes();
      await addFriendRequest(
        { user: { id: 1, manager: true }, body: {} } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if adding yourself", async () => {
      (
        customerService.customerServiceFindByEmail as jest.Mock
      ).mockResolvedValue([{ id: 1 }]);
      const res = mockRes();
      await addFriendRequest(
        { user: validUser, body: { email: "self@mail.com" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if request already exists", async () => {
      (
        customerService.customerServiceFindByEmail as jest.Mock
      ).mockResolvedValue([{ id: 2 }]);
      (friendService.friendServiceFindByIds as jest.Mock).mockResolvedValueOnce(
        true
      );
      const res = mockRes();
      await addFriendRequest(
        { user: validUser, body: { email: "exists@mail.com" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should accept request if reverse exists", async () => {
      (
        customerService.customerServiceFindByEmail as jest.Mock
      ).mockResolvedValue([{ id: 2 }]);
      (friendService.friendServiceFindByIds as jest.Mock)
        .mockResolvedValueOnce(null) // first check
        .mockResolvedValueOnce([{ id: 99 }]); // reverse exists
      (friendService.friendServiceHandleStatus as jest.Mock).mockResolvedValue(
        "accepted"
      );
      const res = mockRes();
      await addFriendRequest(
        { user: validUser, body: { email: "reverse@mail.com" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith("accepted");
    });

    it("should return 201 if friend request created", async () => {
      (
        customerService.customerServiceFindByEmail as jest.Mock
      ).mockResolvedValue([{ id: 2 }]);
      (friendService.friendServiceFindByIds as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      (friendService.friendServiceCreate as jest.Mock).mockResolvedValue(
        "request"
      );
      const res = mockRes();
      await addFriendRequest(
        { user: validUser, body: { email: "new@mail.com" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith("request");
    });
  });
});
