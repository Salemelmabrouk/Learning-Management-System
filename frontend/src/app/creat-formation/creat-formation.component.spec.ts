import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatFormationComponent } from './creat-formation.component';

describe('CreatFormationComponent', () => {
  let component: CreatFormationComponent;
  let fixture: ComponentFixture<CreatFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatFormationComponent]
    });
    fixture = TestBed.createComponent(CreatFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
