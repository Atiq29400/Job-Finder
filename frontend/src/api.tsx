import axios from "axios";

// Configure axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getJobs = async (filters?: any, sort?: string) => {
  const params: any = {};

  // Map frontend filter names to backend parameter names
  if (filters) {
    if (filters.title) params.title = filters.title; // Add this line
    if (filters.location) params.location = filters.location;
    if (filters.tags) params.tag = filters.tags;
    if (filters.jobType && filters.jobType !== "all") {
      params.job_type = filters.jobType;
    }
  }

  // Map frontend sort values to backend sort values
  if (sort) {
    if (sort === "date_desc") params.sort = "posting_date_desc";
    else if (sort === "date_asc") params.sort = "posting_date_asc";
  }

  console.log("API params being sent:", params); // Debug log

  const response = await apiClient.get("/api/jobs/", { params });
  return response.data;
};

export const addJob = async (job: any) => {
  const payload = {
    title: job.title,
    company: job.company,
    location: job.location,
    job_type: job.jobType, // Convert camelCase to snake_case
    tags: Array.isArray(job.tags) ? job.tags.join(",") : job.tags,
  };

  const response = await apiClient.post("/api/jobs/", payload);
  return response.data;
};

export const updateJob = async (id: number, job: any) => {
  const response = await apiClient.put(`/api/jobs/${id}`, job);
  return response.data;
};

export const deleteJob = async (id: number) => {
  const response = await apiClient.delete(`/api/jobs/${id}`);
  return response.data;
};
