import * as api from "../../services/projectServices";
import {getPaginatedProjects} from "../../services/projectServices"

export const fetchProjects = () => async (dispatch) => {
    try {
        const projects = await api.getAllProjects();
        dispatch({ type: "FETCH_PROJECTS_SUCCESS", payload: projects });
    } catch (error) {
        dispatch({ type: "PROJECT_ERROR", payload: error.message });
    }
};

export const fetchProjectById = (id) => async (dispatch) => {
    try {
        const project = await api.getProjectById(id);
        dispatch({ type: "FETCH_PROJECT_SUCCESS", payload: project });
    } catch (error) {
        dispatch({ type: "PROJECT_ERROR", payload: error.message });
    }
};

export const fetchPaginatedProjects = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedProjects(page, size);
        dispatch({
            type: "FETCH_PAGINATED_PROJECTS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "PROJECT_ERROR",
            payload: error.message,
        });
    }
};

export const searchProjects = (criteria) => async (dispatch) => {
    try {
        const projects = await api.searchProjects(criteria);
        dispatch({
            type: "SEARCH_PROJECTS_SUCCESS",
            payload: projects,
        });
    } catch (error) {
        dispatch({
            type: "PROJECT_ERROR",
            payload: error.message,
        });
    }
};

export const createProject = (project) => async (dispatch) => {
    try {
        const newProject = await api.createProject(project);
        dispatch({ type: "CREATE_PROJECT_SUCCESS", payload: newProject });
    } catch (error) {
        dispatch({ type: "PROJECT_ERROR", payload: error.message });
    }
};

export const updateProject = (id, project) => async (dispatch) => {
    try {
        const updatedProject = await api.updateProject(id, project);
        dispatch({ type: "UPDATE_PROJECT_SUCCESS", payload: updatedProject });
    } catch (error) {
        dispatch({ type: "PROJECT_ERROR", payload: error.message });
    }
};

export const deleteProject = (id) => async (dispatch) => {
    try {
        await api.deleteProject(id);
        dispatch({ type: "DELETE_PROJECT_SUCCESS", payload: id });
    } catch (error) {
        dispatch({ type: "PROJECT_ERROR", payload: error.message });
    }
};
