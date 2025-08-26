import React, { useState, useEffect } from "react";
import { addJob, updateJob } from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobFormProps {
  job?: any; // If editing, the job object
  onSuccess: () => void; // Callback after successful save
  onClose: () => void;   // Callback to close the form
}

const AddEditJob: React.FC<JobFormProps> = ({ job, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (job) {
      let tagsString = "";
      if (Array.isArray(job.tags)) {
        tagsString = job.tags.join(", ");
      } else if (typeof job.tags === "string") {
        tagsString = job.tags;
      }

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.job_type || job.jobType || "",
        tags: tagsString,
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleJobTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, jobType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location) {
      setError("Title, company, and location are required.");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        job_type: formData.jobType, // backend expects snake_case
        tags: formData.tags.split(",").map(t => t.trim()), // always array
      };

      if (job) {
        await updateJob(job.id, jobData);
      } else {
        await addJob(jobData);
      }

      setError("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            {job ? "Edit Job" : "Add New Job"}
          </h2>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <Select onValueChange={handleJobTypeChange} value={formData.jobType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="tags"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditJob;
