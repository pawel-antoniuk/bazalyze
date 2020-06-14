import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent implements OnInit, AfterViewInit {

  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;

  public title: string
  public subheader: string;

  private component: Type<any>;
  private complete: (component: ComponentRef<any>) => void;

  constructor(private resolver: ComponentFactoryResolver,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(this.component);
    const newComponent = this.container.createComponent(factory);

    this.complete(newComponent);
  }

  public setComponent<T>(component: Type<T>,
    complete: (component: ComponentRef<T>) => void) {

    this.component = component;
    this.complete = complete;
  }

  onClose() {
    this.dashboardService.removeComponent(this);
  }
}
