import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { InterviewContext } from "../interview.context";
import { 
  getAllInterviewReports, 
  generateInterviewReport, 
  getInterviewReportById, 
  updateRoadmapTask,
  generateResumePdf 
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      const createdReport = response?.interviewReport || response;
      setReport(createdReport);
      return createdReport;
    } catch (error) {
      console.error("Failed to generate report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (id) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(id);
      const fetchedReport = response?.interviewReport || response;
      setReport(fetchedReport);
      return fetchedReport;
    } catch (error) {
      console.error("Failed to fetch report by ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      const list = response?.interviewReports || response || [];
      setReports(list);
      return list;
    } catch (error) {
      console.error("Failed to fetch all reports:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleRoadmapTask = async ({ interviewId, dayIndex, taskIndex, completed }) => {
    const response = await updateRoadmapTask({ interviewId, dayIndex, taskIndex, completed });
    const updatedReport = response?.interviewReport || response;
    setReport(updatedReport);
    setReports((currentReports) => currentReports.map((item) => item._id === updatedReport._id ? updatedReport : item));
    return updatedReport;
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `optimized_resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  return { 
    loading, 
    report, 
    reports, 
    generateReport, 
    getReportById, 
    getReports, 
    toggleRoadmapTask,
    getResumePdf 
  };
};