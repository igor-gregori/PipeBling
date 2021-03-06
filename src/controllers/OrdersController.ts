import { Request, Response } from "express";
import { AppError } from "../errors/AppErrors";
import { OrderRepository } from "../repositories/OrdersRepository";
import { DealsService } from "../services/DealsService";
import { OrdersService } from "../services/OrdersService";

class OrdersController {
  private ordersService: OrdersService;
  private orderRepository: OrderRepository;
  private dealsService: DealsService;

  async createOrders(request: Request, response: Response) {
    this.ordersService = new OrdersService();
    this.orderRepository = new OrderRepository();
    this.dealsService = new DealsService();

    try {
      const todayOrdersExists = await this.orderRepository.todayOrdersExists();
      if (!todayOrdersExists) {
        const todayWonDeals = await this.dealsService.todayWonDeals();

        const responseOrders = await this.ordersService.create(todayWonDeals);

        const savedOrders = await this.orderRepository.saveTodayOrders(
          responseOrders
        );

        return response.status(201).json(savedOrders);
      } else {
        throw new AppError("Today's orders have already been consolidated !");
      }
    } catch (err) {
      throw new AppError(err.message);
    }
  }

  async getAll(request: Request, response: Response) {
    this.ordersService = new OrdersService();
    try {
      const responseOrders = await this.ordersService.getAll();
      return response.status(200).json(responseOrders);
    } catch (err) {
      throw new AppError(err.message);
    }
  }

  async getAllConsolidated(request: Request, response: Response) {
    this.orderRepository = new OrderRepository();

    try {
      const responseOrders = await this.orderRepository.getAll();

      return response.status(200).json(responseOrders);
    } catch (err) {
      throw new AppError(err.message);
    }
  }

  async getByDateConsolidated(request: Request, response: Response) {
    const { date } = request.params;

    this.orderRepository = new OrderRepository();

    try {
      if (String(date).length != 10 || String(date)[4] != "-") {
        throw new Error(
          "Date with invalid format, follow the 'YYYY-MM-DD' template !"
        );
      }

      const responseOrders = await this.orderRepository.getByDate(date);

      return response.status(200).json(responseOrders);
    } catch (err) {
      throw new AppError(err.message);
    }
  }
}

export { OrdersController };