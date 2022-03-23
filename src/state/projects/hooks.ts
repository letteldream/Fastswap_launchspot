import { useSelector } from 'react-redux'
import { AppState } from '../index';

export function useProjectData(): Array<any> {
  return useSelector((state: AppState) => state.projects.projectData)
}

export function useProjectDataa(): Array<any> {
  return useSelector((state: AppState) => state.projects.projectData)
}