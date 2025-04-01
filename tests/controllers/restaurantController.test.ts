import {
  getListOfRestaurants,
  getRestaurantById,
  getRestaurantsByManagerId,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  handleRestaurantSwipe,
  getLikeRestaurants,
  addFavoriteRestaurant,
  deleteFavoriteRestaurant,
  getFavoriteRestaurants,
} from "@/controllers/restaurantController";

import * as restaurantService from "@/services/restaurantService";
import * as photoService from "@/services/photoService";
import * as favoriteService from "@/services/favoriteService";
import { ERROR_MESSAGES } from "@/utils/errorMessages";

jest.mock("@/services/restaurantService");
jest.mock("@/services/photoService");
jest.mock("@/services/favoriteService");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("restaurantController", () => {
  const user = { id: 1, manager: false };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getListOfRestaurants → 200", async () => {
    (restaurantService.restaurantServiceGetList as jest.Mock).mockResolvedValue(
      ["r"]
    );
    const res = mockRes();
    await getListOfRestaurants({ user } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getListOfRestaurants → 400 if no user", async () => {
    const res = mockRes();
    await getListOfRestaurants({} as any, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getRestaurantById → 200", async () => {
    (restaurantService.restaurantServiceGetById as jest.Mock).mockResolvedValue(
      { id: 1 }
    );
    const res = mockRes();
    await getRestaurantById({ user, params: { id: "1" } } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getRestaurantsByManagerId → 200", async () => {
    (
      restaurantService.restaurantServiceGetByManagerId as jest.Mock
    ).mockResolvedValue(["r"]);
    const res = mockRes();
    await getRestaurantsByManagerId({ user } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("addRestaurant → 201 with photo", async () => {
    (restaurantService.restaurantServiceCreate as jest.Mock).mockResolvedValue(
      1
    );
    (photoService.photoServiceCreate as jest.Mock).mockResolvedValue(1);
    const res = mockRes();
    await addRestaurant(
      { user, body: { name: "A" }, file: { path: "p" } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("addRestaurant → 500 if create fails", async () => {
    (restaurantService.restaurantServiceCreate as jest.Mock).mockResolvedValue(
      undefined
    );
    const res = mockRes();
    await addRestaurant({ user, body: { name: "A" } } as any, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateRestaurant / deleteRestaurant → 400 notImplemented", () => {
    const res = mockRes();
    updateRestaurant({} as any, res);
    deleteRestaurant({} as any, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handleRestaurantSwipe → 201", async () => {
    (
      restaurantService.restaurantServiceHandleSwipe as jest.Mock
    ).mockResolvedValue("ok");
    const res = mockRes();
    await handleRestaurantSwipe(
      {
        user,
        body: { restaurantId: 1, action: "like" },
      } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getLikeRestaurants → 200", async () => {
    (restaurantService.restaurantServiceGetLike as jest.Mock).mockResolvedValue(
      ["r"]
    );
    const res = mockRes();
    await getLikeRestaurants({ user } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("addFavoriteRestaurant → 201", async () => {
    (favoriteService.favoriteServiceGetOne as jest.Mock).mockResolvedValue(
      null
    );
    (favoriteService.favoriteServiceCreate as jest.Mock).mockResolvedValue(
      "ok"
    );
    const res = mockRes();
    await addFavoriteRestaurant(
      { user, body: { restaurantId: 1 } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("deleteFavoriteRestaurant → 200", async () => {
    (favoriteService.favoriteServiceDelete as jest.Mock).mockResolvedValue({
      affectedRows: 1,
    });
    const res = mockRes();
    await deleteFavoriteRestaurant(
      { user, body: { restaurantId: 1 } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getFavoriteRestaurants → 200", async () => {
    (favoriteService.favoriteServiceGet as jest.Mock).mockResolvedValue([
      "fav",
    ]);
    const res = mockRes();
    await getFavoriteRestaurants({ user } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // Error & edge cases
  it("addFavoriteRestaurant → 400 if already exists", async () => {
    (favoriteService.favoriteServiceGetOne as jest.Mock).mockResolvedValue(
      true
    );
    const res = mockRes();
    await addFavoriteRestaurant(
      { user, body: { restaurantId: 1 } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteFavoriteRestaurant → 404 if not found", async () => {
    (favoriteService.favoriteServiceDelete as jest.Mock).mockResolvedValue({
      affectedRows: 0,
    });
    const res = mockRes();
    await deleteFavoriteRestaurant(
      { user, body: { restaurantId: 1 } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handleRestaurantSwipe → 400 if missing action", async () => {
    const res = mockRes();
    await handleRestaurantSwipe(
      { user, body: { restaurantId: 1 } } as any,
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getListOfRestaurants → 500 on error", async () => {
    (restaurantService.restaurantServiceGetList as jest.Mock).mockRejectedValue(
      new Error()
    );
    const res = mockRes();
    await getListOfRestaurants({ user } as any, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
