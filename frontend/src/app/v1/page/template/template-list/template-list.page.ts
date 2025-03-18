import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { Subscription } from "rxjs";
import { IonContent } from "@ionic/angular/standalone";
import { InfiniteScrollOptions, InfiniteScrollItem } from 'src/app/v1/interface/app.interface';

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
    InfiniteScrollComponent,
    ScrollTopButtonComponent,
  ],
})
export class TemplateListPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly options = new InfiniteScrollOptions();

  private subscription?: Subscription;
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.options.isLoading.set(true);

    this.subscription = this.templateService.templateList$.subscribe({
      next: (templateList) => {
        for (const template of templateList ?? []) {
          this.options.items.push(
            new InfiniteScrollItem(
              template.name,
              undefined,
              undefined,
              ["/template/group-list/", template.id, "_"],
            ),
          );
        }

        this.options.isComplete.set(templateList !== undefined);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
