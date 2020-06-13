import { Injectable, Type, ComponentRef } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private dashboardComponent: DashboardComponent;

  constructor() { }

  public addComponent<T>(title: string, component: Type<T>,
    complete: (component: ComponentRef<T>) => void) {

    return this.dashboardComponent.addComponent(title, component, complete);
  }

  public removeComponent(componentInstance: any) {
    this.dashboardComponent.removeComponent(componentInstance);
  }

  public registerDashboardComponent(dashboardComponent: DashboardComponent) {
    this.dashboardComponent = dashboardComponent;
  }
}
