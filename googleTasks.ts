export { getAccessToken } from './firebase';

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed';
  updated: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated: string;
}

export const fetchTaskLists = async (token: string): Promise<GoogleTaskList[]> => {
  const response = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch task lists: ' + response.statusText);
  const data = await response.json();
  return data.items || [];
};

export const fetchTasks = async (token: string, listId: string): Promise<GoogleTask[]> => {
  const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?maxResults=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  const data = await response.json();
  return data.items || [];
};

export const updateTaskStatus = async (token: string, listId: string, taskId: string, completed: boolean): Promise<void> => {
    const status = completed ? 'completed' : 'needsAction';
    const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update task status');
};

export const createGoogleTask = async (token: string, listId: string, title: string, notes?: string, due?: string): Promise<GoogleTask> => {
    const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            title, 
            notes, 
            due: due ? `${due}T00:00:00Z` : undefined 
        })
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
};

export const deleteGoogleTask = async (token: string, listId: string, taskId: string): Promise<void> => {
    const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete task');
};
