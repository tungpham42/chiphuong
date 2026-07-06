// src/services/api.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Job } from "../types/Job";

const jobsCollection = collection(db, "jobs");

// Read (Đã có)
export const fetchJobs = async (): Promise<Job[]> => {
  const jobSnapshot = await getDocs(jobsCollection);
  return jobSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Job,
  );
};

// Create
export const createJob = async (jobData: Omit<Job, "id">) => {
  const docRef = await addDoc(jobsCollection, jobData);
  return docRef.id;
};

// Update
export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const jobRef = doc(db, "jobs", id);
  await updateDoc(jobRef, jobData);
};

// Delete
export const deleteJob = async (id: string) => {
  const jobRef = doc(db, "jobs", id);
  await deleteDoc(jobRef);
};
