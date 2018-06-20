import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// 3rd Party
import { default as swal} from 'sweetalert2';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

// animations
import { listAnimation, fadeAnimation }   from 'app/animations/traits.animations';

// Models
import { Stardragon }      from 'app/models/stardragon';
import { StardragonTrait } from 'app/models/stardragon-trait';

// Services
import { TraitsService } from './traits-service';
import { GemExchangeAPI } from 'app/services/api.service';

@Component({
  selector:    'traits',
  templateUrl: './traits.template.html',
  animations:  [listAnimation, fadeAnimation],
  providers:   [GemExchangeAPI, TraitsService]
})

export class TraitsComponent {

  public filters = {
    species: 'all',
    name:    '',
    rarity:  'all',
    type:    'all',
    subtype: 'all',
    sex:     'all'
  };

  public base_img_directory   = 'assets/img/';
  public img_directory:string = '';
  public headers:any = {};
  public header_img:string = "";

  public traits:Array<StardragonTrait> = [];
  public visibleTraits:Array<StardragonTrait> = [];
  public trait_descriptions = [];

  public headerImgDir = './assets/img/' + "fancy_header/";
  public header = {
    background: this.headerImgDir + "background.jpg",
    characters: this.headerImgDir + "characters.png",
    text:"Stareaters",
    subtext:"Mudskipper Subtype",
  };


  public typeahead = [];

  public router_sub:any;

  public display_index:boolean   = false;
  public traits_index:Array<any> = [];

  public available_species = [
    'starcrafter',
    'starfisher',
    'stardasher',
    'starrobber',
    'stareater',
    'starsweeper',
    'starweaver',
    'starshooter',
  ];

  public sexes = [
    'all',
    'feminine',
    'masculine',
    'unisex',
  ]

  constructor(
    private gem:           GemExchangeAPI,
    private traitsService: TraitsService,
    private route:         ActivatedRoute,
    private router:        Router
  ){}

  ngOnInit(){
    this.router_sub = this.route.params.subscribe(
      params => {
        /* Display traits for a specific species */
        if(params['species_name'] && params['subtype']){
          this.initTraitsPage(params['species_name'], params['subtype']);
        }
        else if(params['species_name']){
          this.initTraitsPage(params['species_name'])
        }
        /* Display a list of all species with traits pages */
        else{
          this.initTraitsIndex();
        }
      }
    );
  }

  ngOnDestroy(){
    this.router_sub.unsubscribe();
  }

  initTraitsIndex(){
    this.display_index = true;
    for(let s of this.available_species){
      this.traitsService.getLocalTraits(s).subscribe(
        data => {
          let trait = {
            name:s+"s",
            link:"/stardragons/traits/"+s,
            img: "/assets/img/" + data['img_directory'] + data['headers']['standard']
          };
          this.traits_index.push(trait);
        }
      );
    }
  }

  initTraitsPage(species, subtype = "all"){
    this.display_index = false;
    this.filters.species = species;
    this.filters.subtype = subtype;

    // Make API calls & get local data
    this.getTraitDescriptions();
    this.getHeaderImages();
    this.getAllTraits();

    // Change plural names to singular, IE "starshooters" to "starshooter"
    if (species.substring(species.length - 1) == "s"){
      species = species.substring(0, species.length-1);
    }
    // Route to index if species does not exist
    if(!this.available_species.includes(species) && species != 'all'){
      this.router.navigate(['/stardragons/traits']);
    }
  }

  getTraitDescriptions(){
    this.traitsService.getTraitDescriptions().subscribe(
      data => { this.trait_descriptions = data['trait_descriptions'] }
    );
  }

  getHeaderImages(){
    this.traitsService.getSpeciesHeaders().subscribe(
      data => { this.headers = data }
    );
  }

  /**
   *  @function getAllTraits
   *  @description Get all traits from all stardragons
   */
  getAllTraits(){
    this.traitsService.getAllTraits().subscribe(
      data => { this.traits = data },
      err  => { console.error("error getting traits", err) },
      ()   => { this.filterTraits() }
    );
  }

