export class Products{
    id: number;
    name: string;
    category: string;
    price: number;
    barcode: string;
    image: string;
    inactive: boolean;
    unity: string;

    constructor() {
        this.id = -1;
        this.name = '';
        this.category = '';
        this.price = 0;
        this.barcode = '';
        this.image = '';
        this.inactive = false;
        this.unity = '';
      }
}