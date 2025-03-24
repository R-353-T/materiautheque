import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { IonContent } from "@ionic/angular/standalone";
import { List, ListItemOptions } from 'src/app/v1/interface/app.interface';
import { ListComponent } from "src/app/v1/component/organism/list/list.component";
import { ListItemComponent } from "src/app/v1/component/organism/list-item/list-item.component";

@Component({
  selector: "app-template-list",
  templateUrl: "./template-list.page.html",
  styleUrls: ["./template-list.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    ScrollTopButtonComponent,
    ListComponent,
    ListItemComponent
  ],
})
export class TemplateListPage implements OnInit {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly list = new List();
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.list.options.loading.set(true);

    const subscription = this.templateService.templateList$.subscribe({
      next: (templateList) => {
        if(templateList === undefined || templateList.length === 0) return;

        for (const template of templateList) {
          const item = new ListItemOptions();
          item.id = template.id;
          item.label = template.name;
          item.mode.set("redirection");
          item.redirection = ["/template/group-list/", template.id, "_"];
          this.list.add(item);
        }
      },

      error: (error) => {
        this.list.options.errors.set([error.message]);
        subscription.unsubscribe();
      },
    });
  }
}
