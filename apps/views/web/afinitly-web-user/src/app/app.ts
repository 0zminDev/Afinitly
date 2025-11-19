import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NxWelcome } from "./nx-welcome";

@Component({
	imports: [NxWelcome, RouterModule],
	selector: "af-root",
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class App {
	protected title = "afinitly-web-user";
}
