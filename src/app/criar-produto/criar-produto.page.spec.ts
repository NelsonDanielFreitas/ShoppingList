import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarProdutoPage } from './criar-produto.page';

describe('CriarProdutoPage', () => {
  let component: CriarProdutoPage;
  let fixture: ComponentFixture<CriarProdutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
