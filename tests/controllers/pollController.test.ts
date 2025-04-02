import {
  getPolls,
  addPoll,
  updatePoll,
  deletePoll,
  deletePollParticipant,
  getPollById,
  addPollVote,
} from "@/controllers/pollController";

import * as pollService from "@/services/pollService";
import { ERROR_MESSAGES } from "@/utils/errorMessages";

jest.mock("@/services/pollService");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("pollController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = { id: 1, manager: false };

  describe("getPolls", () => {
    it("should return 400 if no user", async () => {
      const res = mockRes();
      await getPolls({ user: undefined } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if manager", async () => {
      const res = mockRes();
      await getPolls({ user: { ...user, manager: true } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 if service fails", async () => {
      (pollService.pollServiceGetAll as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();
      await getPolls({ user } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 201 with data", async () => {
      (pollService.pollServiceGetAll as jest.Mock).mockResolvedValue(["poll"]);
      const res = mockRes();
      await getPolls({ user } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(["poll"]);
    });

    it("should return 400 if service fails", async () => {
      (pollService.pollServiceGetAll as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();
      await getPolls({ user } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("addPoll", () => {
    it("should return 400 if name is missing", async () => {
      const res = mockRes();
      await addPoll({ user, body: {} } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 if poll creation fails", async () => {
      (pollService.pollServiceCreate as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();
      await addPoll({ user, body: { name: "Lunch" } } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 201 with pollId", async () => {
      (pollService.pollServiceCreate as jest.Mock).mockResolvedValue(123);
      (pollService.pollServiceRestaurantsAdd as jest.Mock).mockResolvedValue(
        true
      );
      const res = mockRes();
      await addPoll(
        {
          user,
          body: { name: "Lunch", friendsList: [2], restaurantsList: 99 },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(123);
    });

    it("should return 400 if user have 5 polls", async () => {
      (pollService.pollServiceCount as jest.Mock).mockResolvedValue(5);
      const res = mockRes();
      await addPoll({ user, body: { name: "Lunch" } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if pollId is missing", async () => {
      const res = mockRes();
      await addPoll(
        { user, body: { name: "Lunch", friendsList: [2] } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if friendsList is missing", async () => {
      const res = mockRes();
      await addPoll({ user, body: { name: "Lunch", pollId: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if restaurantsList is missing", async () => {
      const res = mockRes();
      await addPoll({ user, body: { name: "Lunch", pollId: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updatePoll", () => {
    it("should return 400 if pollId missing", async () => {
      const res = mockRes();
      await updatePoll({ user, body: { name: "New name" } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if name missing", async () => {
      const res = mockRes();
      await updatePoll({ user, body: { pollId: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 if update fails", async () => {
      (pollService.pollServiceUpdate as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();
      await updatePoll({ user, body: { pollId: 1, name: "New" } } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 200 if update succeeds", async () => {
      (pollService.pollServiceUpdate as jest.Mock).mockResolvedValue("done");
      const res = mockRes();
      await updatePoll({ user, body: { pollId: 1, name: "New" } } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deletePoll", () => {
    it("should return 400 if pollId is missing", async () => {
      const res = mockRes();
      await deletePoll({ user, body: {} } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 if service fails", async () => {
      (pollService.pollServiceDelete as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();
      await deletePoll({ user, body: { pollId: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 200 if deletion succeeds", async () => {
      (pollService.pollServiceDelete as jest.Mock).mockResolvedValue("deleted");
      const res = mockRes();
      await deletePoll({ user, body: { pollId: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getPollById", () => {
    it("should return 400 not implemented", async () => {
      const res = mockRes();
      await getPollById({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("addPollVote", () => {
    it("should return if vote success", async () => {
      (pollService.pollServiceVoteAdd as jest.Mock).mockResolvedValue(true);
      const res = mockRes();
      await addPollVote(
        {
          user,
          body: { pollId: 1, userId: 2, optionsList: 3, vote: true },
        } as any,
        res
      );
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("deletePollParticipant", () => {
    it("should return 400 if user.id === participantId", async () => {
      const res = mockRes();
      await deletePollParticipant(
        { user, body: { pollId: 1, participantId: 1 } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if pollId/participantId missing", async () => {
      const res = mockRes();
      await deletePollParticipant({ user, body: {} } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if removal fails", async () => {
      (pollService.pollServiceParticipantRemove as jest.Mock).mockResolvedValue(
        undefined
      );
      const res = mockRes();
      await deletePollParticipant(
        { user, body: { pollId: 1, participantId: 2 } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 200 if removal success", async () => {
      (pollService.pollServiceParticipantRemove as jest.Mock).mockResolvedValue(
        true
      );
      const res = mockRes();
      await deletePollParticipant(
        { user, body: { pollId: 1, participantId: 2 } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
