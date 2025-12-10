import { TaskResponseModel } from "../../modules/board/application/dtos/TaskResponseModel";

export type WebSocketPayloads = {
    DISCIPLINE_TASK_CREATED: TaskResponseModel & {
        disciplineId: string;
        disciplineName: string;
    };
    DISCIPLINE_TASK_DELETED: {
        taskId: string;
        disciplineId: string;
        disciplineName: string;
        columnId: string;
        taskTitle: string;
    };
    DISCIPLINE_TASK_UPDATED: TaskResponseModel & {
        disciplineId: string;
        disciplineName: string;
        previousTitle: string;
    };
};
