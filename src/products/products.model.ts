import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Orders } from "src/orders/orders.model";

@Table({tableName: 'products'})
export class Products extends Model<Products>{
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    product_name: string;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
    })
    price: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    stock: number; // maxsulot bor yoqligi uchun


    @HasMany(()=> Orders)
    orders: Orders[]; // bu modelga tayyorlan orderlar
}