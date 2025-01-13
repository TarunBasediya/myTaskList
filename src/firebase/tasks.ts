import { db } from "../firebaseConfig.ts";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Task } from "../redux/taskSlice.ts";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../redux/taskSlice.ts";

// Collection Reference
const tasksCollection = collection(db, "tasks");

// Create a Task
export const createTask = async (task: Task, dispatch: any) => {
  try {
    const { id, ...taskData } = task; // Exclude `id`
    const docRef = await addDoc(tasksCollection, {
      ...taskData,
      status: "ToDo", // Default status to "ToDo"
    });
    dispatch(addTask({ ...task, id: docRef.id, status: "ToDo" })); // Add generated ID and default status
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

// Fetch Tasks
export const fetchTasks = async (dispatch: any) => {
  try {
    const querySnapshot = await getDocs(tasksCollection);
    const tasks: Task[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include Firestore-generated ID
      ...doc.data(),
    })) as Task[];
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
};

// Update a Task
export const updateTaskInFirestore = async (task: Task, dispatch: any) => {
  try {
    if (!task.id) throw new Error("Task ID is required for updates");
    const taskDoc = doc(db, "tasks", task.id);
    await updateDoc(taskDoc, task); // Update the task including status
    dispatch(updateTask(task));
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

// Delete a Task
export const deleteTaskFromFirestore = async (
  taskId: string,
  dispatch: any
) => {
  try {
    if (!taskId) throw new Error("Task ID is required for deletion");
    const taskDoc = doc(db, "tasks", taskId);
    await deleteDoc(taskDoc);
    dispatch(deleteTask(taskId));
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};
