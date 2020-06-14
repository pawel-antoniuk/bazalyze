import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

export interface CloneableDashboardItem<T> {
  cloneComponent(otherComponentInstance: T);
}

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent implements OnInit, AfterViewInit {

  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;

  public title: string
  public subheader: string;

  private componentType: Type<any>;
  private complete: (component: ComponentRef<any>) => void;
  private componentRef: ComponentRef<any>;

  constructor(private resolver: ComponentFactoryResolver,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(this.componentType);
    this.componentRef = this.container.createComponent(factory);

    this.complete(this.componentRef);
  }

  public setComponent<T>(component: Type<T>,
    complete: (component: ComponentRef<T>) => void) {

    this.componentType = component;
    this.complete = complete;
  }

  onClose() {
    this.dashboardService.removeComponent(this);
  }

  onClone() {
    this.dashboardService.addComponent(this.title, this.componentType, ref => {
      if(typeof this.componentRef.instance.cloneComponent === 'function') {
        this.componentRef.instance.cloneComponent(ref.instance);
      }
    });
  }
}
