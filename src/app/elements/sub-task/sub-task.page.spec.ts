import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubTaskPage } from './sub-task.page';

describe('SubTaskPage', () => {
  let component: SubTaskPage;
  let fixture: ComponentFixture<SubTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
