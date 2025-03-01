import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../component/organism/header/header.component";
import { MarkdownComponent } from "ngx-markdown";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    MarkdownComponent,
  ],
})
export class HomePage {
  
  index?: string[];

  private readonly httpClient = inject(HttpClient);

  ionViewWillEnter() {
    this.index = undefined;

    this.httpClient.get<string[]>("/assets/backlog/index.json")
      .subscribe({
        next: (data) => {
          this.index = data;
        },
      });
  }
}
