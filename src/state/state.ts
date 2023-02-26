import { Listener, Project, ProjectStatus } from "../models/project.js";

export class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// STATE MANAGEMENT
// singleton
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const projectId = Math.random().toString();
    const newProject = new Project(
      projectId,
      title,
      description,
      numberOfPeople,
      ProjectStatus.ACTIVE
    );
    this.projects.push(newProject);
    // call listeners
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus; // points at the elemet in projects
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  }
}

export const projectState = ProjectState.getInstance();
