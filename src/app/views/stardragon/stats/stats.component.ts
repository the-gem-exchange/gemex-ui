// Angular
import { Component, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

// Models
import { Stardragon } from 'app/models/stardragon';

// Services
import { GemExchangeAPI } from 'app/services/api.service';

@Component({
  selector:    'stardragon-stats',
  templateUrl: './stats.template.html',
  providers:   [GemExchangeAPI]
})
export class StatsComponent {

  public objectKeys = Object.keys;

  public categories = {
    'eyesight':['dasher','crafter','weaver','shooter'],
    'hearing':['crafter','fisher'],
    'speed':['sweeper','dasher','shooter','fisher'],
    'strength':['robber', 'crafter', 'sweeper', 'eater'],
    'population':['eater','fisher','dasher', 'sweeper', 'shooter', 'crafter', 'weaver', 'robber'],
  };

  // Ordered by population
  public species = [
    'eater',
    'fisher',
    'dasher',
    'sweeper',
    'crafter',
    'weaver',
    'shooter',
    'robber',
  ];

  constructor(){}

}
