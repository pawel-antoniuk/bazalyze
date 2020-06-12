import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './config/ParticlesConfig';

declare var particlesJS: any;

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    particlesJS('particles-js', ParticlesConfig);
  }

}
