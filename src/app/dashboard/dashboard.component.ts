import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, Type } from '@angular/core';
import { ScatterPlotComponent } from '../scatter-plot/scatter-plot.component';
import { DashboardService } from '../dashboard.service';
import { DashboardItemComponent } from '../dashboard-item/dashboard-item.component';
import { ChangeDetectorRef } from '@angular/core';

function elementHeight(viewContainerRef: ViewContainerRef) {
  const element = (viewContainerRef.element.nativeElement as HTMLElement);
  return element.getBoundingClientRect().height;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;

  private componentsIndices: ComponentRef<DashboardItemComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver,
    private dashboardService: DashboardService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dashboardService.registerDashboardComponent(this);
  }

  public addComponent<T>(title: string, component: Type<T>,
    complete: (component: ComponentRef<T>) => void) {

    const factory = this.resolver.resolveComponentFactory(DashboardItemComponent);
    const dashboardItem = this.container.createComponent(factory);

    this.componentsIndices.push(dashboardItem);

    dashboardItem.instance.title = title;
    dashboardItem.instance.setComponent(component, ref => {
      complete(ref);
      this.cdref.detectChanges();
    });
  }

  public removeComponent(componentInstance) {
    const item = this.componentsIndices.find(o => o.instance === componentInstance);
    item.destroy()
  }
}
