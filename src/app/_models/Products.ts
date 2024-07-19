export class Products{
    Id: number;
    name: string;
    category: string;
    price: number;
    barcode: string;
    image: string;
    inactive: boolean;
    unity: string;

    constructor() {
        this.Id = -1;
        this.name = '';
        this.category = '';
        this.price = 0;
        this.barcode = '';
        this.image = '';
        this.inactive = false;
        this.unity = '';
      }
}