  /**
   *  @function filterTraits
   *  @description Filter the visible traits list by checking the status of all filter vars
   *  @param {string} filter - type, sex, etc
   *  @param {string} value - stardasher, "trait name", etc
   */
  filterTraits(){
    let filterTypes = Object.keys(this.filters); // Get all filter types
    let filteredTraits = this.traits.filter(trait => {
      return filterTypes.every(filterType => {

        let traitValue    = trait[filterType];
        let filteredValue = this.filters[filterType];

        let matchesExactly   = traitValue === filteredValue;
        let matchesAll       = filteredValue == 'all' || filteredValue == ''

        if(matchesExactly || matchesAll) return true;
      });
    });

    this.visibleTraits = filteredTraits;
    this.changeHeader();
    this.typeahead = this.getTypeaheadList("name");
  }

  /**
   *  @function filterTraitsByType
   *  @description Filter the traits list by type
   *  @param {string} type
   *  @return {object} traits - the filtered traits list
   */
  filterTraitsByType(type){
    return this.visibleTraits.filter(function(trait, index, self){
      if(
        (this.filters.name == trait.name || this.filters.name  == "")    &&
        (type == trait.type || type == "all") &&
        (this.filters.rarity == trait.rarity  || this.filters.rarity  == "all") &&
        (this.filters.subtype == trait.subtype || this.filters.subtype == "all") &&
        (this.filters.sex == trait.sex || (this.filters.sex == "unisex" && !trait.sex)||this.filters.sex == "all")
      ){
        return true;
      }
    }.bind(this));
  }

  /**
   *  @function clearAllFilters
   *  @description Reset all trait filters
   */
  clearAllFilters(){
    this.filters = {
      species: 'all',
      name:    '',
      rarity:  'all',
      type:    'all',
      subtype: 'all',
      sex:     'all',
    };
    this.filterTraits();
  }

  changeHeader(){
    if(this.filters.species != 'all'){
      let headerObj = this.headers[this.filters.species];
      let imgSrc = headerObj[this.filters.subtype] || headerObj['standard'] || "";
      if(imgSrc != ""){
        this.header_img = this.base_img_directory + `${this.filters.species}_traits/` + imgSrc;
      }
    }
    else{
      this.header_img = this.base_img_directory + 'stardragons_header_by_deletethestars.png';
    }
  }

  /**
   *  @function    getTypeaheadList
   *  @description Gets a list of traits for typeahead search. Shows only a list of visible traits.
   *  @param  {string} property - The property of the trait to filter
   *  @return {array}           - A unique array of property strings
   */
  getTypeaheadList(property): Array<any> {
    let list = this.visibleTraits.map(function (obj) { return obj[property] })
    return list.filter(function (elem, index, self) { return index === self.indexOf(elem) })
  }

  /**
   *  @function getSubspeciesTypes
   *  @description Get a list of available Subspecies Types from the traits object
   */
  getSubspeciesTypes(){
    let types = this.traits.map(a => a.subtype);
    let unique_types = types.filter(function(elem, index, self) {return index == self.indexOf(elem)});
    return unique_types;
  }
  getSubtypes(){
    return this.getSubspeciesTypes();
  }

  /**
   *  @function getSubspeciesTypes
   *  @description Get a list of available Trait Types from the traits object
   */
  getTraitTypes(){
    let types = this.traits.map(a => a.type);
    let unique_types = types.filter(function(elem, index, self) {return index == self.indexOf(elem)});
    return unique_types;
  }

  /**
   *  @function getTraitDescription
   *  @description Get the description for the specified trait type
   */
  getTraitDescription(type, field){
    let desc_obj = this.trait_descriptions.find(function(trait, index, self){
      return trait.type == type;
    });
    if(desc_obj){
      return desc_obj[field];
    }
    else{
      return "";
    }
  }

  getTraitTypeDescription(type, species){
    let desc_obj = this.trait_descriptions.find(function(trait, index, self){
      return trait.type == type;
    });
    if(desc_obj && desc_obj['description']){
      return desc_obj['description'][species];
    }
    return "";
  }
}
