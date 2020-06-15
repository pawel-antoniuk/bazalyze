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

  dashboardItems: {item: ComponentRef<DashboardItemComponent>, component?: ComponentRef<any>}[] = [];

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

    let item = {item: dashboardItem, component: null};
    this.dashboardItems.push(item);

    dashboardItem.instance.title = title;
    dashboardItem.instance.setComponent(component, ref => {
      item.component = ref;
      complete(ref);
      this.cdref.detectChanges();
    });
  }

  public removeComponent(componentInstance) {
    const itemIndex = this.dashboardItems.findIndex(o => o.item.instance === componentInstance
      || o.component.instance === componentInstance);
    this.dashboardItems[itemIndex].item.destroy();
    this.dashboardItems.splice(itemIndex, 1);
  }

  public setSuheader(componentInstance: any, subheader: string) {
    const item = this.dashboardItems.find(o => o.item.instance === componentInstance
      || o.component.instance === componentInstance);
    item.item.instance.subheader = subheader;
  }
}
