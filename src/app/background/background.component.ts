import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './config/ParticlesConfig';
import { tsParticles } from "tsparticles";

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    tsParticles.load('particles-js', ParticlesConfig as any);
  }

}
