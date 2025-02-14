import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {LanguageService} from "./services/language.service"
import { Location, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  providers: [LanguageService]
})

export class AppComponent implements OnInit {
  title = 'Cristhian Ortiz |  Developer';
  
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location,
    private languageService: LanguageService
    ){
  }
  
  ngOnInit(): void{
    
    this.languageService.initLanguage();

    this.titleService.setTitle( "Cristhian Ortiz |  Developer" );

    this.metaService.addTags([
      {name: 'keywords', content: 'Frontend, software, developer'},
      {name: 'description', content: 'Con 4+ años de experiencia desarrollando software'},
    ]);
    
    AOS.init(); 
  }
  
}


