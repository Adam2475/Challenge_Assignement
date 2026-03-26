import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

type Project = {
  id: number;
  name: string;
  budget: number;
  description: string | null;
  hours_used: number;
};


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class HomePage implements OnInit {
    private readonly http = inject(HttpClient);

  protected readonly projects = signal<Project[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadProjects();
  }

  protected loadProjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<Project[]>('http://localhost:3000/read_projects').subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load projects. Check that the backend is running on port 3000.');
        this.isLoading.set(false);
      }
    });
  }

  protected trackByProjectId(_: number, project: Project): number {
    return project.id;
  }
}
