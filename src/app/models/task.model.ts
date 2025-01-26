export interface Task {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    completed: boolean;
    userId: string; // Para identificar a que usuario pertenece la tarea
  }