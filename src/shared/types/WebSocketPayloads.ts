import { TaskResponseModel } from "../../modules/board/application/dtos/TaskResponseModel";

export type WebSocketPayloads = {
    DISCIPLINE_TASK_CREATED: TaskResponseModel & {
        disciplineId: string;
        disciplineName: string;
    };
};
