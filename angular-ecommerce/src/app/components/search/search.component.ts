import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search = new FormControl();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch() {
    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      value => {
        this.router.navigateByUrl(`/search/${value}`);
        console.log(value);
      }
    )
  }

  reset() {
    this.search.setValue('');
  }

}
