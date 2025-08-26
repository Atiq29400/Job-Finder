import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getJobs } from "./api";
import AddEditJob from "./components/AddEditJob";
import FilterSortJob from "./components/FilterSortJob";
import ListJob from "./components/ListJob";

const App: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const data = await getJobs(filters, sort);
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, sort]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => navigate("/")}>Job Listings</h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                onClick={() => navigate("/add")}
              >
                Add New Job
              </button>

              <FilterSortJob
                onFilterChange={setFilters}
                onSortChange={setSort}
              />

              <ListJob
                jobs={jobs}
                onEdit={(job) => {
                  setSelectedJob(job);
                  navigate("/add");
                }}
                onDelete={fetchJobs}
              />
            </>
          }
        />

        <Route
          path="/add"
          element={
            <AddEditJob
              job={selectedJob}
              onSuccess={() => {
                fetchJobs();
                navigate("/");
              }}
              onClose={() => navigate("/")}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
