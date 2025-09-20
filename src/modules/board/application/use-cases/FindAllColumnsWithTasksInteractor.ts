import { BoardGateway } from "../../domain/ports/BoardGateway";
import { ColumWithTasksResponseModel } from "../dtos/ColumWithTasksResponseModel";

export class FindAllColumnsWithTasksInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(
        userId: string
    ): Promise<ColumWithTasksResponseModel[]> {
        return await this.boardGateway.findAllColumnsWithTasks(userId);
    }
}
