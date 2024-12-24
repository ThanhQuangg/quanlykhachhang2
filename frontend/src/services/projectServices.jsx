import axios from "axios";
import environments from "../constant/environment";

const API_BASE_URL = environments.apiBaseUrl;

// Project APIs
export const getAllProjects = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        return response.data;  // Return the list of projects
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Không thể tải danh sách dự án.");
    }
};

export const getPaginatedProjects = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/projects/paginated`, {
        params: { page, size },
    });
    return response.data; 
};

export const searchProjects = async ({ customerId, userId, projectTypeId, projectName, status, startDate, endDate, minAmount, maxAmount }) => {
    const response = await axios.get(`${API_BASE_URL}/projects/search`, {
        params: {
            customerId,
            userId, 
            projectTypeId,
            projectName,
            status,
            startDate,
            endDate,
            minAmount,
            maxAmount
        },
    });
    return response.data;
};


export const getProjectById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        return response.data;  // Return the data from the response
    } catch (error) {
        console.error(`Error fetching project with ID ${id}:`, error);
        throw new Error("Không thể tải thông tin dự án.");
    }
};

export const createProject = async (project) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/projects`, project);
        return response.data;  // Return the created project data
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Không thể tạo dự án.");
    }
};

export const updateProject = async (id, project) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/projects/${id}`, project);
        return response.data;  // Return the updated project data
    } catch (error) {
        console.error(`Error updating project with ID ${id}:`, error);
        throw new Error("Không thể cập nhật dự án.");
    }
};

export const deleteProject = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/projects/${id}`);
    } catch (error) {
        console.error(`Error deleting project with ID ${id}:`, error);
        throw new Error("Không thể xóa dự án.");
    }
};

// Project Type APIs
export const getAllProjectTypes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/project-types`);
        return response.data;  // Return the list of project types
    } catch (error) {
        console.error("Error fetching project types:", error);
        throw new Error("Không thể tải danh sách loại dự án.");
    }
};

export const getProjectTypeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/project-types/${id}`);
        return response.data;  // Return the project type details
    } catch (error) {
        console.error(`Error fetching project type with ID ${id}:`, error);
        throw new Error("Không thể tải thông tin loại dự án.");
    }
};

export const createProjectType = async (projectType) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/project-types`, projectType);
        return response.data;  // Return the created project type data
    } catch (error) {
        console.error("Error creating project type:", error);
        throw new Error("Không thể tạo loại dự án.");
    }
};

export const updateProjectType = async (id, projectType) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/project-types/${id}`, projectType);
        return response.data;  // Return the updated project type data
    } catch (error) {
        console.error(`Error updating project type with ID ${id}:`, error);
        throw new Error("Không thể cập nhật loại dự án.");
    }
};

export const deleteProjectType = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/project-types/${id}`);
    } catch (error) {
        console.error(`Error deleting project type with ID ${id}:`, error);
        throw new Error("Không thể xóa loại dự án.");
    }
};
