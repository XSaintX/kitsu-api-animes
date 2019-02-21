import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeComponent } from './anime.component';

describe('AnimeComponent', () => {
  let component: AnimeComponent;
  let fixture: ComponentFixture<AnimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
